from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Meal, MoodLog
from datetime import date
from openai import OpenAI
import os
import json
import time
from functools import lru_cache

suggestion_bp = Blueprint("suggestion", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@lru_cache(maxsize=50)
def cached_suggestions(user_id, day_key):
    return generate_ai_suggestions(user_id)

def generate_ai_suggestions(user_id):
    user = User.query.get_or_404(user_id)
    today_str = date.today().isoformat()
    totals = {"protein": 0, "carbs": 0, "fat": 0}
    meals = Meal.query.filter_by(user_id=user_id, date=today_str).all()

    recent_meals = []
    for meal in meals:
        recent_meals.append(meal.meal_type)
        for food in meal.food_items:
            totals["protein"] += food.protein or 0
            totals["carbs"] += food.carbs or 0
            totals["fat"] += food.fat or 0

    remaining = {
        "protein": max(0, user.protein_goal - totals["protein"]),
        "carbs": max(0, user.carb_goal - totals["carbs"]),
        "fat": max(0, user.fat_goal - totals["fat"]),
    }

    mood_log = MoodLog.query.filter_by(user_id=user_id, date=today_str).first()
    mood_score = mood_log.mood_score if mood_log else None
    energy_level = mood_log.energy_level if mood_log else None

    prompt = f"""
    You are a friendly, empathetic nutrition coach helping users make realistic food choices.

    Today's date: {today_str}
    User's recent meals: {', '.join(recent_meals) if recent_meals else 'No meals logged yet'}

    User's remaining daily nutrition goals:
    - Protein: {remaining['protein']}g remaining
    - Carbs: {remaining['carbs']}g remaining
    - Fat: {remaining['fat']}g remaining

    Current mood: {mood_score if mood_score is not None else 'unknown'} (1-5)
    Current energy level: {energy_level if energy_level is not None else 'unknown'} (1-5)

    Based on this:
    - Suggest 3-5 short, practical food ideas (meals or snacks)
    - Keep advice encouraging, specific, and under 3 sentences total
    - If mood or energy is low, include at least one suggestion that could boost them naturally (e.g. colorful foods, whole grains, hydration)
    - Avoid repeating foods already eaten
    - Return **only** a JSON array of suggestions like:
      ["suggestion1", "suggestion2", "suggestion3"]
    """

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            temperature=0.8,
        )
        text = response.output_text.strip()

        if text.startswith("```"):
            text = text.strip("`").replace("json", "").strip()
        try:
            suggestions = json.loads(text)
        except json.JSONDecodeError:
            suggestions = [s.strip("-• ").strip() for s in text.split("\n") if s.strip()]

    except Exception as e:
        print("OpenAI Suggestion Error:", e)
        suggestions = [
            "You're doing great — try a small protein boost like yogurt or eggs.",
            "Stay hydrated and aim for a colorful plate of veggies.",
            "A balanced snack with protein and fiber can help sustain your energy.",
        ]

    return suggestions

@suggestion_bp.get("/")
@jwt_required()
def get_suggestions():
    user_id = int(get_jwt_identity())
    today_str = date.today().isoformat()
    suggestions = cached_suggestions(user_id, today_str)

    user = User.query.get_or_404(user_id)
    totals = {"protein": 0, "carbs": 0, "fat": 0}
    meals = Meal.query.filter_by(user_id=user_id, date=today_str).all()
    for meal in meals:
        for food in meal.food_items:
            totals["protein"] += food.protein or 0
            totals["carbs"] += food.carbs or 0
            totals["fat"] += food.fat or 0

    remaining = {
        "protein": max(0, user.protein_goal - totals["protein"]),
        "carbs": max(0, user.carb_goal - totals["carbs"]),
        "fat": max(0, user.fat_goal - totals["fat"]),
    }

    return jsonify({
        "remaining": remaining,
        "suggestions": suggestions
    })

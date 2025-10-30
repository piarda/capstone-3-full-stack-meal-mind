from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Meal
from datetime import date

suggestion_bp = Blueprint("suggestion", __name__)

@suggestion_bp.get("/")
@jwt_required()
def get_suggestions():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    today_str = date.today().isoformat()

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

    suggestions = []
    if remaining["protein"] > 20:
        suggestions.append("Add lean protein: chicken, tofu, or Greek yogurt.")
    if remaining["carbs"] > 40:
        suggestions.append("Add complex carbs: brown rice, oats, or sweet potatoes.")
    if remaining["fat"] > 10:
        suggestions.append("Add healthy fats: avocado, olive oil, or nuts.")

    if not suggestions:
        suggestions.append("You're on track. Great job today!")

    return jsonify({"remaining": remaining, "suggestions": suggestions})

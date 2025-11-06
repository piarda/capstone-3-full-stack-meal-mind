from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta
from app.models import db, MoodLog, Meal, FoodItem
from sqlalchemy import func

mood_bp = Blueprint("mood", __name__)

@mood_bp.get("/today")
@jwt_required()
def get_today_mood():
    user_id = int(get_jwt_identity())
    today_str = date.today().isoformat()

    mood = MoodLog.query.filter_by(user_id=user_id, date=today_str).first()
    if not mood:
        return jsonify({"message": "No mood log for today"}), 404

    return jsonify(mood.serialize()), 200

@mood_bp.post("/")
@jwt_required()
def log_mood():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    date_str = data.get("date") or date.today().isoformat()

    if not data or "mood_score" not in data or "energy_level" not in data:
        return jsonify({"error": "Missing mood_score or energy_level"}), 400

    mood = MoodLog.query.filter_by(user_id=user_id, date=date_str).first()

    if mood:
        mood.mood_score = data["mood_score"]
        mood.energy_level = data["energy_level"]
    else:
        mood = MoodLog(
            user_id=user_id,
            mood_score=data["mood_score"],
            energy_level=data["energy_level"],
            date=date_str
        )
        db.session.add(mood)

    db.session.commit()
    return jsonify(mood.serialize()), 200

@mood_bp.get("/trends")
@jwt_required()
def get_mood_trends():
    user_id = int(get_jwt_identity())
    logs = (MoodLog.query
        .filter_by(user_id=user_id)
        .order_by(MoodLog.date.desc())
        .limit(7)
        .all())

    return jsonify([m.serialize() for m in logs]), 200

@mood_bp.get("/trends/combined")
@jwt_required()
def get_combined_mood_nutrition_trends():
    user_id = int(get_jwt_identity())

    today = date.today()
    start_date = today - timedelta(days=6)

    mood_logs = (
        MoodLog.query
        .filter(
            MoodLog.user_id == user_id,
            MoodLog.date >= start_date.isoformat()
        )
        .all()
    )
    mood_map = {m.date: m for m in mood_logs}

    nutrition_data = (
        db.session.query(
            Meal.date,
            func.sum(FoodItem.calories).label("calories"),
            func.sum(FoodItem.protein).label("protein"),
            func.sum(FoodItem.carbs).label("carbs"),
            func.sum(FoodItem.fat).label("fat"),
        )
        .join(FoodItem, FoodItem.meal_id == Meal.id)
        .filter(
            Meal.user_id == user_id,
            Meal.date >= start_date.isoformat()
        )
        .group_by(Meal.date)
        .all()
    )
    nutrition_map = {n.date: n for n in nutrition_data}

    combined = []
    for i in range(7):
        d = (start_date + timedelta(days=i)).isoformat()
        mood = mood_map.get(d)
        nutrition = nutrition_map.get(d)

        combined.append({
            "date": d,
            "mood_score": mood.mood_score if mood else None,
            "energy_level": mood.energy_level if mood else None,
            "calories": float(nutrition.calories or 0) if nutrition else 0,
            "protein": float(nutrition.protein or 0) if nutrition else 0,
            "carbs": float(nutrition.carbs or 0) if nutrition else 0,
            "fat": float(nutrition.fat or 0) if nutrition else 0,
        })

    return jsonify(combined), 200

@mood_bp.put("/<int:mood_id>")
@jwt_required()
def update_mood(mood_id):
    user_id = int(get_jwt_identity())
    mood = MoodLog.query.get_or_404(mood_id)

    if mood.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    mood_score = data.get("mood_score")
    energy_level = data.get("energy_level")

    if not (1 <= mood_score <= 5 and 1 <= energy_level <= 5):
        return jsonify({"error": "Values must be between 1 and 5"}), 400

    mood.mood_score = mood_score
    mood.energy_level = energy_level
    db.session.commit()

    return jsonify(mood.serialize()), 200

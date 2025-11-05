from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Meal
from datetime import date, timedelta

meal_bp = Blueprint("meal", __name__)

@meal_bp.get("/")
@jwt_required()
def get_meals():
    user_id = int(get_jwt_identity())
    meals = Meal.query.filter_by(user_id=user_id).order_by(Meal.date.desc()).all()
    return jsonify([m.serialize() for m in meals]), 200

@meal_bp.post("/")
@jwt_required()
def create_meal():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    meal = Meal(name=data.get("name"), date=date.today().isoformat(), user_id=user_id)
    db.session.add(meal)
    db.session.commit()
    return jsonify(meal.serialize()), 201

@meal_bp.put("/<int:meal_id>")
@jwt_required()
def update_meal(meal_id):
    user_id = int(get_jwt_identity())
    meal = Meal.query.get_or_404(meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    meal.name = data.get("name", meal.name)
    meal.date = data.get("date", meal.date)
    db.session.commit()

    return jsonify(meal.serialize()), 200

@meal_bp.delete("/<int:meal_id>")
@jwt_required()
def delete_meal(meal_id):
    user_id = int(get_jwt_identity())
    meal = Meal.query.get_or_404(meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(meal)
    db.session.commit()
    return jsonify({"message": "Meal deleted"}), 200

@meal_bp.get("/summary/today")
@jwt_required()
def daily_summary():
    user_id = int(get_jwt_identity())
    today_str = date.today().isoformat()
    meals = Meal.query.filter_by(user_id=user_id, date=today_str).all()

    total = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

    for meal in meals:
        for food in meal.food_items:
            total["calories"] += food.calories or 0
            total["protein"] += food.protein or 0
            total["carbs"] += food.carbs or 0
            total["fat"] += food.fat or 0

    return jsonify(total), 200

@meal_bp.get("/summary/week")
@jwt_required()
def weekly_summary():
    user_id = int(get_jwt_identity())
    today = date.today()
    week_ago = today - timedelta(days=6)

    summaries = []
    for i in range(7):
        day = (week_ago + timedelta(days=i)).isoformat()
        meals = Meal.query.filter_by(user_id=user_id, date=day).all()

        totals = {"date": day, "calories": 0, "protein": 0, "carbs": 0, "fat": 0}

        for meal in meals:
            for food in meal.food_items:
                totals["calories"] += food.calories or 0
                totals["protein"] += food.protein or 0
                totals["carbs"] += food.carbs or 0
                totals["fat"] += food.fat or 0

        summaries.append(totals)

    summaries.sort(key=lambda x: x["date"])

    return jsonify(summaries), 200

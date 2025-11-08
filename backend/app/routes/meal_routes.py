from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Meal
from datetime import date, datetime, timedelta
from sqlalchemy.orm import joinedload

meal_bp = Blueprint("meal", __name__)
VALID_MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"]

@meal_bp.get("/")
@jwt_required()
def get_meals():
    user_id = int(get_jwt_identity())
    meals = (
        Meal.query.options(joinedload(Meal.food_items))
        .filter_by(user_id=user_id)
        .order_by(Meal.date.desc())
        .all()
    )
    return jsonify([m.serialize() for m in meals]), 200

@meal_bp.post("/")
@jwt_required()
def create_meal():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    meal_type = data.get("meal_type", "Other")
    if meal_type not in VALID_MEAL_TYPES:
        return jsonify({"error": "Invalid meal type"}), 400

    try:
        if "date" in data and data["date"]:
            date_value = datetime.strptime(data["date"], "%Y-%m-%d").date()
        else:
            date_value = date.today()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    meal = Meal(
        name=data.get("name") or meal_type,
        meal_type=meal_type,
        date=date_value,
        user_id=user_id,
    )

    try:
        db.session.add(meal)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify(meal.serialize()), 201


@meal_bp.put("/<int:meal_id>")
@jwt_required()
def update_meal(meal_id):
    user_id = int(get_jwt_identity())
    meal = Meal.query.get_or_404(meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    if "meal_type" in data and data["meal_type"] not in VALID_MEAL_TYPES:
        return jsonify({"error": "Invalid meal type"}), 400

    meal.name = data.get("name", meal.name)
    meal.meal_type = data.get("meal_type", meal.meal_type)

    if "date" in data and data["date"]:
        try:
            meal.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

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
    today_value = date.today()
    meals = Meal.query.filter_by(user_id=user_id, date=today_value).all()

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
        day = week_ago + timedelta(days=i)
        meals = Meal.query.filter_by(user_id=user_id, date=day).all()

        totals = {"date": day.isoformat(), "calories": 0, "protein": 0, "carbs": 0, "fat": 0}

        for meal in meals:
            for food in meal.food_items:
                totals["calories"] += food.calories or 0
                totals["protein"] += food.protein or 0
                totals["carbs"] += food.carbs or 0
                totals["fat"] += food.fat or 0

        summaries.append(totals)

    summaries.sort(key=lambda x: x["date"])

    return jsonify(summaries), 200

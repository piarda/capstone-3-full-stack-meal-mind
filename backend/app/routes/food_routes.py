from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Meal, FoodItem

food_bp = Blueprint("food", __name__)

@food_bp.get("/<int:meal_id>")
@jwt_required()
def get_foods_for_meal(meal_id):
    user_id = get_jwt_identity()
    meal = Meal.query.get_or_404(meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    foods = [
        {
            "id": f.id,
            "name": f.name,
            "calories": f.calories,
            "protein": f.protein,
            "carbs": f.carbs,
            "fat": f.fat,
        }
        for f in meal.food_items
    ]
    return jsonify(foods), 200

@food_bp.post("/<int:meal_id>")
@jwt_required()
def add_food_to_meal(meal_id):
    user_id = get_jwt_identity()
    meal = Meal.query.get_or_404(meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    food = FoodItem(
        name= data.get("name"),
        calories=data.get("calories", 0),
        protein=data.get("protein", 0),
        carbs=data.get("carbs", 0),
        fat=data.get("fat", 0),
        meal_id=meal_id,
    )
    db.session.add(food)
    db.session.commit()
    return jsonify({"message": "Food item added", "food_id": food.id}), 201

@food_bp.put("/<int:food_id>")
@jwt_required()
def update_food(food_id):
    user_id = get_jwt_identity()
    food = FoodItem.query.get_or_404(food_id)
    meal = Meal.query.get(food.meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    food.name = data.get("name", food.name)
    food.calories = data.get("calories", food.calories)
    food.protein = data.get("protein", food.protein)
    food.carbs = data.get("carbs", food.carbs)
    food.fat = data.get("fat", food.fat)
    db.session.commit()
    return jsonify({"message": "Food item updated"}), 200

@food_bp.delete("/<int:food_id>")
@jwt_required()
def delete_food(food_id):
    user_id = get_jwt_identity()
    food = FoodItem.query.get_or_404(food_id)
    meal = Meal.query.get(food.meal_id)

    if meal.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(food)
    db.session.commit()
    return jsonify({"message": "Food item deleted"}), 200

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User

user_bp = Blueprint("user", __name__)

@user_bp.get("/me")
@jwt_required()
def get_user_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({
        "username": user.username,
        "email": user.email,
        "calorie_goal": user.calorie_goal,
        "protein_goal": user.protein_goal,
        "carb_goal": user.carb_goal,
        "fat_goal": user.fat_goal
    }), 200


@user_bp.put("/goals")
@jwt_required()
def update_goals():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    for field in ["calorie_goal", "protein_goal", "carb_goal", "fat_goal"]:
        if field in data:
            setattr(user, field, int(data[field]))

    db.session.commit()
    return jsonify({"message": "Goals updated successfully!"}), 200

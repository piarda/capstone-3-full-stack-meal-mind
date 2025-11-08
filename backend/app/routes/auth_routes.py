import re
from email_validator import validate_email, EmailNotValidError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import db, User

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json()
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        valid = validate_email(data["email"])
        email = valid.email
    except EmailNotValidError as e:
        return jsonify({"error": f"Invalid email: {str(e)}"}), 400

    if not re.match(r"^[a-zA-Z0-9_]{3,20}$", data["username"]):
        return jsonify({
            "error": "Username must be 3-20 characters, alphanumeric and underscore only"
        }), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    if User.query.filter((User.username == data["username"]) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 400

    user = User(username=data["username"], email=email)
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "username": user.username,
        "email": user.email
    }), 201

@auth_bp.post("/login")
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "username": user.username,
        "email": user.email
    }), 200

@auth_bp.get("/me")
@jwt_required()
def get_current_user():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({
        "username": user.username,
        "email": user.email
    }), 200

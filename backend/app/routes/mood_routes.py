from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from app.models import db, MoodLog

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

    if not all(k in data for k in ("mood_score", "energy_level")):
        return jsonify({"error": "Missing mood_score or energy_level"}), 400

    today_str = date.today().isoformat()
    mood = MoodLog.query.filter_by(user_id=user_id, date=today_str).first()

    if mood:
        mood.mood_score = data["mood_score"]
        mood.energy_level = data["energy_level"]
    else:
        mood = MoodLog(
            user_id=user_id,
            mood_score=data["mood_score"],
            energy_level=data["energy_level"],
            date=today_str
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

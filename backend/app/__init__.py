from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )
    
    @app.before_request
    def handle_options_request():
        if request.method == "OPTIONS":
            return jsonify({}), 200
        
    @jwt.unauthorized_loader
    def unauthorized_callback(err):
        return jsonify({"error": "Missing or invalid token"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(err):
        return jsonify({"error": "Invalid token"}), 422
        
    from app.routes.auth_routes import auth_bp
    from app.routes.food_routes import food_bp
    from app.routes.meal_routes import meal_bp
    from app.routes.suggestion_routes import suggestion_bp
    from app.routes.mood_routes import mood_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(food_bp, url_prefix="/api/foods")
    app.register_blueprint(meal_bp, url_prefix="/api/meals")
    app.register_blueprint(suggestion_bp, url_prefix="/api/suggestions")
    app.register_blueprint(mood_bp, url_prefix="/api/moods")

    with app.app_context():
        db.create_all()

    return app

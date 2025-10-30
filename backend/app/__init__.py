from flask import Flask
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
    CORS(app, supports_credentials=True)

    from app.routes.auth_routes import auth_bp
    from app.routes.food_routes import food_bp
    from app.routes.meal_routes import meal_bp
    from app.routes.suggestion_routes import suggestion_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(food_bp, url_prefix="/api/foods")
    app.register_blueprint(meal_bp, url_prefix="/api/meals")
    app.register_blueprint(suggestion_bp, url_prefix="/api/suggestions")

    with app.app_context():
        db.create_all()

    return app

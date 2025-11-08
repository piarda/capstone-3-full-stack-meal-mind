from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from .config import Config
import os

db = SQLAlchemy()
jwt = JWTManager()
load_dotenv()

def create_app(testing=False):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate = Migrate(app, db)
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    if testing:
        app.config.update(
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:',
            TESTING=True,
            SECRET_KEY='test_secret'
        )
    else:
        app.config.from_object('app.config.Config')
    
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
    from app.routes.user_routes import user_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(food_bp, url_prefix="/api/foods")
    app.register_blueprint(meal_bp, url_prefix="/api/meals")
    app.register_blueprint(suggestion_bp, url_prefix="/api/suggestions")
    app.register_blueprint(mood_bp, url_prefix="/api/moods")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    with app.app_context():
        db.create_all()

    return app

from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    calorie_goal = db.Column(db.Integer, default=2000)
    protein_goal = db.Column(db.Integer, default=150)
    carb_goal = db.Column(db.Integer, default=250)
    fat_goal = db.Column(db.Integer, default=70)
    meals = db.relationship("Meal", backref="user", lazy=True, cascade="all, delete")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    food_items = db.relationship("FoodItem", backref="meal", lazy=True, cascade="all, delete")

class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    calories = db.Column(db.Float)
    protein = db.Column(db.Float)
    carbs = db.Column(db.Float)
    fat = db.Column(db.Float)
    meal_id = db.Column(db.Integer, db.ForeignKey("meal.id"), nullable=False)

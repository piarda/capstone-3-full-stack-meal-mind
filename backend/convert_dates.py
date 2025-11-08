from app import create_app, db
from app.models import Meal, MoodLog
from datetime import datetime

app = create_app()

with app.app_context():
    meals = Meal.query.all()
    for meal in meals:
        if isinstance(meal.date, str):
            try:
                meal.date = datetime.strptime(meal.date, "%Y-%m-%d").date()
            except Exception as e:
                print(f"Skipping meal {meal.id}: {e}")

    moods = MoodLog.query.all()
    for mood in moods:
        if isinstance(mood.date, str):
            try:
                mood.date = datetime.strptime(mood.date, "%Y-%m-%d").date()
            except Exception as e:
                print(f"Skipping mood {mood.id}: {e}")

    db.session.commit()
    print("✅ All string dates converted to proper Date objects.")

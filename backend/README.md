# MealMind Backend

The backend for **MealMind**, a full-stack nutrition and mood tracking app built with **Flask**, **SQLAlchemy**, and **JWT authentication**.

---

## Features:
- User registration and authentication using JWT  
- CRUD operations for meals and food items  
- Mood and energy tracking with daily and weekly summaries  
- Optimized database performance using eager loading (`joinedload`)  
- AI-powered meal suggestions via the **OpenAI API**  
- Clean RESTful architecture with modular blueprints  

---

## Tech Stack:
**Backend:** Flask, Flask-JWT-Extended, SQLAlchemy, Flask-Migrate, Flask-CORS  
**Database:** SQLite (local dev) / PostgreSQL (production)  
**AI Integration:** OpenAI API  
**Testing:** pytest, pytest-flask  

---

## API Blueprints:

| **Blueprint** | **Prefix** | **Purpose** |
|----------------|------------|--------------|
| `auth_bp` | `/api/auth` | User registration & login |
| `user_bp` | `/api/user` | User profile & goals |
| `meal_bp` | `/api/meals` | Manage meals & summaries |
| `food_bp` | `/api/foods` | Manage food items |
| `mood_bp` | `/api/moods` | Log mood & view trends |
| `suggestion_bp` | `/api/suggestions` | AI meal suggestions (OpenAI) |

---

## Getting Started:

### 1. Setup Environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables:
Create a `.env` file in `/backend` with:
```
FLASK_APP=app
FLASK_ENV=development
JWT_SECRET_KEY=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=sqlite:///meal_mind.db
```

### 3. Initialize Database:
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 4. Run the Server:
```bash
flask run
```

Server runs on `http://localhost:5555`

---

## Running Tests:
```bash
pytest
```

---

## Requirements:
See [`requirements.txt`](../requirements.txt) for full dependency list.

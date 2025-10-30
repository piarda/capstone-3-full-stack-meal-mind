# MealMind 

A nutrition tracking and meal suggestion app built with Flask and React.

## Features:
- User authentication (JWT)
- Track meals and macronutrients
- Smart food suggestions based on goals
- Daily nutrition summaries with charts

## Tech Stack:
Flask | Flask-JWT-Extended | SQLAlchemy | React | Chart.js | TailwindCSS

## API Routes:
[List REST endpoints...]
POST /api/auth/register
POST /api/auth/login
GET /api/meals          # List current user's meals
POST /api/meals         # Create a meal
PUT /api/meals/:id      # Edit a meal
DELETE /api/meals/:id   # Delete a meal
GET /api/summary/today  # Get today's nutrition summary
GET /api/suggestions    # Get smart meal suggestions

## Getting Started
### Backend
1. `pip install -r requirements.txt`
2. `flask run`

### Frontend
1. `npm install`
2. `npm start`

## Environment Variables
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `REACT_APP_API_URL` (if needed)

## Future Improvements
- Nutritionix API integration
- Goal customization per day
- Social / shareable meal plans

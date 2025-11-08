# MealMind 

MealMind is a full-stack nutrition and wellness tracker that helps users log meals, track daily macros, and monitor mood and energy trends over time.  
Built with **Flask**, **React**, and **SQLAlchemy**, it provides personalized insights into how nutrition affects well-being.


## Features:
- JWT-based user authentication and secure API.
- Log meals, track calories and macronutrients.
- Log daily mood and energy levels.
- Visualize nutrition and mood trends.
- Personalized daily and weekly summaries.
- Dark/Light mode toggle with persistent user preference.
- Optimized database performance with eager loading.
- Uses the OpenAI API to generate personalized meal and nutrition suggestions based on user goals.


## Tech Stack:
Backend: Flask, Flask-JWT-Extended, SQLAlchemy, Flask-Migrate, Flask-CORS
Frontend: React, TailwindCSS, Chart.js
Database: SQLite (via SQLAlchemy ORM)
AI Integration: OpenAI API for intelligent meal and nutrition suggestions
Testing: Pytest & Pytest-Flask
Environment Management: Python-dotenv


## API Routes:
| **Category**    | **Method** | **Endpoint**                 | **Description**                                  |
| --------------- | ---------- | ---------------------------- | ------------------------------------------------ |
| **Auth**        | `POST`     | `/api/auth/register`         | Register a new user                              |
|                 | `POST`     | `/api/auth/login`            | Authenticate and return a JWT token              |
| **User**        | `GET`      | `/api/user/profile`          | Fetch current user's profile                     |
|                 | `PUT`      | `/api/user/profile`          | Update user goals (calorie, macros, etc.)        |
| **Meals**       | `GET`      | `/api/meals/`                | List current user's meals                        |
|                 | `POST`     | `/api/meals/`                | Create a new meal                                |
|                 | `PUT`      | `/api/meals/<meal_id>`       | Edit an existing meal                            |
|                 | `DELETE`   | `/api/meals/<meal_id>`       | Delete a meal                                    |
|                 | `GET`      | `/api/meals/summary/today`   | Get today’s nutrition summary                    |
|                 | `GET`      | `/api/meals/summary/week`    | Get weekly nutrition totals                      |
| **Foods**       | `GET`      | `/api/foods/`                | Get all foods for the current user               |
|                 | `POST`     | `/api/foods/`                | Add a new food item                              |
|                 | `PUT`      | `/api/foods/<food_id>`       | Edit a food item                                 |
|                 | `DELETE`   | `/api/foods/<food_id>`       | Delete a food item                               |
| **Moods**       | `GET`      | `/api/moods/today`           | Get today’s mood and energy log                  |
|                 | `POST`     | `/api/moods/`                | Create or update today’s mood entry              |
|                 | `GET`      | `/api/moods/trends`          | Get past week’s mood logs                        |
|                 | `GET`      | `/api/moods/trends/combined` | Combine mood and nutrition trends                |
| **Suggestions** | `GET`      | `/api/suggestions/`          | Get AI-powered meal suggestions (via OpenAI API) |


## Setup Instructions:

### Backend
```bash
cd backend
pip install -r requirements.txt
flask run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables:
- JWT_SECRET_KEY  
- DATABASE_URL  
- REACT_APP_API_URL  


#frontend README
# 🥗 MealMind Frontend

The frontend for **MealMind**, built with **React (Vite)** and **TailwindCSS**.  
It provides a clean, responsive dashboard for tracking meals, nutrients, and mood — powered by the Flask backend.

---

## Features:
- Secure login and registration (JWT-based authentication)  
- Dashboard to view daily and weekly nutrition summaries  
- Track meals and macronutrients in real time  
- Interactive data visualizations using **Chart.js**  
- Fetches data directly from Flask API
- Smart meal suggestions powered by **OpenAI API**
- Dark/Light mode toggle with persistent user preference

---

## Tech Stack:
**Frontend:** React (Vite), TailwindCSS, Chart.js  
**State Management:** React Context API  
**API Requests:** `fetch()`  
**Styling:** TailwindCSS + custom utility classes  

---

## Getting Started:

### 1. Install Dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Create a `.env` file in `/frontend` with:
```
VITE_API_URL=http://localhost:5555/api
```

### 3. Run the App:
```bash
npm run dev
```
The app will run on `http://localhost:5173`

---

## Folder Structure:

```
frontend/
│
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Dashboard, Login, Register, etc.
│   ├── context/          # AuthContext for user state
│   ├── api/              # API helper functions (fetch)
│   └── App.jsx           # Main app entry
│
└── package.json
```

---

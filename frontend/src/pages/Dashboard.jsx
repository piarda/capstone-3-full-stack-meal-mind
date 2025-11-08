import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import api from "../api/api";
import AddMealForm from "../components/AddMealForm";
import MealCard from "../components/MealCard";
import MoodLogForm from "../components/MoodLogForm";
import NutritionSummaryChart from "../components/NutritionSummaryChart";
import NutritionTrendChart from "../components/NutritionTrendChart";
import Suggestions from "../components/Suggestions";

const Dashboard = () => {
  const { user, loadingUser, refreshUser } = useUser();
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [trendRefresh, setTrendRefresh] = useState(0);

  useEffect(() => {
    refreshUser();
  }, []);

  const fetchMeals = async () => {
    try {
      const data = await api.get("/meals");
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      const today = local.toISOString().split("T")[0];
      const todaysMeals = data.filter((meal) => meal.date === today);
      setMeals(todaysMeals);
    } catch (err) {
      console.error("Error loading meals:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await api.get("/meals/summary/today");
      setSummary(data);
    } catch (err) {
      console.error("Error loading summary:", err);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await api.get("/suggestions");
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("Error loading suggestions:", err);
    }
  };

  const addMeal = async ({ meal_type, date }) => {
    const data = await api.post("/meals", { meal_type, date });
    setMeals((prev) => [...prev, data]);
    await fetchSummary();
    await fetchSuggestions();
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!loadingUser && user) {
      const fetchData = async () => {
        try {
          await Promise.all([fetchMeals(), fetchSummary(), fetchSuggestions()]);
        } catch (err) {
          console.error("Error loading dashboard:", err);
        } finally {
          setDashboardLoading(false);
        }
      };
      fetchData();
    }
  }, [user, loadingUser]);

  if (loadingUser || dashboardLoading) {
    return <p className="text-center mt-10 text-gray-500">Loading your dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 transition-colors duration-300">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
          Welcome back, {user?.username || "User"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's your daily nutrition and mood/energy overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            🍽️ Today's Summary
          </h2>
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Calories</p>
              <p className="text-xl font-bold text-blue-500 dark:text-blue-400">
                {summary.calories || 0}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Protein</p>
              <p className="text-xl font-bold text-green-500 dark:text-green-400">
                {summary.protein || 0}g
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Carbs</p>
              <p className="text-xl font-bold text-yellow-500 dark:text-yellow-400">
                {summary.carbs || 0}g
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fat</p>
              <p className="text-xl font-bold text-red-500 dark:text-red-400">
                {summary.fat || 0}g
              </p>
            </div>
          </div>

          <NutritionSummaryChart summary={summary} refreshTrigger={refreshTrigger} />

          <hr className="border-gray-300 dark:border-gray-700 mb-4" />

          <div className="mt-6 space-y-4">
            {[
              { label: "Calories", key: "calories", goalKey: "calorie_goal", color: "bg-blue-500" },
              { label: "Protein", key: "protein", goalKey: "protein_goal", color: "bg-green-500" },
              { label: "Carbs", key: "carbs", goalKey: "carb_goal", color: "bg-yellow-500" },
              { label: "Fat", key: "fat", goalKey: "fat_goal", color: "bg-red-500" },
            ].map(({ label, key, goalKey, color }) => {
              const goal = user?.[goalKey] ?? 0;
              const current = summary[key] || 0;
              const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(current)} / {goal} {key === "calories" ? "kcal" : "g"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            🥗 Meals
          </h2>
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />

          <div className="mb-4">
            <AddMealForm addMeal={addMeal} />
          </div>

          {meals.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No meals logged yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  refreshMeals={async () => {
                    await fetchMeals();
                    await fetchSummary();
                    await fetchSuggestions();
                    setTrendRefresh((prev) => prev + 1);
                  }}
                />
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 italic leading-relaxed">
            Showing meals logged for today only.
            <br />
            View all meals on the <strong>Meals</strong> page.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            🧠 Mood & Energy
          </h2>
          <MoodLogForm />
        </section>

        <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 xl:col-span-2 transition-colors">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            📊 7-Day Nutrition Trend
          </h2>
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />
          <NutritionTrendChart refreshTrigger={trendRefresh} />
        </section>

        <Suggestions />
      </div>
    </div>
  );
};

export default Dashboard;

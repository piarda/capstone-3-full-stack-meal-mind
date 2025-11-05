import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import AddMealForm from "../components/AddMealForm";
import MealCard from "../components/MealCard";
import MoodLogForm from "../components/MoodLogForm";
import NutritionSummaryChart from "../components/NutritionSummaryChart";
import NutritionTrendChart from "../components/NutritionTrendChart";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [summary, setSummary] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMeals = async () => {
        const data = await api.get("/meals");
        setMeals(data);
    };

    const fetchSummary = async () => {
        const data = await api.get("/meals/summary/today");
        setSummary(data);
    };

    const fetchSuggestions = async () => {
        const data = await api.get("/suggestions");
        setSuggestions(data.suggestions);
    };

    const addMeal = async (name) => {
        const data = await api.post("/meals", { name });
        setMeals((prev) => [...prev, { id: data.id, name: data.name, date: data.date }]);
        await fetchSummary();
        await fetchSuggestions();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchMeals(), fetchSummary(), fetchSuggestions()]);
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 transition-colors duration-300">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
            Welcome back, {user?.username || "User"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
            Here’s your daily nutrition and mood overview.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                🍽️ Today’s Summary
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Calories</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {summary.calories || 0}
                </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Protein</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {summary.protein || 0}g
                </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Carbs</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {summary.carbs || 0}g
                </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Fat</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {summary.fat || 0}g
                </p>
                </div>
            </div>
            <NutritionSummaryChart summary={summary} />
            </section>

            <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                🥗 Meals
                </h2>
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
                    }}
                    />
                ))}
                </ul>
            )}
            </section>

            <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                🧠 Mood Log
            </h2>
            <MoodLogForm />
            </section>

            <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 xl:col-span-2 transition-colors">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                📊 7-Day Nutrition Trend
            </h2>
            <NutritionTrendChart />
            </section>

            <section className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow p-6 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                💡 Suggestions
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                {suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
                ))}
            </ul>
            </section>
        </div>
        </div>
    );
};

export default Dashboard;

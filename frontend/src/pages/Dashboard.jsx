import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import AddMealForm from "../components/AddMealForm";
import MealCard from "../components/MealCard";

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
        setMeals((prev) => [
            ...prev,
            { id: data.id, name: data.name, date: data.date },
        ]);
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

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-2">
                Welcome, {user?.username || "User"}!
            </h1>
            <p className="text-gray-600 mb-6">Here is your daily overview.</p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Today's Summary</h2>
                <div className="grid grid-cols-4 gap-4">
                <div>Calories: {summary.calories || 0}</div>
                <div>Protein: {summary.protein || 0}g</div>
                <div>Carbs: {summary.carbs || 0}g</div>
                <div>Fat: {summary.fat || 0}g</div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Meals</h2>
                <AddMealForm addMeal={addMeal} />
                <hr className="my-4 border-gray-300" />
                {meals.length === 0 ? (
                <p>No meals logged yet.</p>
                ) : (
                <ul className="space-y-2">
                    {meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} refreshMeals={async () => {
                            await fetchMeals();
                            await fetchSummary();
                            await fetchSuggestions();
                        }} />
                    ))}
                </ul>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Suggestions</h2>
                <ul className="list-disc list-inside space-y-1">
                    {suggestions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;

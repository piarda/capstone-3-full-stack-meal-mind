import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [summary, setSummary] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://localhost:5555/api";

    const fetchMeals = async () => {
        const res = await axios.get(`${API_BASE}/meal`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setMeals(res.data);
    };

    const fetchSummary = async () => {
        const res = await axios.get(`${API_BASE}/meal/summary/today`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
    };

    const fetchSuggestions = async () => {
        const res = await axios.get(`${API_BASE}/suggestion`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(res.data.suggestions);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchMeals(), fetchSummary(), fetchSuggestions()]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

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
                {meals.length === 0 ? (
                <p>No meals logged yet.</p>
                ) : (
                <ul className="space-y-2">
                    {meals.map((meal) => (
                    <li key={meal.id} className="p-2 border rounded">
                        {meal.name} - {meal.date}
                    </li>
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

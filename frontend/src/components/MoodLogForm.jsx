import React, { useEffect, useState } from "react";
import api from "../api/api";

const MoodLogForm = () => {
    const [mood, setMood] = useState("");
    const [energy, setEnergy] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchTodayMood = async () => {
        try {
        const data = await api.get("/moods/today");
        setMood(data.mood_score);
        setEnergy(data.energy_level);
        setMessage("Mood log loaded for today");
        } catch (err) {
        console.log("No existing mood log for today.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayMood();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mood || !energy) return;

        try {
        await api.post("/moods", {
            mood_score: parseInt(mood),
            energy_level: parseInt(energy),
        });
        setMessage("Mood log saved!");
        } catch (err) {
        console.error("Error saving mood log:", err);
        setMessage("Error saving mood log.");
        }
    };

    if (loading)
        return <p className="text-gray-500 dark:text-gray-400">Loading mood log...</p>;

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            🧠 Mood & Energy
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Mood (1-5)
            </label>
            <input
                type="number"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-2 py-1 w-20 text-center focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
            />
            </div>

            <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Energy (1-5)
            </label>
            <input
                type="number"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-2 py-1 w-20 text-center focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
            />
            </div>

            <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
            Save
            </button>
        </form>

        {message && (
            <p className="mt-3 text-sm text-green-600 dark:text-green-400 italic">
            {message}
            </p>
        )}
        </div>
    );
};

export default MoodLogForm;

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

    if (loading) return <p className="text-gray-500">Loading mood log...</p>;

    return (
        <div className="border-t pt-4 mt-6">
        <h2 className="text-2xl font-semibold mb-2">Mood & Energy</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-center">
            <div>
            <label className="block text-sm text-gray-700 mb-1">Mood (1-5)</label>
            <input
                type="number"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="border rounded px-2 py-1 w-20 text-center"
                required
            />
            </div>

            <div>
            <label className="block text-sm text-gray-700 mb-1">Energy (1-5)</label>
            <input
                type="number"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="border rounded px-2 py-1 w-20 text-center"
                required
            />
            </div>

            <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
            Save
            </button>
        </form>

        {message && (
            <p className="mt-2 text-sm text-green-600">{message}</p>
        )}
        </div>
    );
};

export default MoodLogForm;

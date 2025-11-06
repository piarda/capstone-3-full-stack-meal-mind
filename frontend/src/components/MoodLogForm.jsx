import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const MoodLogForm = () => {
    const navigate = useNavigate();
    const [mood, setMood] = useState("");
    const [energy, setEnergy] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [isExistingLog, setIsExistingLog] = useState(false);

    const fetchTodayMood = async () => {
        try {
            const data = await api.get("/moods/today");
            if (data?.mood_score) {
                setMood(data.mood_score);
                setEnergy(data.energy_level);
                setMessage("Mood & Energy logged");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            console.log("No existing mood/energy log for today.");
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

        setSaving(true);
        try {
            await api.post("/moods", {
                mood_score: parseInt(mood),
                energy_level: parseInt(energy),
            });
        
            setIsExistingLog(true);
            setMessage(isExistingLog ? "Mood & Energy updated!" : "Mood & Energy saved!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error("Error saving mood/energy log:", err);
            setMessage("Error saving mood/energy log.");
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    if (loading)
        return <p className="text-gray-500 dark:text-gray-400">Loading mood/energy log...</p>;

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 transition-colors duration-300">

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
                    disabled={saving}
                    className={`${
                        saving
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                    } text-white px-4 py-2 rounded transition`}
                >
                    {saving ? "Saving..." : isExistingLog ? "Update" : "Save"}
                </button>
            </form>

            {message && (
                <p className="mt-3 text-sm text-green-600 dark:text-green-400 italic">
                    {message}
                </p>
            )}
            <br></br>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Record your daily mood and energy levels (1–5), with 5 being the best/most energized.
            </p>

            <div className="mt-4">
                <button
                    onClick={() => navigate("/mood-trends")}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline transition"
                >
                    View Mood & Energy Trends
                </button>
            </div>
        </div>
    );
};

export default MoodLogForm;

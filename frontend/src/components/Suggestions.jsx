// frontend/src/components/Suggestions.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [remaining, setRemaining] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const data = await api.get("/suggestions");
            setSuggestions(data.suggestions || []);
            setRemaining(data.remaining || {});
        } catch (err) {
            console.error("Error fetching suggestions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-5 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    💡 Nutrition Suggestions
                </h2>
                <button
                    onClick={fetchSuggestions}
                    disabled={loading}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Loading..." : "↻ Refresh"}
                </button>
            </div>
            <hr className="border-gray-300 dark:border-gray-700 mb-4" />

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400 italic">
                    Fetching personalized suggestions...
                </p>
            ) : (
                <>
                    <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                        Remaining goals:{" "}
                        <span className="font-medium text-blue-500">
                            {remaining.protein ?? 0}g protein
                        </span>
                        ,{" "}
                        <span className="font-medium text-green-500">
                            {remaining.carbs ?? 0}g carbs
                        </span>
                        ,{" "}
                        <span className="font-medium text-yellow-500">
                            {remaining.fat ?? 0}g fat
                        </span>
                    </div>

                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Suggestions;

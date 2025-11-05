import React, { useState } from "react";

const AddMealForm = ({ addMeal }) => {
    const [mealName, setMealName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mealName.trim()) return;

        setLoading(true);
        try {
        await addMeal(mealName.trim());
        setMealName("");
        } finally {
        setLoading(false);
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
        <input
            type="text"
            placeholder="New meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-2 py-1 flex-1 focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <button
            type="submit"
            disabled={loading}
            className={`${
            loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-1 rounded transition`}
        >
            {loading ? "Adding..." : "Add"}
        </button>
        </form>
    );
};

export default AddMealForm;

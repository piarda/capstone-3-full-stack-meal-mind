import React, { useState } from "react";

const AddMealForm = ({ addMeal }) => {
    const [mealType, setMealType] = useState("Other");
    const [date, setDate] = useState(() => {
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        return local.toISOString().split("T")[0];
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addMeal({ meal_type: mealType, date });
            setMealType("Other");
            setDate(() => {
                const now = new Date();
                const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
                return local.toISOString().split("T")[0];
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-3 items-center mb-4 transition-all duration-300"
        >
            <div className="flex flex-col">
                <label
                    htmlFor="mealType"
                    className="text-sm text-gray-700 dark:text-gray-300 mb-1"
                >
                    Meal Type
                </label>
                <select
                    id="mealType"
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-3 py-1 focus:ring-2 focus:ring-blue-400 outline-none transition"
                >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label
                    htmlFor="mealDate"
                    className="text-sm text-gray-700 dark:text-gray-300 mb-1"
                >
                    Date
                </label>
                <input
                    id="mealDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-3 py-1 focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`${
                    loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded h-fit self-end transition`}
            >
                {loading ? "Adding..." : "Add Meal"}
            </button>
        </form>
    );
};

export default AddMealForm;

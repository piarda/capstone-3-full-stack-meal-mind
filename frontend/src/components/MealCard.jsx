import React, { useState } from "react";
import api from "../api/api";
import FoodList from "./FoodList";

const MealCard = ({ meal, refreshMeals }) => {
    const [editing, setEditing] = useState(false);
    const [mealType, setMealType] = useState(meal.meal_type);
    const [date, setDate] = useState(meal.date);
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await api.put(`/meals/${meal.id}`, {
                meal_type: mealType,
                date,
            });
            setEditing(false);
            refreshMeals();
        } catch (error) {
            console.error("Error updating meal:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/meals/${meal.id}`);
            refreshMeals();
        } catch (error) {
            console.error("Error deleting meal:", error);
        }
    };

    return (
        <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col gap-2 transition-colors duration-300">
            <div className="flex flex-wrap justify-between items-center gap-2">
                {editing ? (
                    <div className="flex flex-wrap gap-2 w-full">
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-2 py-1"
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded px-2 py-1"
                        />

                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className={`${
                                saving
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                            } text-white px-2 py-1 rounded`}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setMealType(meal.meal_type);
                                setDate(meal.date);
                            }}
                            className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-between items-center w-full">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                            {meal.meal_type} — {meal.date}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <FoodList mealId={meal.id} refreshDashboard={refreshMeals} />
        </div>
    );
};

export default MealCard;

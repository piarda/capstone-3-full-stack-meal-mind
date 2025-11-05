import React, { useState } from "react";
import api from "../api/api";
import FoodList from "./FoodList";

const MealCard = ({ meal, refreshMeals }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(meal.name);

    const handleUpdate = async () => {
        if (!name.trim()) return;
        await api.put(`/meals/${meal.id}`, { name });
        setEditing(false);
        refreshMeals();
    };

    const handleDelete = async () => {
        await api.delete(`/meals/${meal.id}`);
        refreshMeals();
    };

    return (
        <li className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg flex flex-col gap-2 shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center">
            {editing ? (
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-2 py-1 rounded flex-1 mr-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            ) : (
            <span className="font-medium text-gray-800 dark:text-gray-100">
                {meal.name} - {meal.date}
            </span>
            )}

            <div className="flex gap-2">
            {editing ? (
                <>
                <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                    setEditing(false);
                    setName(meal.name);
                    }}
                    className="bg-gray-400 dark:bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500 dark:hover:bg-gray-500 transition"
                >
                    Cancel
                </button>
                </>
            ) : (
                <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                >
                Edit
                </button>
            )}

            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
                Delete
            </button>
            </div>
        </div>

        <FoodList mealId={meal.id} />
        </li>
    );
};

export default MealCard;
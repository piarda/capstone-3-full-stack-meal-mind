import React, { useState } from "react";
import api from "../api/api";

const FoodCard = ({ food, refreshFoods }) => {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ ...food });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
        setSaving(true);
        await api.put(`/foods/${food.id}`, {
            ...formData,
            calories: parseFloat(formData.calories) || 0,
            protein: parseFloat(formData.protein) || 0,
            carbs: parseFloat(formData.carbs) || 0,
            fat: parseFloat(formData.fat) || 0,
        });
        setEditing(false);
        refreshFoods();
        } catch (err) {
            console.error("Error updating food:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/foods/${food.id}`);
            refreshFoods();
        } catch (err) {
            console.error("Error deleting food:", err);
        }
    };

    return (
        <li className="flex justify-between items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 rounded transition-colors duration-300">
        {editing ? (
            <div className="flex flex-wrap gap-2">
            {["name", "calories", "protein", "carbs", "fat"].map((field) => (
                <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-2 py-1 rounded w-24 sm:w-20 focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
            ))}
            </div>
        ) : (
            <span className="text-gray-800 dark:text-gray-200">
            {food.name} — {food.calories} kcal | P:{food.protein} | C:{food.carbs} | F:{food.fat}
            </span>
        )}

        <div className="flex gap-2">
            {editing ? (
            <>
                <button
                onClick={handleUpdate}
                disabled={saving}
                className={`bg-green-500 text-white px-2 py-1 rounded ${
                    saving
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                } transition`}
                >
                {saving ? "Saving..." : "Save"}
                </button>
                <button
                onClick={() => {
                    setEditing(false);
                    setFormData({ ...food });
                }}
                className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
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
        </li>
    );
};

export default FoodCard;

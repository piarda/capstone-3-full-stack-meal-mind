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
        <li className="flex justify-between items-center border px-2 py-1 rounded">
        {editing ? (
            <div className="flex flex-wrap gap-2">
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border px-2 py-1 rounded"
            />
            <input
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                className="border px-2 py-1 w-20 rounded"
            />
            <input
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                className="border px-2 py-1 w-20 rounded"
            />
            <input
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                className="border px-2 py-1 w-20 rounded"
            />
            <input
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                className="border px-2 py-1 w-20 rounded"
            />
            </div>
        ) : (
            <span>
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
                        saving ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                    }`}
                    >
                    {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                    onClick={() => {
                        setEditing(false);
                        setFormData({ ...food });
                    }}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                    Cancel
                    </button>
                </>
                ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                    Edit
                </button>
                )}

                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                    Delete
                </button>
        </div>
        </li>
    );
};

export default FoodCard;

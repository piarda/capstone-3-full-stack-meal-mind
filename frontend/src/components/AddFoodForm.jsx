import React, { useState } from "react";
import api from "../api/api";

const AddFoodForm = ({ mealId, refreshFoods }) => {
    const [formData, setFormData] = useState({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setLoading(true);
        try {
            await api.post(`/foods/${mealId}`, {
                ...formData,
                calories: parseFloat(formData.calories) || 0,
                protein: parseFloat(formData.protein) || 0,
                carbs: parseFloat(formData.carbs) || 0,
                fat: parseFloat(formData.fat) || 0,
            });

            setFormData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
            refreshFoods();
        } catch (err) {
            console.error("Error adding food:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-2 mb-3 items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
        <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Food name"
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-2 py-1 rounded flex-1 focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
        />
        {["calories", "protein", "carbs", "fat"].map((field) => (
            <input
            key={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={
                field === "calories"
                ? "Cals"
                : field.charAt(0).toUpperCase()
            }
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-2 py-1 w-20 rounded text-center focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
        ))}
        <button
            type="submit"
            disabled={loading}
            className={`${
            loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-3 py-1 rounded transition`}
        >
            {loading ? "Adding..." : "Add"}
        </button>
        </form>
    );
};

export default AddFoodForm;

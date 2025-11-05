import React, { useEffect, useState } from "react";
import api from "../api/api";
import AddFoodForm from "./AddFoodForm";
import FoodCard from "./FoodCard";

const FoodList = ({ mealId }) => {
    const [foods, setFoods] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/foods/${mealId}`);
            setFoods(data);
        } catch (err) {
            console.error("Error fetching foods:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        if (!expanded) fetchFoods();
        setExpanded(!expanded);
    };

    return (
        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 transition-colors duration-300">
        <button
            onClick={handleToggle}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-2"
        >
            {expanded ? "Hide Foods" : "View Foods"}
        </button>

        {expanded && (
            <>
            <AddFoodForm mealId={mealId} refreshFoods={fetchFoods} />

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400 italic">Loading foods...</p>
            ) : foods.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No food items added yet.</p>
            ) : (
                <ul className="space-y-1">
                {foods.map((food) => (
                    <FoodCard key={food.id} food={food} refreshFoods={fetchFoods} />
                ))}
                </ul>
            )}
            </>
        )}
        </div>
    );
};

export default FoodList;

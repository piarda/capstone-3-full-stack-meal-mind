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
        <li className="p-2 border rounded flex flex-col mb-3">
            <div className="flex justify-between items-center">
            {editing ? (
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border px-2 py-1 flex-1 mr-2 rounded"
                />
            ) : (
                <span className="font-medium">{meal.name} - {meal.date}</span>
            )}
            <div className="flex gap-2">
                {editing ? (
                    <>
                        <button
                            onClick={handleUpdate}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setName(meal.name);
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
            </div>
            <FoodList mealId={meal.id} />
        </li>
    );
};

export default MealCard;

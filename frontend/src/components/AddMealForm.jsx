import React, { useState } from "react";

const AddMealForm = ({ addMeal }) => {
    const [mealName, setMealName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!mealName.trim()) return;
        addMeal(mealName.trim());
        setMealName("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
            type="text"
            placeholder="New meal name"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
        />
        <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
            Add
        </button>
        </form>
    );
};

export default AddMealForm;

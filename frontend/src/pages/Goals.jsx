import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import api from "../api/api";

const Goals = () => {
  const { user, refreshUser, loadingUser } = useUser();
  const [goals, setGoals] = useState({
    calorie_goal: "",
    protein_goal: "",
    carb_goal: "",
    fat_goal: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setGoals({
        calorie_goal: user.calorie_goal || "",
        protein_goal: user.protein_goal || "",
        carb_goal: user.carb_goal || "",
        fat_goal: user.fat_goal || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/goals", goals);
      await refreshUser();

      setMessage("Goals updated successfully!");
    } catch (err) {
      console.error("Error updating goals:", err);
      setMessage("Failed to update goals.");
    }
  };

  if (loadingUser) {
    return <p className="text-center text-gray-500">Loading goals...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-14 px-6 py-10 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        🎯 Nutrition Goals
      </h1>
      <p className="text-center mb-2 text-gray-500 dark:text-gray-400">
          Set your daily nutrition goals here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["calorie_goal", "protein_goal", "carb_goal", "fat_goal"].map((key) => (
          <div key={key}>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 capitalize">
              {key.replace("_", " ")}
            </label>
            <input
              type="number"
              name={key}
              value={goals[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 dark:bg-gray-900 dark:text-gray-100"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
        >
          Save Goals
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 dark:text-green-400 italic">{message}</p>
      )}
    </div>
  );
};

export default Goals;

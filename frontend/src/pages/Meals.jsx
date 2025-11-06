import React, { useEffect, useState } from "react";
import api from "../api/api";
import MealCard from "../components/MealCard";
import AddMealForm from "../components/AddMealForm";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeals, setFilteredMeals] = useState([]);

  const fetchMeals = async () => {
    try {
      const data = await api.get("/meals");
      setMeals(data);
      setFilteredMeals(data);
    } catch (err) {
      console.error("Error loading meals:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async ({ meal_type, date }) => {
    try {
      await api.post("/meals", { meal_type, date });
      fetchMeals();
    } catch (err) {
      console.error("Error adding meal:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = meals.filter((meal) => {
      const matchesMealType = meal.meal_type?.toLowerCase().includes(term);
      const matchesDate = meal.date?.toLowerCase().includes(term);

      const matchesFood =
        meal.food_items &&
        meal.food_items.some((food) =>
          food.name?.toLowerCase().includes(term)
        );

      return matchesMealType || matchesDate || matchesFood;
    });

    setFilteredMeals(filtered);
  }, [searchTerm, meals]);

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
        Loading meals...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 transition-colors duration-300">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          🥗 Your Meals
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage, edit, and track all your meals here.
        </p>
      </div>

    <div className="mb-6 relative max-w-md mx-auto">
    <input
        type="text"
        placeholder="Search meals by type, date, or food name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-400 outline-none transition"
    />
    {searchTerm && (
        <button
        onClick={() => setSearchTerm("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Clear search"
        >
        ✕
        </button>
    )}
    </div>

      <div className="mb-6">
        <AddMealForm addMeal={addMeal} />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No meals found. Try a different search or add one above!
          </p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeals.map((meal) => (
            <li
              key={meal.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300"
            >
              <MealCard meal={meal} refreshMeals={fetchMeals} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Meals;

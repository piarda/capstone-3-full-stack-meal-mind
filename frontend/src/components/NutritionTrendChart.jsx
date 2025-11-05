import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const NutritionTrendChart = () => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrend = async () => {
        try {
        const data = await api.get("/meals/summary/week");
        setTrendData(data);
        } catch (err) {
        console.error("Error fetching trend data:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrend();
    }, []);

    if (loading) return <p className="text-gray-500">Loading nutrition trend...</p>;
    if (!trendData || trendData.length === 0)
        return <p className="text-gray-500">No trend data available.</p>;

    const labels = trendData.map((d) => d.date);
    const calories = trendData.map((d) => d.calories);
    const protein = trendData.map((d) => d.protein);
    const carbs = trendData.map((d) => d.carbs);
    const fat = trendData.map((d) => d.fat);

    const data = {
        labels,
        datasets: [
        { label: "Calories", data: calories, backgroundColor: "#3b82f6" },
        { label: "Protein (g)", data: protein, backgroundColor: "#22c55e" },
        { label: "Carbs (g)", data: carbs, backgroundColor: "#facc15" },
        { label: "Fat (g)", data: fat, backgroundColor: "#ef4444" },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } },
        scales: {
        y: { beginAtZero: true, title: { display: true, text: "Amount (g / kcal)" } },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 w-full h-[400px]">
            <h2 className="text-2xl font-semibold mb-2">7-Day Nutrition Trend</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default NutritionTrendChart;

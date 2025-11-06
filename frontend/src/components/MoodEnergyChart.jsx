import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip
);

const MoodEnergyChart = () => {
    const [dataPoints, setDataPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCombinedData = async () => {
        try {
        const data = await api.get("/moods/trends/combined");
        setDataPoints(data);
        } catch (err) {
        console.error("Error fetching combined mood/nutrition data:", err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombinedData();
    }, []);

    if (loading)
        return <p className="text-gray-500 dark:text-gray-400">Loading trends...</p>;

    if (!dataPoints.length)
        return <p className="text-gray-500 dark:text-gray-400">No data available.</p>;

    const labels = dataPoints.map((d) => d.date);
    const calories = dataPoints.map((d) => d.calories);
    const protein = dataPoints.map((d) => d.protein);
    const carbs = dataPoints.map((d) => d.carbs);
    const fat = dataPoints.map((d) => d.fat);
    const mood = dataPoints.map((d) => d.mood_score);
    const energy = dataPoints.map((d) => d.energy_level);

    const chartData = {
        labels,
        datasets: [
        {
            type: "bar",
            label: "Calories",
            data: calories,
            backgroundColor: "#3b82f6",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Protein (g)",
            data: protein,
            backgroundColor: "#22c55e",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Carbs (g)",
            data: carbs,
            backgroundColor: "#facc15",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Fat (g)",
            data: fat,
            backgroundColor: "#ef4444",
            yAxisID: "y1",
        },
        {
            type: "line",
            label: "Mood (1-5)",
            data: mood,
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            borderWidth: 2,
            pointRadius: 4,
            yAxisID: "y2",
        },
        {
            type: "line",
            label: "Energy (1-5)",
            data: energy,
            borderColor: "#f97316",
            backgroundColor: "#f97316",
            borderWidth: 2,
            pointRadius: 4,
            yAxisID: "y2",
        },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: { position: "bottom" },
        },
        scales: {
        y1: {
            beginAtZero: true,
            position: "left",
            title: {
            display: true,
            text: "Calories / Macros (g)",
            },
        },
        y2: {
            beginAtZero: true,
            position: "right",
            title: {
            display: true,
            text: "Mood & Energy (1–5)",
            },
            grid: {
            drawOnChartArea: false,
            },
            min: 0,
            max: 5,
        },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full h-[500px] transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            🧩 Mood & Nutrition Correlation
        </h2>
        <Chart type="bar" data={chartData} options={options} />
        </div>
    );
};

export default MoodEnergyChart;

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

const NutritionTrendChart = ({ refreshTrigger = 0 }) => {
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
    }, [refreshTrigger]);

    if (loading)
        return <p className="text-gray-500 dark:text-gray-400">Loading nutrition trend...</p>;
    if (!trendData || trendData.length === 0)
        return <p className="text-gray-500 dark:text-gray-400">No trend data available.</p>;

    const labels = trendData.map((d) => d.date);
    const colors = {
        calories: "#3b82f6",
        protein: "#22c55e",
        carbs: "#facc15",
        fat: "#ef4444",
    };

    const data = {
        labels,
        datasets: [
        { label: "Calories", data: trendData.map((d) => d.calories), backgroundColor: colors.calories },
        { label: "Protein (g)", data: trendData.map((d) => d.protein), backgroundColor: colors.protein },
        { label: "Carbs (g)", data: trendData.map((d) => d.carbs), backgroundColor: colors.carbs },
        { label: "Fat (g)", data: trendData.map((d) => d.fat), backgroundColor: colors.fat },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            position: "bottom",
            labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: { size: 12, weight: "500" },
            generateLabels: (chart) => {
                const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                labels.forEach((label) => {
                const dataset = chart.data.datasets[label.datasetIndex];
                label.fillStyle = dataset.backgroundColor;
                label.strokeStyle = dataset.backgroundColor;
                label.fontColor = dataset.backgroundColor;
                label.text = dataset.label;
                });
                return labels;
            },
            },
        },
        tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#f9fafb",
            bodyColor: "#f9fafb",
        },
        },
        scales: {
        x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(156, 163, 175, 0.1)" },
        },
        y: {
            beginAtZero: true,
            title: { display: true, text: "Amount (g / kcal)", color: "#9ca3af" },
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(156, 163, 175, 0.1)" },
        },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full h-[400px] transition-colors duration-300">
        <Bar data={data} options={options} />
        </div>
    );
};

export default NutritionTrendChart;

import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionSummaryChart = ({ summary }) => {
    if (!summary || Object.keys(summary).length === 0) {
        return <p className="text-gray-500">No nutrition data for today.</p>;
    }

    const { protein = 0, carbs = 0, fat = 0, calories = 0 } = summary;

    const backgroundColors = [
        "#3b82f6",
        "#22c55e",
        "#eab308",
        "#ef4444",
    ];

    const data = {
        labels: ["Calories", "Protein", "Carbs", "Fat"],
        datasets: [
        {
            label: "Macros (g)",
            data: [calories, protein, carbs, fat],
            backgroundColor: backgroundColors,
            borderColor: "#fff",
            borderWidth: 2,
            cutout: "70%",
        },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: true,
            position: "bottom",
            labels: {
            usePointStyle: true,
            padding: 15,
            generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                return chart.data.labels.map((label, i) => ({
                text: label,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                fontColor: dataset.backgroundColor[i],
                }));
            },
            },
        },
        tooltip: {
            callbacks: {
            label: (context) => `${context.label}: ${context.formattedValue}g`,
            },
        },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center justify-center w-full h-80 transition-colors duration-300">
        <div className="relative w-full h-full">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {calories.toFixed(0)} kcal
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">total</p>
            </div>
        </div>
        </div>
    );
};

export default NutritionSummaryChart;

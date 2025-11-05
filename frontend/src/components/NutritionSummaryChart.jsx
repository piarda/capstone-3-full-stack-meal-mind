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

    const data = {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
        {
            label: "Macros (g)",
            data: [protein, carbs, fat],
            backgroundColor: ["#3b82f6", "#22c55e", "#facc15"],
            borderColor: "#fff",
            borderWidth: 2,
        },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
        legend: { display: true, position: "bottom" },
        tooltip: { callbacks: {
            label: (context) => `${context.label}: ${context.formattedValue}g`,
        }},
        },
    };

    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center w-full h-80">
        <div className="relative w-full h-full">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-semibold">{calories.toFixed(0)} kcal</p>
            <p className="text-gray-500 text-sm">total</p>
            </div>
        </div>
        </div>
    );
};

export default NutritionSummaryChart;

import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const MoodTrends = () => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrends = async () => {
        try {
        const [moodData, mealData] = await Promise.all([
            api.get("/moods/trends"),
            api.get("/meals/summary/week"),
        ]);

        const merged = mealData.map((m) => {
            const mood = moodData.find((x) => x.date === m.date) || {};
            return {
            date: m.date,
            calories: m.calories || 0,
            protein: m.protein || 0,
            carbs: m.carbs || 0,
            fat: m.fat || 0,
            mood: mood.mood_score || null,
            energy: mood.energy_level || null,
            };
        });

        setTrendData(merged);
        } catch (err) {
            console.error("Error fetching combined trends:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrends();
    }, []);

    if (loading)
        return <p className="text-gray-500 dark:text-gray-400">Loading trend data...</p>;
    if (!trendData.length)
        return <p className="text-gray-500 dark:text-gray-400">No trend data available.</p>;

    const labels = trendData.map((d) => d.date);

    const data = {
        labels,
        datasets: [
        {
            type: "bar",
            label: "Protein (g)",
            data: trendData.map((d) => d.protein),
            backgroundColor: "#22c55e",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Carbs (g)",
            data: trendData.map((d) => d.carbs),
            backgroundColor: "#facc15",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Fat (g)",
            data: trendData.map((d) => d.fat),
            backgroundColor: "#ef4444",
            yAxisID: "y1",
        },
        {
            type: "bar",
            label: "Calories",
            data: trendData.map((d) => d.calories),
            backgroundColor: "#3b82f6",
            yAxisID: "y1",
        },
        {
            type: "line",
            label: "Mood (1-5)",
            data: trendData.map((d) => d.mood),
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            borderWidth: 2,
            pointRadius: 4,
            yAxisID: "y2",
        },
        {
            type: "line",
            label: "Energy (1-5)",
            data: trendData.map((d) => d.energy),
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
            legend: { position: "bottom", labels: { padding: 20 } },
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
                grid: { drawOnChartArea: false },
                min: 0,
                max: 5,
            },
        },
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            📈 Mood & Energy vs Nutrition
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 h-[450px]">
            <Chart type="bar" data={data} options={options} />
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">
            Track how your daily nutrition impacts your mood and energy levels.
            </p>

            <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
                Mood & Energy for Past 7 Days
            </h2>

            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Mood (1–5)</th>
                    <th className="pb-2">Energy (1–5)</th>
                    <th className="pb-2"></th>
                </tr>
                </thead>
                <tbody>
                {[...trendData].reverse().map((log) => (
                    <tr
                    key={log.date}
                    className="border-b border-gray-200 dark:border-gray-700"
                    >
                    <td className="py-2">{log.date}</td>
                    <td>
                        <input
                        type="number"
                        min="1"
                        max="5"
                        value={log.mood || ""}
                        onChange={(e) =>
                            setTrendData((prev) =>
                            prev.map((d) =>
                                d.date === log.date
                                ? { ...d, mood: parseInt(e.target.value) }
                                : d
                            )
                            )
                        }
                        className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-gray-100"
                        />
                    </td>
                    <td>
                        <input
                        type="number"
                        min="1"
                        max="5"
                        value={log.energy || ""}
                        onChange={(e) =>
                            setTrendData((prev) =>
                            prev.map((d) =>
                                d.date === log.date
                                ? { ...d, energy: parseInt(e.target.value) }
                                : d
                            )
                            )
                        }
                        className="w-20 text-center border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-gray-100"
                        />
                    </td>
                    <td>
                        <button
                        onClick={async () => {
                            if (log.mood < 1 || log.mood > 5 || log.energy < 1 || log.energy > 5) {
                                alert("Mood and Energy must be between 1 and 5.");
                                return;
                            }

                            try {
                                const moodData = await api.get("/moods/trends");
                                const target = moodData.find((x) => x.date === log.date);

                                if (target) {
                                await api.put(`/moods/${target.id}`, {
                                    mood_score: log.mood,
                                    energy_level: log.energy,
                                });
                                } else {
                                await api.post("/moods", {
                                    mood_score: log.mood,
                                    energy_level: log.energy,
                                    date: log.date,
                                });
                                }

                                fetchTrends();
                            } catch (err) {
                                console.error("Error saving mood log:", err);
                            }
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                        Save
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
    );

};

export default MoodTrends;

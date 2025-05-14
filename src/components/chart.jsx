"use client";
import React, { useEffect } from "react";
import Chart from "chart.js";

export default function ChartComponent({ userLessons }) {
    const last7DaysLessons = userLessons
        .filter(
            (lesson) => new Date(lesson.createdAt).getTime() >= Date.now() - 1000 * 60 * 60 * 24 * 7
        )
        .reduce((acc, cur) => {
            const day = new Date(cur.createdAt).toLocaleString("es-CO", { weekday: "long" });
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(cur);
            return acc;
        }, {});

    const days = Array.from({ length: 7 }, (_, i) =>
        new Date(Date.now() - 1000 * 60 * 60 * 24 * i).toLocaleString("es-CO", {
            weekday: "long",
        })
    ).reverse();

    const daysLessons = days.map((day) => last7DaysLessons[day]?.length || 0);

    React.useEffect(() => {
        var config = {
            type: "line",
            data: {
                labels: days,
                datasets: [
                    {
                        label: new Date().getFullYear(),
                        backgroundColor: "#38bdf82b",
                        borderColor: "#38bdf8",
                        data: daysLessons,
                        fill: true,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: false,
                    text: "Lecciones tomadas esta semana",
                    fontColor: "white",
                },
                legend: {
                    labels: {
                        fontColor: "white",
                    },
                    align: "end",
                    position: "bottom",
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                fontColor: "rgba(255,255,255,.7)",
                            },
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: "Month",
                                fontColor: "white",
                            },
                            gridLines: {
                                display: false,
                                borderDash: [2],
                                borderDashOffset: [2],
                                color: "rgba(33, 37, 41, 0.3)",
                                zeroLineColor: "rgba(0, 0, 0, 0)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                fontColor: "rgba(255,255,255,.7)",
                                beginAtZero: true,
                                stepSize: 1,
                                min: 0,
                                max: Math.max(...daysLessons) + 5,
                            },
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: "Value",
                                fontColor: "white",
                            },
                            gridLines: {
                                borderDash: [3],
                                borderDashOffset: [3],
                                drawBorder: false,
                                color: "rgba(255, 255, 255, 0.15)",
                                zeroLineColor: "rgba(33, 37, 41, 0)",
                                zeroLineBorderDash: [2],
                                zeroLineBorderDashOffset: [2],
                            },
                        },
                    ],
                },
            },
        };
        var ctx = document.getElementById("line-chart").getContext("2d");
        window.myLine = new Chart(ctx, config);
    }, []);
    return (
        <>
            <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-[350px]">
                    <canvas id="line-chart"></canvas>
                </div>
            </div>
        </>
    );
}

import React from "react";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const MultiChart = () => {
  //useSelector for dt by hour
  const dt_hour = useSelector((state) => state.dt);
  //console.log(dt_hour);
  /////////////////////////////////////////////////
  //useSelector for performance by hour////////
  /////////////////////////////////////////////
  const performance_hour = useSelector((state) => state.performance);
  //Sort array by hour
  //console.log(performance_hour);
  const performanceHour = performance_hour;
  performanceHour.sort((a, b) => (a.hour > b.hour ? 1 : -1));
  //console.log('Sorted Array', performanceHour);

  ///////////////////////////////////////////////
  const chartData = {
    labels: dt_hour.map((data) => `${data.hour}:00`),
    datasets: [
      {
        type: "line",
        label: "Availability",
        data: dt_hour.map((data) =>
          (100 - 100 * (data.dt / 3600).toFixed(2)).toFixed(2)
        ),
        borderColor: "blue",
        backgroundColor: "#89CFF0",
      },
      {
        type: "bar",
        label: "Performance",
        data: performanceHour.map((data) =>
          (data.performance * 100).toFixed(2)
        ),
        borderColor: "#088F8F",
        backgroundColor: "#AFE1AF",
      },
      {
        type: "line",
        label: "Quality",
        data: dt_hour.map((data) =>
          (125 * (data.dt / 3600).toFixed(2)).toFixed(2)
        ),
        borderColor: "#FFA500",
        backgroundColor: "#FFD700",
      },
    ],
  };

  const options = {
    interaction: {
      intersect: false,
      mode: "point",
      axis: "x",
    },
    plugins: {
      tooltip: {
        enable: true,
        intersect: true,
        mode: "nearest",
      },
      title: {
        display: false,
        text: "OEE Chart - Stacked",
        color: "#F5F5F5",
      },
      legend: {
        labels: {
          font: {
            size: 10,
          },
          boxWidth: 10,
          color: "#F5F5F5",
        },
      },
    },
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#F5F5F5",
          font: {
            size: 8,
          },
        },
      },
      y: {
        min: 0,
        max: 150,
        grid: {
          color: "#F5F5F5",
        },
        ticks: {
          color: "#F5F5F5",
          font: {
            size: 8,
          },
        },
      },
    },
  };

  return (
    <Chart data={chartData} options={options} style={{ width: "300px" }} />
  );
};

export default MultiChart;

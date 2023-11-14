import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { UserData } from "./LineChartData";
import { useSelector } from "react-redux";

const LineChart = () => {
  //useSelector for dt by hour
  const dt_hour = useSelector((state) => state.dt);
  console.log(dt_hour);

  const chartData = {
    labels: dt_hour.map((data) => `${data.hour}:00`),
    datasets: [
      {
        label: "Downtime",
        data: dt_hour.map((data) =>
          (100 - 100 * (data.dt / 3600).toFixed(2)).toFixed(2)
        ),
        borderColor: "blue",
        backgroundColor: "blue",
      },
      {
        label: "Performance",
        data: dt_hour.map((data) =>
          (125 * (data.dt / 3600).toFixed(2)).toFixed(2)
        ),
        borderColor: "#36A2EB",
        backgroundColor: "#FFB1C1",
      },
    ],
  };

  const options = {
    interaction: {
      intersect: false,
      mode: 'point',
      axis: 'x'
    },
    plugins: {
      tooltip: {
        enabled: true,
        
      },
      title: {
        display: true,
        text: "OEE Chart - Stacked",
      },
      legend: {
        labels: {
          font: {},
          color: "#F5F5F5",
        },
      },
    },
    responsive: false,
    maintainAspectRatio: false,
    scales: {
        x: {
          /*title: {
            display: true,
            text: "Hour",
            color: "#F5F5F5",
          },*/
          /*grid:{
            color:"#F5F5F5"
          },*/
          ticks:{
            color:"#F5F5F5",
            font:{
                size: 8
              }
          }
        },
        y: {
            min: 0,
            max:150,
            /*title: {
              display: true,
              text: "Hour",
              color: "#F5F5F5",
            },*/
            grid:{
              color:"#F5F5F5"
            },
            ticks:{
              color:"#F5F5F5",
              font:{
                size: 8
              }
            }
          },
      },
  };

  return <Bar data={chartData} options={options} style={{ width: "500px" }} />;
};

export default LineChart;

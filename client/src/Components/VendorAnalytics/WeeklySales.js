import React from "react";
import { PolarArea } from "react-chartjs-2";

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      backgroundColor: [
        "#2ecc71",
        "#3498db",
        "#95a5a6",
        "#9b59b6",
        "#f1c40f",
        "#e74c3c",
        "#34495e",
      ],
      data: [12, 19, 3, 17, 28, 24, 7],
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const WeeklySales = () => (
  <>
    <div className="header">
      <h2 className="title" style={{ textAlign: "center", marginTop: "30px" }}>
        Weekly Sales
      </h2>
    </div>
    <PolarArea width={100} height={70} data={data} options={options} />
  </>
);

export default WeeklySales;

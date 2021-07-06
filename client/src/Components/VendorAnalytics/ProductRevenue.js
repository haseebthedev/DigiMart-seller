import React from "react";
import { Line } from "react-chartjs-2";

const data = {
  labels: ["HP", "Acer", "Realme", "Dell", "Apple", "Nvidia"],
  datasets: [
    {
      label: "$ USD Earned",
      data: [120, 92, 117, 115, 97, 101],
      fill: true,
      backgroundColor: "rgba(9,0,113,.3)",
      tension: 0.4,
    },
    {
      label: "Products Sold",
      data: [97, 102, 93, 102, 120, 93],
      fill: true,
      backgroundColor: "rgba(239,35,60, .7)",
      tension: 0.4,
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

const ProductRevenue = () => (
  <>
    <div className="header">
      <h2 className="title">Revenue</h2>
    </div>
    <Line width={100} height={70} data={data} options={options} />
  </>
);

export default ProductRevenue;

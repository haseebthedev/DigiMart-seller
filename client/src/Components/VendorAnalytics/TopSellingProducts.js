import React, { useState } from "react";
import { Bar, defaults } from "react-chartjs-2";

const rand = () => Math.floor(Math.random() * 255);

const genData = () => ({
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      type: "bar",
      label: "HP Laptop",
      backgroundColor: `rgba(9,0,113,.7)`,
      data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
    },
    {
      type: "bar",
      label: "Macbook 2019",
      backgroundColor: `#e67e22`,
      data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
    },
    {
      type: "bar",
      label: "Wireless Speaker",
      backgroundColor: `#EF233C`,
      data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
    },
  ],
});

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
  backgroundColor: "#262626",
  animation: {
    duration: 3000,
    onProgress: function (animation) {
      defaults.animation = false;
    },
  },
};

const TopSellingProducts = () => {
  // eslint-disable-next-line
  const [data, setData] = useState(genData());

  return (
    <>
      <div className="header">
        <h2 className="title">Top Performing Products</h2>
      </div>
      <Bar width={100} height={70} data={data} options={options} />
    </>
  );
};

export default TopSellingProducts;

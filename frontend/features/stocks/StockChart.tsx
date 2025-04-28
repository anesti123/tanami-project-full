import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import io from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = () => {
  const [stockData, setStockData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("new_activity", (activity: any) => {
      console.log("Received activity:", activity);

      if (activity.amount) {
        const stockPrice = parseFloat(activity.amount); 
        const timestamp = new Date(activity.timestamp).toLocaleTimeString(); 

        console.log("New stock price:", stockPrice, "Timestamp:", timestamp);

        setStockData((prevData) => [...prevData, stockPrice]);
        setLabels((prevLabels) => [...prevLabels, timestamp]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: stockData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Live Stock Price Chart",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Live Stock Price</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart;

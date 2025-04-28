import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import io from 'socket.io-client';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const StockChart = () => {
  const [stockData, setStockData] = useState<number[]>([]); // Store stock price data
  const [labels, setLabels] = useState<string[]>([]); // Store time labels for x-axis

  // Set up WebSocket connection to listen for new stock price updates
  useEffect(() => {
    const socket = io('http://localhost:4000'); // Adjust the URL as needed

    // Listen for 'new_activity' event that contains stock price updates
    socket.on('new_activity', (activity: any) => {
      console.log('Received activity:', activity); // Debugging output

      if (activity.stockPrice) {
        const stockPrice = parseFloat(activity.stockPrice);
        const timestamp = new Date().toLocaleTimeString();

        console.log('New stock price:', stockPrice, 'Timestamp:', timestamp); // Debugging output

        // Update the chart data with the new stock price
        setStockData((prevData) => [...prevData, stockPrice]);
        setLabels((prevLabels) => [...prevLabels, timestamp]);
      }
    });

    return () => {
      socket.disconnect(); // Clean up the WebSocket connection on unmount
    };
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stock Price',
        data: stockData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Live Stock Price</h2>
      <Line data={chartData} />
    </div>
  );
};

export default StockChart;

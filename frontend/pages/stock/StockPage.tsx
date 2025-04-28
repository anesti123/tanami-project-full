import React from "react";
import StockChart from "../../features/stocks/StockChart";

const StockPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Market Simulation</h1>
      <StockChart />
    </div>
  );
};

export default StockPage;

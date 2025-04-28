// pages/dashboard.tsx
import ProtectedRoute from "../components/ProtectedRoute";
import ActivityFeed from "../features/activity-feed/ActivityFeed";
import StockChart from "../features/stocks/StockChart";
import axios from "axios";

const DashboardPage = () => {
  const simulateStockChange = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/activity/simulate_stock",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
        }
      );
      alert(
        "Stock price simulation triggered! It will update every 5 seconds."
      );
    } catch (error) {
      console.error("Error simulating stock price:", error);
      alert("Failed to simulate stock price");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="mt-6">
          <button
            onClick={simulateStockChange}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Simulate Stock Price Change
          </button>
        </div>
        
        <div className="flex space-x-8">
          {/* Activity Feed */}
          <div className="w-1/2">
            <ActivityFeed />
          </div>

          {/* Stock Chart */}
          <div className="w-1/2">
            <StockChart />
          </div>
        </div>

        
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;

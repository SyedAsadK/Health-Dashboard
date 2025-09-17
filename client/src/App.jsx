import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import SymptomChart from "./components/SymptomChart";
import HotspotMap from "./components/HotspotMap";
import AlertFeed from "./components/AlertFeed";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This useEffect hook fetches data from the Actix backend when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using the proxy setup in vite.config.js
        const response = await fetch("/api/dashboard-data");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch data:", err);
      } finally {
        // Simulate a network delay for a better UX
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();
  }, []);

  // Main render logic
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <div className="text-center text-red-400">Error: {error}</div>;
    }
    if (dashboardData) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Cases"
                value={dashboardData.total_cases}
                change="+12% from last week"
              />
              <StatCard
                title="Active Alerts"
                value={dashboardData.active_alerts}
                change="High Priority"
                isWarning={true}
              />
            </div>
            <SymptomChart data={dashboardData.symptom_data} />
          </div>
          {/* Right column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <HotspotMap hotspots={dashboardData.map_hotspots} />
            <AlertFeed alerts={dashboardData.alerts} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full bg-[#0D1B2A] text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Header />
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

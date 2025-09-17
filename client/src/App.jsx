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
  // Add new state for the ML prediction
  const [mlPrediction, setMlPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    // ... (fetchData function remains the same)
    const fetchData = async () => {
      try {
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
        setTimeout(() => {
          setLoading(false);
        });
      }
    };

    fetchData();
  }, []);

  // New function to fetch ML prediction
  const fetchPrediction = async () => {
    setPredictionLoading(true);
    setPredictionError(null);
    try {
      // You'll need to replace the placeholder features with actual data
      // from your dashboard's state once you integrate it properly.
      const sampleFeatures = {
        features: [0.2, 0.8, 0.5, 0.9], // Placeholder data
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleFeatures),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMlPrediction(data.outbreak_risk);
    } catch (err) {
      setPredictionError(err.message);
      console.error("Failed to fetch ML prediction:", err);
    } finally {
      setPredictionLoading(false);
    }
  };

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
              {/* New StatCard to display ML Prediction */}
              <StatCard
                title="ML Outbreak Risk"
                value={mlPrediction || "Not predicted"}
                change={
                  predictionLoading
                    ? "Predicting..."
                    : predictionError || "Click 'Predict'"
                }
                isWarning={mlPrediction === "high"}
              />
            </div>
            <SymptomChart data={dashboardData.symptom_data} />
            <button
              onClick={fetchPrediction}
              className="p-4 bg-cyan-400 text-white rounded-lg"
            >
              Predict Outbreak Risk
            </button>
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

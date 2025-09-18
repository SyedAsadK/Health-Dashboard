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
  const [mlPrediction, setMlPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
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
        // A small delay for a smoother loading experience
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, []);

  const fetchPrediction = async () => {
    setPredictionLoading(true);
    setPredictionError(null);
    try {
      // The features are now sent as a dictionary object with the required fields.
      // This placeholder data uses typical values that might indicate a higher risk.
      const featuresForPrediction = {
        features: {
          fcol_mpn: 500,
          tcol_mpn: 600,
          bod3_27: 3.5,
          ph_gen: 7.2,
          _do: 5.0,
          Latitude: 20.2961, // Example Bhubaneswar Latitude
          Longitude: 85.8245, // Example Bhubaneswar Longitude
          // In a real application, you would populate this with more dynamic data.
          // The .fillna(0) in the Python API will handle any features you don't send.
        },
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(featuresForPrediction),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorText}`,
        );
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <StatCard
                title="ML Outbreak Risk"
                value={mlPrediction ? mlPrediction.toUpperCase() : "N/A"}
                change={
                  predictionLoading ? "Predicting..." : predictionError || ""
                }
                isWarning={mlPrediction === "high"}
              />
            </div>
            <SymptomChart data={dashboardData.symptom_data} />
            <button
              onClick={fetchPrediction}
              disabled={predictionLoading}
              className="p-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {predictionLoading
                ? "Analyzing Data..."
                : "Predict Outbreak Risk"}
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
    <div className="flex h-screen bg-[#0D1B2A] text-white font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Header />
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

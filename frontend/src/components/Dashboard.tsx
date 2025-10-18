import React, { useState, useEffect } from "react";
import api from "../api/client";
import type { DashboardData } from "../types";
import { getMockChartData } from "../utils/mockData";

// Layout Components
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";

// Dashboard Components
import DashboardHeader from "./dashboard/DashboardHeader";
import MetricCards from "./dashboard/MetricCards";
import ChartCards from "./dashboard/ChartCards";

// Existing Detail Components
import AgentStats from "./AgentStats";
import HypothesisList from "./HypothesisList";
import ActivityFeed from "./ActivityFeed";
import PaperList from "./PaperList";
import ProposalsList from "./ProposalsList";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const chartData = getMockChartData();

  const fetchData = async () => {
    try {
      const dashboardData = await api.getAllData();
      setData(dashboardData);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Failed to fetch data from API. Make sure the API server is running on http://localhost:3001"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
        <div className="bg-error/10 border border-error/50 rounded-lg p-6 max-w-2xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-3xl">❌</div>
            <h2 className="text-xl font-semibold text-error">
              Connection Error
            </h2>
          </div>
          <p className="text-text-primary mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 bg-[#0A0E1A]">
          {/* Dashboard Header (Title, Avatars, Tabs) */}
          <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Error Banner */}
          {error && data && (
            <div className="px-8">
              <div className="bg-warning/10 border border-warning/50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-warning">⚠️</span>
                  <p className="text-sm text-warning">
                    Failed to refresh data. Showing last successful update.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="px-8">
            {activeTab === "overview" && (
              <>
                <MetricCards status={data?.status || null} />
                <ChartCards
                  papersData={chartData.papers}
                  hypothesesData={chartData.hypotheses}
                />
              </>
            )}
          </div>

          {activeTab === "hypotheses" && (
            <div className="px-8 py-8">
              <HypothesisList
                hypotheses={data?.hypotheses || []}
                loading={false}
              />
            </div>
          )}

          {activeTab === "papers" && (
            <div className="px-8 py-8">
              <PaperList papers={data?.papers || []} loading={false} />
            </div>
          )}

          {activeTab === "agents" && (
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AgentStats agents={data?.agents || null} loading={false} />
                <ActivityFeed activity={data?.activity || []} loading={false} />
              </div>
            </div>
          )}

          {activeTab === "proposals" && (
            <div className="px-8 py-8">
              <ProposalsList
                proposals={data?.proposals || []}
                loading={false}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;

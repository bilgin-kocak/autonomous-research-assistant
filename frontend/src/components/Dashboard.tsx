import React, { useState, useEffect } from 'react';
import api from '../api/client';
import type { DashboardData } from '../types';
import StatsCards from './StatsCards';
import AgentStats from './AgentStats';
import HypothesisList from './HypothesisList';
import ActivityFeed from './ActivityFeed';
import PaperList from './PaperList';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const dashboardData = await api.getAllData();
      setData(dashboardData);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch data from API. Make sure the API server is running on http://localhost:3001');
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-2xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-3xl">❌</div>
            <h2 className="text-xl font-semibold text-red-400">Connection Error</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔬</div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  ScienceDAO Agent Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  Autonomous Research & Multi-Agent Coordination
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Last Update Indicator */}
              {lastUpdate && (
                <div className="text-sm text-gray-400">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <span className={loading ? 'animate-spin inline-block' : ''}>
                  🔄
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && data && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⚠️</span>
              <p className="text-sm text-yellow-300">
                Failed to refresh data. Showing last successful update.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards status={data?.status || null} loading={false} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <HypothesisList
              hypotheses={data?.hypotheses || []}
              loading={false}
            />
            <PaperList
              papers={data?.papers || []}
              loading={false}
            />
          </div>

          {/* Right Column - Sidebar (1/3) */}
          <div className="space-y-8">
            <AgentStats
              agents={data?.agents || null}
              loading={false}
            />
            <ActivityFeed
              activity={data?.activity || []}
              loading={false}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>Powered by </span>
              <span className="text-primary-500 font-semibold">Virtuals Protocol</span>
              <span> & </span>
              <span className="text-primary-500 font-semibold">Agent Commerce Protocol (ACP)</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/sciencedao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://discord.gg/sciencedao"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
              >
                Discord
              </a>
              <span>Auto-refresh: 5s</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

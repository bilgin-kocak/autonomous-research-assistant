import React from 'react';
import type { AgentStatus } from '../types';

interface StatsCardsProps {
  status: AgentStatus | null;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ status, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-800 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-800 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const stats = [
    {
      label: 'Papers Analyzed',
      value: status.papers_analyzed,
      sublabel: 'Research papers',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Hypotheses Generated',
      value: status.hypotheses_generated,
      sublabel: 'Novel ideas',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Peer Reviews',
      value: status.peer_reviews_completed,
      sublabel: 'Quality checks',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Datasets Curated',
      value: status.datasets_curated,
      sublabel: 'Data sources',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'ACP Jobs',
      value: status.acp_jobs_completed,
      sublabel: 'Agent coordination',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="mb-8">
      {/* Status Banner */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.agent_status)} animate-pulse`}></div>
            <span className="text-white font-semibold">
              Agent Status: {getStatusLabel(status.agent_status)}
            </span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">
            Uptime: <span className="text-primary-500 font-mono">{formatUptime(status.uptime)}</span>
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Last activity: {new Date(status.last_activity).toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">
                {stat.label}
              </h3>
              <div className={`w-2 h-2 rounded-full ${stat.bgColor}`}></div>
            </div>
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">{stat.sublabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;

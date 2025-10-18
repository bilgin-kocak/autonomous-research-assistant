import React from 'react';
import type { AgentStats as AgentStatsType } from '../types';

interface AgentStatsProps {
  agents: AgentStatsType | null;
  loading: boolean;
}

const AgentStats: React.FC<AgentStatsProps> = ({ agents, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!agents) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <span className="text-2xl mr-2">🤝</span>
        Multi-Agent Coordination
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peer Reviewer Agent */}
        <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👨‍🔬</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Peer Reviewer</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents.peer_reviewer.status)}`}></div>
                  <span className="text-xs text-gray-400">{getStatusLabel(agents.peer_reviewer.status)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Reviews Completed</span>
              <span className="text-lg font-semibold text-cyan-400">
                {agents.peer_reviewer.reviews_completed}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Average Score</span>
              <span className="text-lg font-semibold text-purple-400">
                {agents.peer_reviewer.average_score.toFixed(1)}/10
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Approved</div>
                  <div className="text-sm font-semibold text-green-400">
                    {agents.peer_reviewer.approved}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Rejected</div>
                  <div className="text-sm font-semibold text-red-400">
                    {agents.peer_reviewer.rejected}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Approval Rate</div>
                <div className="text-sm font-semibold text-white">
                  {agents.peer_reviewer.reviews_completed > 0
                    ? Math.round(
                        (agents.peer_reviewer.approved / agents.peer_reviewer.reviews_completed) * 100
                      )
                    : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Curator Agent */}
        <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Data Curator</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents.data_curator.status)}`}></div>
                  <span className="text-xs text-gray-400">{getStatusLabel(agents.data_curator.status)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Searches Performed</span>
              <span className="text-lg font-semibold text-blue-400">
                {agents.data_curator.searches_performed}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Datasets Found</span>
              <span className="text-lg font-semibold text-green-400">
                {agents.data_curator.datasets_found}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="text-sm text-gray-400">Avg. Datasets per Search</div>
              <div className="text-sm font-semibold text-white">
                {agents.data_curator.searches_performed > 0
                  ? (agents.data_curator.datasets_found / agents.data_curator.searches_performed).toFixed(1)
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          Agents coordinate via Agent Commerce Protocol (ACP) for autonomous research workflows
        </p>
      </div>
    </div>
  );
};

export default AgentStats;

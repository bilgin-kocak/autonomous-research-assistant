import React from 'react';
import type { ActivityLog } from '../types';
import { getActivityTypeColor } from '../types';

interface ActivityFeedProps {
  activity: ActivityLog[];
  loading: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-2 h-2 bg-gray-700 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          📡 Activity Feed
        </h2>
        <p className="text-gray-400 text-center py-8">
          No recent activity. Waiting for agent actions...
        </p>
      </div>
    );
  }

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: ActivityLog['type']): string => {
    switch (type) {
      case 'PAPER_ANALYSIS': return '📄';
      case 'HYPOTHESIS_GENERATION': return '💡';
      case 'PEER_REVIEW': return '👨‍🔬';
      case 'DATASET_CURATION': return '📊';
      case 'PROPOSAL_CREATION': return '💰';
      case 'ACP_JOB': return '🤝';
      case 'AGENT_COORDINATION': return '🔄';
      case 'ERROR': return '❌';
      case 'INFO': return 'ℹ️';
      default: return '•';
    }
  };

  const getTypeBadgeStyle = (type: ActivityLog['type']): string => {
    switch (type) {
      case 'PAPER_ANALYSIS': return 'bg-blue-500/20 text-blue-400';
      case 'HYPOTHESIS_GENERATION': return 'bg-purple-500/20 text-purple-400';
      case 'PEER_REVIEW': return 'bg-cyan-500/20 text-cyan-400';
      case 'DATASET_CURATION': return 'bg-green-500/20 text-green-400';
      case 'PROPOSAL_CREATION': return 'bg-yellow-500/20 text-yellow-400';
      case 'ACP_JOB': return 'bg-pink-500/20 text-pink-400';
      case 'AGENT_COORDINATION': return 'bg-indigo-500/20 text-indigo-400';
      case 'ERROR': return 'bg-red-500/20 text-red-400';
      case 'INFO': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-2xl mr-2">📡</span>
          Activity Feed
        </h2>
        <span className="text-sm text-gray-400">
          {activity.length} recent event{activity.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {activity.map((log) => (
          <div
            key={log.id}
            className="flex space-x-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            {/* Icon and timeline dot */}
            <div className="flex flex-col items-center">
              <div className="text-xl">{getTypeIcon(log.type)}</div>
              <div className="flex-1 w-0.5 bg-gray-700 mt-2"></div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeStyle(log.type)}`}>
                  {log.type.replace('_', ' ')}
                </span>
                {log.agent && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                    {log.agent}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatTimestamp(log.timestamp)}
                </span>
              </div>

              <h4 className="text-sm font-medium text-white mb-1">
                {log.title}
              </h4>

              <p className="text-sm text-gray-400 break-words">
                {log.description}
              </p>

              {/* Metadata */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs">
                  <details className="cursor-pointer">
                    <summary className="text-gray-500 hover:text-gray-400">
                      View metadata
                    </summary>
                    <pre className="mt-2 text-gray-400 overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
};

export default ActivityFeed;

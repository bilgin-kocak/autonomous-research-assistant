import React, { useState } from 'react';
import type { Paper } from '../types';

interface PaperListProps {
  papers: Paper[];
  loading: boolean;
}

const PaperList: React.FC<PaperListProps> = ({ papers, loading }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-2/3 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          📚 Analyzed Papers
        </h2>
        <p className="text-gray-400 text-center py-8">
          No papers analyzed yet. Agent is searching for relevant research...
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-2xl mr-2">📚</span>
          Analyzed Papers
        </h2>
        <span className="text-sm text-gray-400">
          {papers.length} paper{papers.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {papers.map((paper) => {
          const isExpanded = expandedId === paper.id;

          return (
            <div
              key={paper.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-2 leading-relaxed">
                      {paper.title}
                    </h3>

                    {paper.authors && paper.authors.length > 0 && (
                      <p className="text-sm text-gray-400 mb-2">
                        {paper.authors.slice(0, 3).join(', ')}
                        {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                      </p>
                    )}

                    {paper.abstract && !isExpanded && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {paper.abstract}
                      </p>
                    )}
                  </div>

                  {/* Relevance Score */}
                  {paper.relevance_score !== undefined && (
                    <div className="ml-4 flex flex-col items-center px-3 py-2 rounded-lg bg-blue-500/20">
                      <div className="text-xl font-bold text-blue-400">
                        {paper.relevance_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Relevance</div>
                    </div>
                  )}
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="space-x-3">
                    <span>Analyzed: {new Date(paper.analyzed_at).toLocaleDateString()}</span>
                    {paper.doi && (
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-400"
                      >
                        DOI: {paper.doi}
                      </a>
                    )}
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-400"
                      >
                        View Paper →
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(paper.id)}
                    className="text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    {isExpanded ? '↑ Show less' : '↓ Show analysis'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-700 p-5 space-y-4">
                  {/* Abstract */}
                  {paper.abstract && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        📄 Abstract
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {paper.abstract}
                      </p>
                    </div>
                  )}

                  {/* Findings */}
                  {paper.findings && (
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">
                        🔍 Key Findings
                      </h4>
                      <p className="text-sm text-gray-300">
                        {paper.findings}
                      </p>
                    </div>
                  )}

                  {/* Methodology */}
                  {paper.methodology && (
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">
                        🧪 Methodology
                      </h4>
                      <p className="text-sm text-gray-300">
                        {paper.methodology}
                      </p>
                    </div>
                  )}

                  {/* Gaps Identified */}
                  {paper.gaps_identified && paper.gaps_identified.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                        💡 Research Gaps Identified
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {paper.gaps_identified.map((gap, idx) => (
                          <li key={idx} className="text-sm text-gray-300">
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaperList;

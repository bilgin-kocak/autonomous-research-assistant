/**
 * TypeScript type definitions for ScienceDAO API responses
 */

// Agent Status and Statistics
export interface AgentStatus {
  agent_status: 'active' | 'idle' | 'error';
  uptime: number; // seconds
  papers_analyzed: number;
  hypotheses_generated: number;
  proposals_created: number;
  peer_reviews_completed: number;
  datasets_curated: number;
  acp_jobs_completed: number;
  last_activity: string; // ISO date string
}

// Hypothesis with Peer Review
export interface Hypothesis {
  id: string;
  hypothesis: string;
  field: string;
  novelty_score: number; // 0-10
  feasibility_score: number; // 0-10
  impact_score: number; // 0-10
  rigor_score: number; // 0-10
  overall_score: number; // 0-10
  approved: boolean;
  generated_at: string; // ISO date string
  reviewed_at?: string; // ISO date string
  feedback?: string;
  datasets_found?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

// Analyzed Paper
export interface Paper {
  id: string;
  title: string;
  authors?: string[];
  abstract?: string;
  doi?: string;
  url?: string;
  analyzed_at: string; // ISO date string
  findings?: string;
  methodology?: string;
  gaps_identified?: string[];
  relevance_score?: number; // 0-10
}

// Funding Proposal
export interface Proposal {
  id: string;
  hypothesis_id: string;
  title: string;
  description: string;
  funding_goal: number; // in tokens
  current_funding: number; // in tokens
  status: 'draft' | 'active' | 'funded' | 'rejected';
  created_at: string; // ISO date string
  deadline?: string; // ISO date string
  on_chain_address?: string;
  votes_for?: number;
  votes_against?: number;
}

// Multi-Agent Statistics
export interface AgentStats {
  peer_reviewer: {
    reviews_completed: number;
    average_score: number;
    approved: number;
    rejected: number;
    status: 'active' | 'idle';
  };
  data_curator: {
    searches_performed: number;
    datasets_found: number;
    status: 'active' | 'idle';
  };
}

// Activity Log Entry
export interface ActivityLog {
  id: string;
  timestamp: string; // ISO date string
  type:
    | 'PAPER_ANALYSIS'
    | 'HYPOTHESIS_GENERATION'
    | 'PEER_REVIEW'
    | 'DATASET_CURATION'
    | 'PROPOSAL_CREATION'
    | 'ACP_JOB'
    | 'AGENT_COORDINATION'
    | 'ERROR'
    | 'INFO';
  title: string;
  description: string;
  agent?: string; // Which agent performed the action
  metadata?: Record<string, any>;
}

// Dashboard Data (combined response)
export interface DashboardData {
  status: AgentStatus;
  hypotheses: Hypothesis[];
  papers: Paper[];
  proposals: Proposal[];
  agents: AgentStats;
  activity: ActivityLog[];
}

// Score categories for color coding
export type ScoreLevel = 'excellent' | 'good' | 'fair' | 'poor';

export const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'fair';
  return 'poor';
};

export const getScoreColor = (score: number): string => {
  const level = getScoreLevel(score);
  switch (level) {
    case 'excellent': return 'text-green-500';
    case 'good': return 'text-yellow-500';
    case 'fair': return 'text-orange-500';
    case 'poor': return 'text-red-500';
  }
};

export const getScoreBgColor = (score: number): string => {
  const level = getScoreLevel(score);
  switch (level) {
    case 'excellent': return 'bg-green-500/20';
    case 'good': return 'bg-yellow-500/20';
    case 'fair': return 'bg-orange-500/20';
    case 'poor': return 'bg-red-500/20';
  }
};

// Activity type colors
export const getActivityTypeColor = (type: ActivityLog['type']): string => {
  switch (type) {
    case 'PAPER_ANALYSIS': return 'text-blue-400';
    case 'HYPOTHESIS_GENERATION': return 'text-purple-400';
    case 'PEER_REVIEW': return 'text-cyan-400';
    case 'DATASET_CURATION': return 'text-green-400';
    case 'PROPOSAL_CREATION': return 'text-yellow-400';
    case 'ACP_JOB': return 'text-pink-400';
    case 'AGENT_COORDINATION': return 'text-indigo-400';
    case 'ERROR': return 'text-red-400';
    case 'INFO': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

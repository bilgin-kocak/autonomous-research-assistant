// API Response Types

export interface AgentStatus {
  agent_status: string;
  uptime: number;
  papers_analyzed: number;
  hypotheses_generated: number;
  proposals_created: number;
  peer_reviews_completed: number;
  datasets_curated: number;
  acp_jobs_completed: number;
  last_activity: string;
}

export interface Hypothesis {
  id: string;
  hypothesis: string;
  field: string;
  novelty_score: number;
  feasibility_score: number;
  impact_score: number;
  rigor_score: number;
  overall_score: number;
  approved: boolean;
  generated_at: string;
  reviewed_at?: string;
  feedback?: string;
  datasets_found?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

export interface Paper {
  title: string;
  authors?: string;
  published?: string;
  analyzed_at: string;
  findings?: string[];
  methodology?: string;
  gaps?: string[];
  next_steps?: string[];
}

export interface Proposal {
  id: number;
  hypothesis_id: string;
  hypothesis_preview: string;
  funding_goal: string;
  current_funding: string;
  deadline: string;
  tx_hash?: string;
  created_at: string;
  status: 'active' | 'funded' | 'completed';
}

export interface AgentStats {
  peer_reviewer: {
    reviews_completed: number;
    average_score: number;
    approved: number;
    rejected: number;
    status: string;
  };
  data_curator: {
    searches_performed: number;
    datasets_found: number;
    data_sources: string[];
    status: string;
  };
}

export interface ActivityLog {
  timestamp: string;
  type: string;
  message: string;
  data?: any;
  level?: string;
}

// Research Log Entry (from research_log.json)
export interface ResearchLogEntry {
  timestamp: string;
  type: string;
  message: string;
  data?: any;
  agent?: string;
  level?: string;
  duration?: number;
}

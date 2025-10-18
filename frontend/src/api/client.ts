import axios from 'axios';
import type {
  AgentStatus,
  Hypothesis,
  Paper,
  Proposal,
  AgentStats,
  ActivityLog
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response wrapper type
interface ApiResponse<T> {
  data: T;
}

export const api = {
  /**
   * Get agent status and statistics
   * @returns Agent status including papers analyzed, hypotheses generated, etc.
   */
  async getStatus(): Promise<AgentStatus> {
    const response = await apiClient.get<AgentStatus>('/status');
    return response.data;
  },

  /**
   * Get all hypotheses with peer review details
   * @returns Array of hypotheses with scores and feedback
   */
  async getHypotheses(): Promise<Hypothesis[]> {
    const response = await apiClient.get<{hypotheses: Hypothesis[]}>('/hypotheses');
    return response.data.hypotheses;
  },

  /**
   * Get all analyzed papers
   * @returns Array of papers with analysis details
   */
  async getPapers(): Promise<Paper[]> {
    const response = await apiClient.get<{papers: Paper[]}>('/papers');
    return response.data.papers;
  },

  /**
   * Get funding proposals
   * @returns Array of on-chain proposals
   */
  async getProposals(): Promise<Proposal[]> {
    const response = await apiClient.get<{proposals: Proposal[]}>('/proposals');
    return response.data.proposals;
  },

  /**
   * Get multi-agent coordination statistics
   * @returns Statistics for peer reviewer and data curator agents
   */
  async getAgents(): Promise<AgentStats> {
    const response = await apiClient.get<{agents: AgentStats}>('/agents');
    return response.data.agents;
  },

  /**
   * Get recent activity feed
   * @param limit - Number of activity entries to return (default: 50)
   * @returns Array of activity log entries
   */
  async getActivity(limit: number = 50): Promise<ActivityLog[]> {
    const response = await apiClient.get<{activity: ActivityLog[]}>('/activity', {
      params: { limit },
    });
    return response.data.activity;
  },

  /**
   * Fetch all data needed for the dashboard
   * @returns Object containing all dashboard data
   */
  async getAllData() {
    try {
      const [status, hypotheses, papers, proposals, agents, activity] = await Promise.all([
        this.getStatus(),
        this.getHypotheses(),
        this.getPapers(),
        this.getProposals(),
        this.getAgents(),
        this.getActivity(50),
      ]);

      return {
        status,
        hypotheses,
        papers,
        proposals,
        agents,
        activity,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};

export default api;

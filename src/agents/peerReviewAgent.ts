/**
 * Peer Review Agent
 * Specializes in evaluating research hypotheses for scientific validity
 */

import { GameAgent } from '@virtuals-protocol/game';
import { reviewWorker } from '../workers/reviewWorker';

/**
 * Agent state for Peer Reviewer
 */
export interface PeerReviewState {
  reviews_completed: number;
  average_score: number;
  approved_count: number;
  rejected_count: number;
  status: 'active' | 'idle';
  last_review: string;
}

// Global state for the agent
let agentState: PeerReviewState = {
  reviews_completed: 0,
  average_score: 0,
  approved_count: 0,
  rejected_count: 0,
  status: 'idle',
  last_review: new Date().toISOString()
};

/**
 * Get current agent state
 */
export async function getPeerReviewState(): Promise<PeerReviewState> {
  return { ...agentState };
}

/**
 * Update agent state
 */
export function updatePeerReviewState(updates: Partial<PeerReviewState>): void {
  agentState = { ...agentState, ...updates };
}

/**
 * Record a review
 */
export function recordReview(score: number, approved: boolean): void {
  const totalScore = agentState.average_score * agentState.reviews_completed;
  agentState.reviews_completed += 1;
  agentState.average_score = (totalScore + score) / agentState.reviews_completed;

  if (approved) {
    agentState.approved_count += 1;
  } else {
    agentState.rejected_count += 1;
  }

  agentState.last_review = new Date().toISOString();
  agentState.status = 'active';
}

/**
 * Peer Review Agent
 * Evaluates research hypotheses for scientific validity, novelty, and feasibility
 */
export const peerReviewAgent = new GameAgent(
  process.env.GAME_API_KEY || '',
  {
    name: 'Peer Reviewer',
    goal: 'Evaluate research hypotheses for scientific validity, novelty, and feasibility',
    description:
      'I critically evaluate research proposals with expertise in scientific methodology and research design. I assess hypotheses on four key criteria: novelty (originality), feasibility (practicality), impact (potential significance), and rigor (methodological soundness). I provide scores on a 1-10 scale, constructive feedback, and actionable recommendations to improve research quality. My approval threshold is 7.0/10.',
    getAgentState: async () => getPeerReviewState(),
    workers: [reviewWorker]
  }
);

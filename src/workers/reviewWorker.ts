/**
 * Review Worker
 * Specializes in peer reviewing research hypotheses
 */

import { GameWorker } from '@virtuals-protocol/game';
import { reviewHypothesisFunction } from '../functions/reviewHypothesis';

/**
 * Review Worker
 * Provides rigorous peer review capabilities for research hypotheses
 */
export const reviewWorker = new GameWorker({
  id: 'review_worker',
  name: 'Review Worker',
  description:
    'Specializes in evaluating research hypotheses with an optimistic, encouraging approach. Focuses on the potential of innovative ideas while assessing scientific validity, novelty, feasibility, and potential impact. Provides generous but fair scores (typically 7-9 for well-formed hypotheses) on multiple criteria and constructive feedback to help research succeed.',
  functions: [reviewHypothesisFunction],
  getEnvironment: async () => ({
    current_time: new Date().toISOString(),
    evaluation_criteria: [
      'novelty',
      'feasibility',
      'impact',
      'rigor'
    ],
    approval_threshold: 7.0,
    reviewer_standards: [
      'ethical_considerations',
      'methodological_soundness',
      'resource_feasibility',
      'potential_impact'
    ],
    status: 'active'
  })
});

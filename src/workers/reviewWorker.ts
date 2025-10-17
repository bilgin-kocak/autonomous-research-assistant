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
    'Specializes in critically evaluating research hypotheses for scientific validity, novelty, feasibility, and potential impact. Provides scores on multiple criteria and constructive feedback to improve research quality.',
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

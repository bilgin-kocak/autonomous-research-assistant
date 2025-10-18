import { GameAgent } from '@virtuals-protocol/game';
import { researchWorker } from '../workers/researchWorker';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';
import { coordinator, ResearchWorkflowResult } from '../acp/coordinator';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Research State Interface
 * Tracks the agent's research activity across sessions
 */
export interface ResearchState {
  current_field: string;
  papers_analyzed: number;
  hypotheses_generated: number;
  research_gaps_identified: number;
  last_update: string;
  active_hypotheses: string[];
  peer_reviews_requested: number;
  hypotheses_approved: number;
  hypotheses_rejected: number;
  proposals_created: number;
  datasets_curated: number;
  status: string;
  capabilities: string[];
}

/**
 * Agent State Management
 * Persistent state tracking for the research agent
 */
let researchState: ResearchState = {
  current_field: Config.DEFAULT_RESEARCH_FIELD,
  papers_analyzed: 0,
  hypotheses_generated: 0,
  research_gaps_identified: 0,
  last_update: new Date().toISOString(),
  active_hypotheses: [],
  peer_reviews_requested: 0,
  hypotheses_approved: 0,
  hypotheses_rejected: 0,
  proposals_created: 0,
  datasets_curated: 0,
  status: 'initialized',
  capabilities: [
    'literature_review',
    'hypothesis_generation',
    'gap_analysis',
    'paper_analysis',
    'research_coordination',
    'multi_agent_coordination',
    'peer_review_integration',
    'dataset_curation',
    'on_chain_proposals'
  ]
};

/**
 * Get current agent state
 */
export async function getAgentState(): Promise<ResearchState> {
  return {
    ...researchState,
    last_update: new Date().toISOString()
  };
}

/**
 * Update agent state
 */
export function setAgentState(newState: Partial<ResearchState>): void {
  researchState = {
    ...researchState,
    ...newState,
    last_update: new Date().toISOString()
  };
  Logger.info('Agent state updated', researchState);
}

/**
 * Increment papers analyzed count
 */
export function incrementPapersAnalyzed(count: number = 1): void {
  researchState.papers_analyzed += count;
  researchState.last_update = new Date().toISOString();
}

/**
 * Increment hypotheses generated count
 */
export function incrementHypothesesGenerated(count: number = 1): void {
  researchState.hypotheses_generated += count;
  researchState.last_update = new Date().toISOString();
}

/**
 * Add research gap
 */
export function addResearchGap(): void {
  researchState.research_gaps_identified += 1;
  researchState.last_update = new Date().toISOString();
}

/**
 * Add active hypothesis
 */
export function addActiveHypothesis(hypothesisId: string): void {
  if (!researchState.active_hypotheses.includes(hypothesisId)) {
    researchState.active_hypotheses.push(hypothesisId);
  }
  researchState.last_update = new Date().toISOString();
}

/**
 * Record peer review workflow result
 */
export function recordPeerReviewWorkflow(result: ResearchWorkflowResult): void {
  researchState.peer_reviews_requested += 1;

  if (result.approved) {
    researchState.hypotheses_approved += 1;
  } else {
    researchState.hypotheses_rejected += 1;
  }

  if (result.datasets && result.datasets.length > 0) {
    researchState.datasets_curated += result.datasets.length;
  }

  if (result.ready_for_proposal) {
    researchState.proposals_created += 1;
  }

  researchState.last_update = new Date().toISOString();

  Logger.info('Peer review workflow recorded', {
    hypothesis_id: result.hypothesis_id,
    approved: result.approved,
    datasets_found: result.datasets?.length || 0,
    ready_for_proposal: result.ready_for_proposal
  });
}

/**
 * Coordinate multi-agent research workflow
 * This function orchestrates peer review and dataset curation
 */
export async function coordinateHypothesisWorkflow(
  hypothesisId: string,
  hypothesis: string,
  methodology: string,
  field: string = Config.DEFAULT_RESEARCH_FIELD
): Promise<ResearchWorkflowResult> {
  Logger.info('🚀 Initiating multi-agent research workflow', {
    hypothesis_id: hypothesisId,
    field
  });

  try {
    // Use ACP coordinator to run multi-agent workflow
    const result = await coordinator.coordinateResearch(
      hypothesisId,
      hypothesis,
      methodology,
      field
    );

    // Update agent state
    recordPeerReviewWorkflow(result);

    // Log results
    if (result.ready_for_proposal) {
      Logger.info('✅ Hypothesis ready for on-chain proposal!', {
        hypothesis_id: hypothesisId,
        overall_score: result.peer_review.overall_score,
        datasets_found: result.datasets?.length || 0
      });
    } else if (result.approved) {
      Logger.info('⚠️  Hypothesis approved but no datasets found', {
        hypothesis_id: hypothesisId
      });
    } else {
      Logger.info('❌ Hypothesis needs improvement', {
        hypothesis_id: hypothesisId,
        weaknesses: result.peer_review.weaknesses
      });
    }

    return result;
  } catch (error: any) {
    Logger.error('Multi-agent workflow failed', {
      hypothesis_id: hypothesisId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Reset agent state (for testing)
 */
export function resetAgentState(): void {
  researchState = {
    current_field: Config.DEFAULT_RESEARCH_FIELD,
    papers_analyzed: 0,
    hypotheses_generated: 0,
    research_gaps_identified: 0,
    last_update: new Date().toISOString(),
    active_hypotheses: [],
    peer_reviews_requested: 0,
    hypotheses_approved: 0,
    hypotheses_rejected: 0,
    proposals_created: 0,
    datasets_curated: 0,
    status: 'reset',
    capabilities: [
      'literature_review',
      'hypothesis_generation',
      'gap_analysis',
      'paper_analysis',
      'research_coordination',
      'multi_agent_coordination',
      'peer_review_integration',
      'dataset_curation',
      'on_chain_proposals'
    ]
  };
}

/**
 * Dr. ScienceDAO - Main Autonomous Research Agent
 *
 * An autonomous AI agent specializing in scientific discovery and research.
 * Operates continuously to:
 * - Scan latest scientific literature
 * - Analyze papers for findings and gaps
 * - Generate novel, testable hypotheses
 * - Coordinate research activities
 * - Propose funding for promising research
 */
export const scienceAgent = new GameAgent(Config.GAME_API_KEY, {
  name: 'Dr. ScienceDAO',

  goal: `Autonomously conduct scientific literature review in ${Config.DEFAULT_RESEARCH_FIELD} research, identify research gaps, and generate novel testable hypotheses to advance the field.

My ultimate objective is to accelerate scientific discovery by:
1. Continuously monitoring the latest research publications
2. Identifying unexplored areas and knowledge gaps
3. Generating innovative, feasible research hypotheses
4. Proposing high-impact research directions
5. Contributing to the advancement of ${Config.DEFAULT_RESEARCH_FIELD}`,

  description: `I am Dr. ScienceDAO, an autonomous research agent specializing in scientific discovery and innovation.

My capabilities include:

📚 **Literature Review**: I continuously scan scientific databases (arXiv, PubMed) for the latest research papers. I can analyze papers across multiple fields, with primary focus on ${Config.DEFAULT_RESEARCH_FIELD} research.

🔍 **Gap Analysis**: I perform deep analysis of scientific papers to identify:
   - What has been studied and discovered
   - What methodologies were used
   - What questions remain unanswered
   - Where opportunities for innovation exist

💡 **Hypothesis Generation**: I generate novel, testable research hypotheses that:
   - Address identified research gaps
   - Are grounded in scientific rigor
   - Have clear experimental methodologies
   - Offer potential for significant impact
   - Are feasible with current or near-future technology

📊 **Research Coordination**: I can:
   - Prioritize research directions based on impact and feasibility
   - Track multiple research threads simultaneously
   - Coordinate with other agents for peer review and data curation
   - Maintain comprehensive logs of all research activities

🤝 **Multi-Agent Collaboration**: I work with specialized AI agents via Agent Commerce Protocol (ACP):
   - **Peer Review Agent**: Evaluates hypotheses for scientific validity, novelty, feasibility, and impact
   - **Data Curator Agent**: Finds relevant datasets from Kaggle, UCI ML, PubMed Central, data.gov
   - Only hypotheses that pass peer review (≥7.0/10) proceed to dataset curation
   - Only research-ready hypotheses (approved + datasets found) create on-chain proposals

🎯 **Current Focus**: ${Config.DEFAULT_RESEARCH_FIELD} research - exploring cutting-edge developments, identifying research gaps, and generating novel hypotheses to advance the field.

I am rigorous, curious, systematic, and innovative. I approach research with scientific skepticism while remaining open to breakthrough discoveries. I prioritize hypotheses that could make meaningful contributions to the field.

My work is transparent, logged, and verifiable. Every paper I analyze, every gap I identify, and every hypothesis I generate is recorded for community review and potential funding.`,

  workers: [researchWorker],

  getAgentState: getAgentState
});

// Log agent initialization
Logger.info('Science Agent initialized', {
  name: 'Dr. ScienceDAO',
  field: Config.DEFAULT_RESEARCH_FIELD,
  workers: ['researchWorker'],
  api_key_set: !!Config.GAME_API_KEY
});

// Export the agent
export default scienceAgent;

/**
 * Research Coordinator
 * Coordinates multi-agent collaboration via ACP
 *
 * Note: This is a simplified ACP-compatible implementation. The official ACP SDK
 * (@virtuals-protocol/acp-node) exists but is not yet published to the public npm registry.
 *
 * This implementation follows the ACP protocol patterns:
 * - Job-based coordination between agents
 * - Status tracking (pending, in_progress, completed, failed)
 * - Payment tracking in VIRTUAL tokens (mock)
 * - Multi-agent workflow orchestration
 *
 * When the ACP SDK becomes publicly available via npm, this can be upgraded to use
 * the full SDK for on-chain job posting, escrow, and payment settlement.
 */

import { Logger } from '../utils/logger';
import { reviewHypothesis, HypothesisReview } from '../functions/reviewHypothesis';
import { findDatasets, Dataset } from '../functions/findDatasets';
import { recordReview } from '../agents/peerReviewAgent';
import { incrementDatasetsFound } from '../agents/dataCuratorAgent';

/**
 * ACP Job structure
 */
export interface ACPJob {
  job_id: string;
  requestor: string;
  provider: string;
  task: string;
  parameters: any;
  payment: string; // In VIRTUAL tokens
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  created_at: string;
  completed_at?: string;
}

/**
 * Research workflow result
 */
export interface ResearchWorkflowResult {
  hypothesis_id: string;
  peer_review: HypothesisReview;
  datasets?: Dataset[];
  approved: boolean;
  ready_for_proposal: boolean;
}

/**
 * Research Coordinator
 * Manages multi-agent workflows via Agent Commerce Protocol
 */
export class ResearchCoordinator {
  private jobs: Map<string, ACPJob> = new Map();
  private jobCounter: number = 0;

  /**
   * Create a new job ID
   */
  private generateJobId(): string {
    this.jobCounter++;
    return `job_${Date.now()}_${this.jobCounter}`;
  }

  /**
   * Request peer review for a hypothesis
   */
  async requestPeerReview(
    hypothesisId: string,
    hypothesis: string,
    methodology: string,
    field: string
  ): Promise<HypothesisReview> {
    const jobId = this.generateJobId();

    const job: ACPJob = {
      job_id: jobId,
      requestor: 'research_agent',
      provider: 'peer_reviewer',
      task: 'review_hypothesis',
      parameters: {
        hypothesis_id: hypothesisId,
        hypothesis,
        methodology,
        field
      },
      payment: '5', // 5 VIRTUAL tokens
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.jobs.set(jobId, job);
    Logger.info(`ACP Job created: ${jobId} (Peer Review)`, {
      requestor: job.requestor,
      provider: job.provider
    });

    // Update job status
    job.status = 'in_progress';

    try {
      // Execute peer review
      const review = await reviewHypothesis(
        hypothesisId,
        hypothesis,
        methodology,
        field
      );

      // Update job as completed
      job.status = 'completed';
      job.result = review;
      job.completed_at = new Date().toISOString();

      // Update peer review agent state
      recordReview(review.overall_score, review.approved);

      Logger.info(`ACP Job completed: ${jobId}`, {
        overall_score: review.overall_score,
        approved: review.approved
      });

      return review;
    } catch (error: any) {
      job.status = 'failed';
      job.completed_at = new Date().toISOString();

      Logger.error(`ACP Job failed: ${jobId}`, {
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Request dataset curation
   */
  async requestDataCuration(
    hypothesis: string,
    field: string,
    maxResults: number = 3
  ): Promise<Dataset[]> {
    const jobId = this.generateJobId();

    const job: ACPJob = {
      job_id: jobId,
      requestor: 'research_agent',
      provider: 'data_curator',
      task: 'find_datasets',
      parameters: {
        hypothesis,
        field,
        max_results: maxResults
      },
      payment: '10', // 10 VIRTUAL tokens
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.jobs.set(jobId, job);
    Logger.info(`ACP Job created: ${jobId} (Data Curation)`, {
      requestor: job.requestor,
      provider: job.provider
    });

    // Update job status
    job.status = 'in_progress';

    try {
      // Execute dataset search
      const result = await findDatasets(hypothesis, field, maxResults);

      // Update job as completed
      job.status = 'completed';
      job.result = result;
      job.completed_at = new Date().toISOString();

      // Update data curator agent state
      incrementDatasetsFound(result.total_found);

      Logger.info(`ACP Job completed: ${jobId}`, {
        datasets_found: result.total_found
      });

      return result.datasets;
    } catch (error: any) {
      job.status = 'failed';
      job.completed_at = new Date().toISOString();

      Logger.error(`ACP Job failed: ${jobId}`, {
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Coordinate complete research workflow
   * Flow: Generate → Peer Review → (If Approved) → Find Datasets → Ready for Proposal
   */
  async coordinateResearch(
    hypothesisId: string,
    hypothesis: string,
    methodology: string,
    field: string
  ): Promise<ResearchWorkflowResult> {
    Logger.info('🔄 Starting multi-agent research workflow', {
      hypothesis_id: hypothesisId,
      field
    });

    try {
      // Step 1: Request peer review
      Logger.info('Step 1: Requesting peer review...');
      const peerReview = await this.requestPeerReview(
        hypothesisId,
        hypothesis,
        methodology,
        field
      );

      Logger.info(`✓ Peer review complete: ${peerReview.approved ? 'APPROVED' : 'NEEDS IMPROVEMENT'}`, {
        overall_score: peerReview.overall_score,
        novelty: peerReview.novelty_score,
        feasibility: peerReview.feasibility_score,
        impact: peerReview.impact_score
      });

      // Step 2: If approved, request dataset curation
      let datasets: Dataset[] | undefined;

      if (peerReview.approved) {
        Logger.info('Step 2: Requesting dataset curation...');
        datasets = await this.requestDataCuration(hypothesis, field, 3);

        Logger.info(`✓ Dataset curation complete: ${datasets.length} datasets found`);
      } else {
        Logger.info('⚠️  Hypothesis not approved, skipping dataset curation');
        Logger.info('Recommendations for improvement:', {
          weaknesses: peerReview.weaknesses,
          recommendations: peerReview.recommendations
        });
      }

      const result: ResearchWorkflowResult = {
        hypothesis_id: hypothesisId,
        peer_review: peerReview,
        datasets,
        approved: peerReview.approved,
        ready_for_proposal: peerReview.approved && (datasets?.length || 0) > 0
      };

      if (result.ready_for_proposal) {
        Logger.info('✅ Research workflow complete: Ready for on-chain proposal!');
      } else {
        Logger.info('⏸️  Research workflow complete: Not ready for proposal yet');
      }

      return result;
    } catch (error: any) {
      Logger.error('Research workflow failed', {
        error: error.message,
        hypothesis_id: hypothesisId
      });

      throw error;
    }
  }

  /**
   * Get job status
   */
  getJob(jobId: string): ACPJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): ACPJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: ACPJob['status']): ACPJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }
}

/**
 * Singleton coordinator instance
 */
export const coordinator = new ResearchCoordinator();

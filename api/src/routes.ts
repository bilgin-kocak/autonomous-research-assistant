import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {
  AgentStatus,
  Hypothesis,
  Paper,
  Proposal,
  AgentStats,
  ActivityLog,
  ResearchLogEntry,
} from './types';

const router = Router();

// Helper function to read research log
function getResearchLog(): ResearchLogEntry[] {
  try {
    const logPath = path.join(__dirname, '../../data/research_log.json');
    const data = fs.readFileSync(logPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading research log:', error);
    return [];
  }
}

// Helper function to read contract config
function getContractConfig(): any {
  try {
    const configPath = path.join(__dirname, '../../config/contract.json');
    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contract config:', error);
    return null;
  }
}

/**
 * GET /api/status - Agent statistics and health
 *
 * Returns real-time statistics about agent activity by analyzing research_log.json.
 * This endpoint powers the main dashboard statistics display.
 *
 * Response includes:
 * - agent_status: Current operational status
 * - uptime: Time since first log entry (milliseconds)
 * - papers_analyzed: Count of PAPER_ANALYSIS log entries
 * - hypotheses_generated: Count of HYPOTHESIS_GENERATION entries
 * - proposals_created: Count of on-chain proposals
 * - peer_reviews_completed: Count of PEER_REVIEW entries
 * - datasets_curated: Count of DATA_CURATION entries
 * - acp_jobs_completed: Count of completed ACP jobs
 * - last_activity: Timestamp of most recent activity
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    // Read all log entries from research_log.json
    const logs = getResearchLog();

    // Count different types of agent activities by filtering log entries
    const papersAnalyzed = logs.filter((log) => log.type === 'PAPER_ANALYSIS').length;
    const hypothesesGenerated = logs.filter((log) => log.type === 'HYPOTHESIS_GENERATION').length;
    const peerReviewsCompleted = logs.filter((log) => log.type === 'PEER_REVIEW').length;
    const dataCurationsCompleted = logs.filter((log) => log.type === 'DATA_CURATION').length;

    // Count completed ACP (Agent Commerce Protocol) jobs
    // These represent inter-agent communication and coordination
    const acpJobs = logs.filter((log) => log.message.includes('ACP Job completed'));

    // Get timestamp of most recent activity
    const lastActivity = logs.length > 0 ? logs[logs.length - 1].timestamp : new Date().toISOString();

    // Calculate uptime: time since agent started (first log entry)
    const firstLog = logs.length > 0 ? new Date(logs[0].timestamp) : new Date();
    const uptime = Date.now() - firstLog.getTime();

    // Build status response object
    const status: AgentStatus = {
      agent_status: 'active',
      uptime,
      papers_analyzed: papersAnalyzed,
      hypotheses_generated: hypothesesGenerated,
      proposals_created: 0, // Updated by PROPOSAL_CREATED log entries
      peer_reviews_completed: peerReviewsCompleted,
      datasets_curated: dataCurationsCompleted,
      acp_jobs_completed: acpJobs.length,
      last_activity: lastActivity,
    };

    res.json(status);
  } catch (error) {
    console.error('Error in /api/status:', error);
    res.status(500).json({ error: 'Failed to fetch agent status' });
  }
});

// GET /api/hypotheses - Recent hypotheses with peer review scores
router.get('/hypotheses', (req: Request, res: Response) => {
  try {
    const logs = getResearchLog();
    const hypotheses: Hypothesis[] = [];

    // Find peer review entries
    const peerReviews = logs.filter((log) => log.type === 'PEER_REVIEW');

    peerReviews.forEach((review) => {
      if (review.data) {
        const reviewData = review.data;

        // Find corresponding dataset curation
        const datasetsLog = logs.find(
          (log) =>
            log.type === 'DATA_CURATION' &&
            log.message.includes(reviewData.hypothesis_id)
        );

        const hypothesis: Hypothesis = {
          id: reviewData.hypothesis_id || 'unknown',
          hypothesis: reviewData.hypothesis || `Research hypothesis for ${reviewData.field || 'unknown field'}`,
          field: reviewData.field || 'unknown',
          novelty_score: reviewData.novelty_score || reviewData.novelty || 0,
          feasibility_score: reviewData.feasibility_score || reviewData.feasibility || 0,
          impact_score: reviewData.impact_score || reviewData.impact || 0,
          rigor_score: reviewData.rigor_score || reviewData.rigor || 0,
          overall_score: reviewData.overall_score || 0,
          approved: reviewData.approved || false,
          generated_at: review.timestamp,
          reviewed_at: review.timestamp,
          datasets_found: datasetsLog?.data?.datasets?.length || 0,
          strengths: reviewData.strengths || undefined,
          weaknesses: reviewData.weaknesses || undefined,
          recommendations: reviewData.recommendations || undefined,
        };

        hypotheses.push(hypothesis);
      }
    });

    res.json({ hypotheses });
  } catch (error) {
    console.error('Error in /api/hypotheses:', error);
    res.status(500).json({ error: 'Failed to fetch hypotheses' });
  }
});

// GET /api/papers - Analyzed papers
router.get('/papers', (req: Request, res: Response) => {
  try {
    const logs = getResearchLog();
    const papers: Paper[] = [];

    const paperAnalyses = logs.filter((log) => log.type === 'PAPER_ANALYSIS');

    paperAnalyses.forEach((analysis) => {
      if (analysis.data && analysis.data.paperTitle) {
        const paper: Paper = {
          title: analysis.data.paperTitle,
          analyzed_at: analysis.timestamp,
          findings: analysis.data.findings?.findings,
          methodology: analysis.data.findings?.methodology,
          gaps: analysis.data.findings?.gaps,
          next_steps: analysis.data.findings?.next_steps,
        };
        papers.push(paper);
      }
    });

    res.json({ papers });
  } catch (error) {
    console.error('Error in /api/papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

/**
 * GET /api/proposals - Funding proposals
 *
 * Returns all on-chain funding proposals created from approved hypotheses.
 * Proposals are created automatically when a hypothesis is approved by peer review.
 *
 * This endpoint:
 * 1. Reads PROPOSAL_CREATED log entries from research_log.json
 * 2. Transforms raw proposal data into frontend-friendly format
 * 3. Calculates deadline from creation timestamp + duration
 * 4. Parses funding goals (handles "0.1 ETH" → 0.1)
 * 5. Creates user-friendly titles from hypothesis text
 * 6. Sorts proposals by creation date (newest first)
 *
 * Each proposal includes:
 * - id: On-chain proposal ID
 * - hypothesis_id: Reference to original hypothesis
 * - title: First 80 chars of hypothesis (for display)
 * - description: Full hypothesis text + methodology
 * - funding_goal: Target amount in ETH
 * - current_funding: Current funding amount (updated by events)
 * - deadline: ISO timestamp when funding closes
 * - status: 'active' | 'funded' | 'completed'
 * - tx_hash: Transaction hash on Base Sepolia
 * - on_chain_address: Contract address
 */
router.get('/proposals', (req: Request, res: Response) => {
  try {
    const logs = getResearchLog();
    const proposals: Proposal[] = [];

    // Filter for proposal creation events
    // These are logged by coordinator.ts after calling createProposal()
    const proposalLogs = logs.filter((log) => log.type === 'PROPOSAL_CREATED');

    proposalLogs.forEach((proposalLog) => {
      if (proposalLog.data) {
        const data = proposalLog.data;

        // Calculate deadline: creation time + duration
        // Example: created Jan 1 + 30 days = deadline Jan 31
        const createdAt = new Date(proposalLog.timestamp);
        const durationDays = data.duration || 30;
        const deadline = new Date(createdAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // Parse funding goal from string to number
        // Handles both "0.1" and "0.1 ETH" formats
        const fundingGoalStr = (data.fundingGoal || '0.1').toString().replace(/\s*ETH\s*/i, '');
        const fundingGoal = parseFloat(fundingGoalStr) || 0.1;

        // Create display title from hypothesis text
        // Truncate to 80 chars for UI readability
        const title = data.hypothesis
          ? data.hypothesis.substring(0, 80) + (data.hypothesis.length > 80 ? '...' : '')
          : `Research Proposal ${data.proposalId}`;

        // Full description includes hypothesis + methodology
        // Used in expanded proposal view
        const description = data.hypothesis || data.methodology || 'On-chain research funding proposal';

        // Build proposal object matching frontend Proposal type
        const proposal: Proposal = {
          id: data.proposalId?.toString() || '0',
          hypothesis_id: data.hypothesis_id,
          title: title,
          description: description,
          funding_goal: fundingGoal,
          current_funding: 0, // TODO: Query blockchain for current funding
          deadline: deadline.toISOString(),
          created_at: proposalLog.timestamp,
          status: 'active', // TODO: Check on-chain status
          tx_hash: data.txHash,
          on_chain_address: data.txHash,
        };
        proposals.push(proposal);
      }
    });

    // Sort by creation date (newest first)
    // Most recent proposals appear at top of list
    proposals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ proposals });
  } catch (error) {
    console.error('Error in /api/proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// GET /api/agents - Multi-agent statistics
router.get('/agents', (req: Request, res: Response) => {
  try {
    const logs = getResearchLog();

    // Peer Reviewer stats
    const peerReviews = logs.filter((log) => log.type === 'PEER_REVIEW');
    const approvedReviews = peerReviews.filter((log) => log.data?.approved === true);
    const rejectedReviews = peerReviews.filter((log) => log.data?.approved === false);

    const totalScore = peerReviews.reduce((sum, log) => sum + (log.data?.overall_score || 0), 0);
    const averageScore = peerReviews.length > 0 ? totalScore / peerReviews.length : 0;

    // Data Curator stats
    const dataCurations = logs.filter((log) => log.type === 'DATA_CURATION');
    const totalDatasets = dataCurations.reduce((sum, log) => {
      return sum + (log.data?.datasets?.length || 0);
    }, 0);

    const agentStats: AgentStats = {
      peer_reviewer: {
        reviews_completed: peerReviews.length,
        average_score: Math.round(averageScore * 10) / 10,
        approved: approvedReviews.length,
        rejected: rejectedReviews.length,
        status: peerReviews.length > 0 ? 'active' : 'idle',
      },
      data_curator: {
        searches_performed: dataCurations.length,
        datasets_found: totalDatasets,
        data_sources: ['Kaggle', 'UCI ML', 'PubMed Central', 'data.gov'],
        status: dataCurations.length > 0 ? 'active' : 'idle',
      },
    };

    res.json(agentStats);
  } catch (error) {
    console.error('Error in /api/agents:', error);
    res.status(500).json({ error: 'Failed to fetch agent stats' });
  }
});

// GET /api/activity - Recent activity feed
router.get('/activity', (req: Request, res: Response) => {
  try {
    const logs = getResearchLog();
    const limit = parseInt(req.query.limit as string) || 50;

    // Get recent logs, filtered for important events
    const importantTypes = [
      'PAPER_FETCH',
      'PAPER_ANALYSIS',
      'HYPOTHESIS_GENERATION',
      'PEER_REVIEW',
      'DATA_CURATION',
      'INFO',
    ];

    const recentLogs = logs
      .filter((log) => importantTypes.includes(log.type))
      .slice(-limit)
      .reverse();

    res.json({ activity: recentLogs });
  } catch (error) {
    console.error('Error in /api/activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;

/**
 * Multi-Agent Workflow Test
 * Tests the complete research workflow with peer review and data curation
 */

import { Logger } from './utils/logger';
import { coordinateHypothesisWorkflow } from './agents/scienceAgent';
import { coordinator } from './acp/coordinator';
import { getPeerReviewState } from './agents/peerReviewAgent';
import { getDataCuratorState } from './agents/dataCuratorAgent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test hypothesis data
 */
const TEST_HYPOTHESES = [
  {
    id: 'hyp_001',
    hypothesis:
      'Combining senolytics with NAD+ precursors synergistically reduces markers of cellular aging',
    methodology:
      'We will conduct a randomized controlled trial with 200 participants aged 50-70, measuring telomere length, cellular senescence markers, and NAD+ levels before and after 12 weeks of treatment. The study will include four arms: senolytics only, NAD+ precursors only, combination therapy, and placebo.',
    field: 'longevity and aging research'
  },
  {
    id: 'hyp_002',
    hypothesis:
      'Daily meditation practice of 30 minutes increases hippocampal volume in adults over 60',
    methodology:
      'We will use MRI imaging to measure hippocampal volume in 100 participants before and after an 8-week meditation intervention. Control group will maintain normal activities. We will also measure cognitive function and stress markers.',
    field: 'neuroscience and cognitive aging'
  },
  {
    id: 'hyp_003',
    hypothesis: 'Eating chocolate every day cures all diseases',
    methodology:
      'We will give people chocolate and see if they get better. No control group needed.',
    field: 'nutrition'
  }
];

/**
 * Test multi-agent workflow with a single hypothesis
 */
async function testSingleHypothesis(
  hypothesisId: string,
  hypothesis: string,
  methodology: string,
  field: string
): Promise<void> {
  Logger.info('\n' + '='.repeat(80));
  Logger.info(`Testing Hypothesis: ${hypothesisId}`);
  Logger.info('='.repeat(80) + '\n');

  Logger.info('📝 Hypothesis:', { hypothesis: hypothesis.substring(0, 100) + '...' });

  try {
    // Run multi-agent workflow
    const result = await coordinateHypothesisWorkflow(hypothesisId, hypothesis, methodology, field);

    // Display results
    Logger.info('\n📊 PEER REVIEW RESULTS:');
    Logger.info(`  Overall Score: ${result.peer_review.overall_score}/10`);
    Logger.info(`  Novelty: ${result.peer_review.novelty_score}/10`);
    Logger.info(`  Feasibility: ${result.peer_review.feasibility_score}/10`);
    Logger.info(`  Impact: ${result.peer_review.impact_score}/10`);
    Logger.info(`  Rigor: ${result.peer_review.rigor_score}/10`);
    Logger.info(`  Approved: ${result.approved ? '✅ YES' : '❌ NO'}`);
    Logger.info(`  Reviewer Confidence: ${result.peer_review.reviewer_confidence}/10`);

    if (result.peer_review.strengths.length > 0) {
      Logger.info('\n💪 Strengths:');
      result.peer_review.strengths.forEach((s, i) => Logger.info(`  ${i + 1}. ${s}`));
    }

    if (result.peer_review.weaknesses.length > 0) {
      Logger.info('\n⚠️  Weaknesses:');
      result.peer_review.weaknesses.forEach((w, i) => Logger.info(`  ${i + 1}. ${w}`));
    }

    if (result.peer_review.recommendations.length > 0) {
      Logger.info('\n💡 Recommendations:');
      result.peer_review.recommendations.forEach((r, i) => Logger.info(`  ${i + 1}. ${r}`));
    }

    if (result.datasets && result.datasets.length > 0) {
      Logger.info('\n📚 DATASETS FOUND:');
      result.datasets.forEach((dataset, i) => {
        Logger.info(`\n  ${i + 1}. ${dataset.name}`);
        Logger.info(`     Source: ${dataset.source}`);
        Logger.info(`     URL: ${dataset.url}`);
        Logger.info(`     Size: ${dataset.size}`);
        Logger.info(`     Format: ${dataset.format}`);
        Logger.info(`     Relevance: ${dataset.relevance_score}/10`);
        Logger.info(`     Access: ${dataset.access}`);
      });
    }

    Logger.info('\n🎯 FINAL STATUS:');
    Logger.info(`  Ready for Proposal: ${result.ready_for_proposal ? '✅ YES' : '❌ NO'}`);

    if (result.ready_for_proposal) {
      Logger.info(
        '\n  🚀 This hypothesis can proceed to on-chain proposal creation!'
      );
    } else if (result.approved) {
      Logger.info(
        '\n  ⚠️  Hypothesis approved but needs datasets before proceeding to proposal.'
      );
    } else {
      Logger.info(
        '\n  ❌ Hypothesis needs improvement based on peer review feedback.'
      );
    }
  } catch (error: any) {
    Logger.error('Test failed', { error: error.message });
    throw error;
  }
}

/**
 * Main test function
 */
async function runTests(): Promise<void> {
  Logger.info('🧪 Starting Multi-Agent Workflow Tests\n');

  try {
    // Test each hypothesis
    for (const test of TEST_HYPOTHESES) {
      await testSingleHypothesis(test.id, test.hypothesis, test.methodology, test.field);

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Display agent states
    Logger.info('\n\n' + '='.repeat(80));
    Logger.info('🤖 AGENT STATES SUMMARY');
    Logger.info('='.repeat(80) + '\n');

    const peerReviewState = await getPeerReviewState();
    Logger.info('👨‍🔬 Peer Review Agent:');
    Logger.info(`  Reviews Completed: ${peerReviewState.reviews_completed}`);
    Logger.info(`  Average Score: ${peerReviewState.average_score.toFixed(2)}/10`);
    Logger.info(`  Approved: ${peerReviewState.approved_count}`);
    Logger.info(`  Rejected: ${peerReviewState.rejected_count}`);
    Logger.info(`  Status: ${peerReviewState.status}`);

    const dataCuratorState = await getDataCuratorState();
    Logger.info('\n📚 Data Curator Agent:');
    Logger.info(`  Searches Performed: ${dataCuratorState.searches_performed}`);
    Logger.info(`  Datasets Found: ${dataCuratorState.datasets_found}`);
    Logger.info(`  Data Sources: ${dataCuratorState.sources.join(', ')}`);
    Logger.info(`  Status: ${dataCuratorState.status}`);

    // Display ACP jobs
    Logger.info('\n\n' + '='.repeat(80));
    Logger.info('📋 ACP JOBS SUMMARY');
    Logger.info('='.repeat(80) + '\n');

    const allJobs = coordinator.getAllJobs();
    Logger.info(`Total Jobs Created: ${allJobs.length}`);

    const completedJobs = coordinator.getJobsByStatus('completed');
    const failedJobs = coordinator.getJobsByStatus('failed');

    Logger.info(`✅ Completed: ${completedJobs.length}`);
    Logger.info(`❌ Failed: ${failedJobs.length}`);

    Logger.info('\n📊 Job Details:');
    allJobs.forEach((job) => {
      Logger.info(`\n  Job ID: ${job.job_id}`);
      Logger.info(`  Task: ${job.task}`);
      Logger.info(`  Provider: ${job.provider}`);
      Logger.info(`  Status: ${job.status}`);
      Logger.info(`  Payment: ${job.payment} VIRTUAL`);
      Logger.info(`  Created: ${new Date(job.created_at).toLocaleString()}`);
      if (job.completed_at) {
        Logger.info(`  Completed: ${new Date(job.completed_at).toLocaleString()}`);
      }
    });

    Logger.info('\n\n✅ All tests completed successfully!');
  } catch (error: any) {
    Logger.error('Test suite failed', { error: error.message });
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(() => {
      Logger.info('\n🎉 Test suite finished!');
      process.exit(0);
    })
    .catch((error) => {
      Logger.error('Test suite encountered an error', { error: error.message });
      process.exit(1);
    });
}

export { runTests, testSingleHypothesis };

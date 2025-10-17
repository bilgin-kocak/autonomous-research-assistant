/**
 * Long-running test for Day 4: Testing & Refinement
 *
 * This test runs the research agent for 10+ minutes to verify stability:
 * - Tests continuous operation
 * - Monitors memory usage
 * - Tracks API call success rates
 * - Validates error recovery
 * - Ensures no memory leaks
 *
 * Usage:
 *   npm run test:longrunning
 */

import { fetchPapersWithRateLimit } from '../src/functions/fetchPapers';
import { batchAnalyzePapers } from '../src/functions/analyzePaper';
import { generateHypotheses } from '../src/functions/generateHypothesis';
import { Config } from '../src/utils/config';
import { Logger, LogLevel } from '../src/utils/logger';

/**
 * Test configuration
 */
const TEST_CONFIG = {
  durationMinutes: 10,
  iterationIntervalSeconds: 30,
  papersPerIteration: 2,
  researchTopics: ['longevity', 'aging', 'cellular senescence', 'NAD+', 'autophagy'],
  enableDetailedLogging: true
};

/**
 * Test metrics
 */
interface TestMetrics {
  startTime: Date;
  iterations: number;
  successfulIterations: number;
  failedIterations: number;
  totalPapers: number;
  totalAnalyses: number;
  totalHypotheses: number;
  errors: Array<{ timestamp: Date; error: string }>;
  memorySnapshots: Array<{ timestamp: Date; heapUsedMB: number }>;
}

let testMetrics: TestMetrics = {
  startTime: new Date(),
  iterations: 0,
  successfulIterations: 0,
  failedIterations: 0,
  totalPapers: 0,
  totalAnalyses: 0,
  totalHypotheses: 0,
  errors: [],
  memorySnapshots: []
};

let isTestRunning = true;

/**
 * Take memory snapshot
 */
function takeMemorySnapshot(): void {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);

  testMetrics.memorySnapshots.push({
    timestamp: new Date(),
    heapUsedMB
  });

  Logger.debug(`Memory snapshot: ${heapUsedMB}MB heap used`);
}

/**
 * Display test progress
 */
function displayProgress(): void {
  const runtime = Math.round((new Date().getTime() - testMetrics.startTime.getTime()) / 1000);
  const minutes = Math.floor(runtime / 60);
  const seconds = runtime % 60;

  const targetRuntime = TEST_CONFIG.durationMinutes * 60;
  const progressPercent = Math.min(100, Math.round((runtime / targetRuntime) * 100));

  console.log('\n' + '='.repeat(70));
  console.log('📊 Long-Running Test Progress');
  console.log('='.repeat(70));
  console.log(`Runtime: ${minutes}m ${seconds}s / ${TEST_CONFIG.durationMinutes}m (${progressPercent}%)`);
  console.log(`Iterations: ${testMetrics.iterations} (Success: ${testMetrics.successfulIterations}, Failed: ${testMetrics.failedIterations})`);
  console.log(`Papers Fetched: ${testMetrics.totalPapers}`);
  console.log(`Papers Analyzed: ${testMetrics.totalAnalyses}`);
  console.log(`Hypotheses Generated: ${testMetrics.totalHypotheses}`);
  console.log(`Errors: ${testMetrics.errors.length}`);

  // Memory stats
  if (testMetrics.memorySnapshots.length > 0) {
    const latestSnapshot = testMetrics.memorySnapshots[testMetrics.memorySnapshots.length - 1];
    const firstSnapshot = testMetrics.memorySnapshots[0];
    const memoryGrowth = latestSnapshot.heapUsedMB - firstSnapshot.heapUsedMB;

    console.log(`Memory: ${latestSnapshot.heapUsedMB}MB (Growth: ${memoryGrowth > 0 ? '+' : ''}${memoryGrowth}MB)`);
  }

  console.log('='.repeat(70) + '\n');
}

/**
 * Display final summary
 */
function displayFinalSummary(): void {
  const runtime = Math.round((new Date().getTime() - testMetrics.startTime.getTime()) / 1000);
  const minutes = Math.floor(runtime / 60);
  const seconds = runtime % 60;

  console.log('\n' + '='.repeat(70));
  console.log('🎉 Long-Running Test Complete');
  console.log('='.repeat(70));
  console.log(`Total Runtime: ${minutes}m ${seconds}s`);
  console.log(`Total Iterations: ${testMetrics.iterations}`);
  console.log(`Success Rate: ${testMetrics.iterations > 0 ? Math.round((testMetrics.successfulIterations / testMetrics.iterations) * 100) : 0}%`);
  console.log(`Papers Fetched: ${testMetrics.totalPapers}`);
  console.log(`Papers Analyzed: ${testMetrics.totalAnalyses}`);
  console.log(`Hypotheses Generated: ${testMetrics.totalHypotheses}`);
  console.log(`Total Errors: ${testMetrics.errors.length}`);
  console.log();

  // Memory analysis
  let memoryGrowth = 0;
  if (testMetrics.memorySnapshots.length > 1) {
    const firstSnapshot = testMetrics.memorySnapshots[0];
    const lastSnapshot = testMetrics.memorySnapshots[testMetrics.memorySnapshots.length - 1];
    memoryGrowth = lastSnapshot.heapUsedMB - firstSnapshot.heapUsedMB;
    const avgMemory = Math.round(
      testMetrics.memorySnapshots.reduce((sum, s) => sum + s.heapUsedMB, 0) /
      testMetrics.memorySnapshots.length
    );

    console.log('Memory Analysis:');
    console.log(`  Initial: ${firstSnapshot.heapUsedMB}MB`);
    console.log(`  Final: ${lastSnapshot.heapUsedMB}MB`);
    console.log(`  Growth: ${memoryGrowth > 0 ? '+' : ''}${memoryGrowth}MB`);
    console.log(`  Average: ${avgMemory}MB`);
    console.log(`  Snapshots: ${testMetrics.memorySnapshots.length}`);
    console.log();

    if (memoryGrowth > 50) {
      console.log('⚠️  WARNING: Significant memory growth detected (>50MB)');
      console.log('   This may indicate a memory leak.');
      console.log();
    } else {
      console.log('✓ Memory usage appears stable');
      console.log();
    }
  }

  // Error summary
  if (testMetrics.errors.length > 0) {
    console.log('Errors encountered:');
    testMetrics.errors.slice(0, 5).forEach((err, idx) => {
      console.log(`  ${idx + 1}. [${err.timestamp.toLocaleTimeString()}] ${err.error.substring(0, 80)}...`);
    });
    if (testMetrics.errors.length > 5) {
      console.log(`  ... and ${testMetrics.errors.length - 5} more`);
    }
    console.log();
  }

  // API metrics
  const apiMetrics = Logger.getAPIMetricsSummary();
  if (Object.keys(apiMetrics).length > 0) {
    console.log('API Call Metrics:');
    Object.entries(apiMetrics).forEach(([endpoint, metrics]: [string, any]) => {
      console.log(`  ${endpoint}:`);
      console.log(`    Total Calls: ${metrics.totalCalls}`);
      console.log(`    Success Rate: ${metrics.successRate}`);
      console.log(`    Avg Response Time: ${metrics.averageResponseTime}`);
      if (metrics.lastError) {
        console.log(`    Last Error: ${metrics.lastError.substring(0, 60)}...`);
      }
    });
    console.log();
  }

  // Performance summary
  const perfSummary = Logger.getPerformanceSummary();
  if (Object.keys(perfSummary).length > 0) {
    console.log('Performance Summary:');
    Object.entries(perfSummary).forEach(([operation, stats]: [string, any]) => {
      console.log(`  ${operation}:`);
      console.log(`    Count: ${stats.count}`);
      console.log(`    Avg Duration: ${stats.averageDuration}`);
      console.log(`    Success Rate: ${stats.successRate}`);
    });
    console.log();
  }

  // Overall assessment
  const successRate = testMetrics.iterations > 0
    ? (testMetrics.successfulIterations / testMetrics.iterations) * 100
    : 0;

  console.log('='.repeat(70));
  if (successRate >= 90 && memoryGrowth < 50) {
    console.log('✅ PASS: Agent is stable for extended operation');
  } else if (successRate >= 70) {
    console.log('⚠️  PARTIAL: Agent is mostly stable but has some issues');
  } else {
    console.log('❌ FAIL: Agent is not stable enough for production');
  }
  console.log('='.repeat(70) + '\n');

  console.log(`Detailed logs saved to: ${Config.RESEARCH_LOG_FILE}`);
  console.log();
}

/**
 * Execute single research iteration
 */
async function executeIteration(iterationNumber: number): Promise<boolean> {
  const startTime = Date.now();

  try {
    // Select random topic
    const topic = TEST_CONFIG.researchTopics[
      Math.floor(Math.random() * TEST_CONFIG.researchTopics.length)
    ];

    Logger.info(`\n[Iteration ${iterationNumber}] Starting research on "${topic}"`);
    console.log(`\n[Iteration ${iterationNumber}] Research topic: "${topic}"`);

    // Step 1: Fetch papers
    Logger.debug(`Fetching ${TEST_CONFIG.papersPerIteration} papers...`);
    const fetchResult = await fetchPapersWithRateLimit(topic, TEST_CONFIG.papersPerIteration);
    testMetrics.totalPapers += fetchResult.count;
    Logger.info(`✓ Fetched ${fetchResult.count} papers`);

    if (fetchResult.count === 0) {
      Logger.warning('No papers fetched, skipping analysis');
      return true; // Not a failure, just no results
    }

    // Step 2: Analyze papers
    Logger.debug('Analyzing papers...');
    const papersToAnalyze = fetchResult.papers.map(p => ({
      title: p.title,
      summary: p.summary
    }));

    const analyses = await batchAnalyzePapers(papersToAnalyze, 2000);
    testMetrics.totalAnalyses += analyses.length;
    Logger.info(`✓ Analyzed ${analyses.length} papers`);

    // Step 3: Aggregate gaps
    const allGaps: string[] = [];
    analyses.forEach(analysis => {
      allGaps.push(...analysis.gaps);
    });

    if (allGaps.length === 0) {
      Logger.warning('No research gaps identified');
      return true;
    }

    const gapsSummary = `Research gaps from ${topic}:\n${allGaps.map((gap, idx) => `${idx + 1}. ${gap}`).join('\n')}`;

    // Step 4: Generate hypotheses
    Logger.debug('Generating hypotheses...');
    const hypothesesResult = await generateHypotheses(gapsSummary, topic, 2);
    testMetrics.totalHypotheses += hypothesesResult.hypotheses.length;
    Logger.info(`✓ Generated ${hypothesesResult.hypotheses.length} hypotheses`);

    const duration = Date.now() - startTime;
    Logger.trackPerformance(`iteration_${iterationNumber}`, duration, true, {
      topic,
      papers: fetchResult.count,
      analyses: analyses.length,
      hypotheses: hypothesesResult.hypotheses.length
    });

    console.log(`  Completed in ${(duration / 1000).toFixed(1)}s`);
    return true;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    Logger.error(`Iteration ${iterationNumber} failed: ${error.message}`, {
      error: error.message,
      stack: error.stack
    });

    testMetrics.errors.push({
      timestamp: new Date(),
      error: error.message
    });

    Logger.trackPerformance(`iteration_${iterationNumber}`, duration, false, {
      error: error.message
    });

    console.log(`  Failed after ${(duration / 1000).toFixed(1)}s: ${error.message}`);
    return false;
  }
}

/**
 * Main test function
 */
async function runLongRunningTest() {
  console.log('='.repeat(70));
  console.log('🧪 ScienceDAO Long-Running Stability Test');
  console.log('='.repeat(70));
  console.log(`Duration: ${TEST_CONFIG.durationMinutes} minutes`);
  console.log(`Iteration Interval: ${TEST_CONFIG.iterationIntervalSeconds} seconds`);
  console.log(`Papers per Iteration: ${TEST_CONFIG.papersPerIteration}`);
  console.log(`Research Topics: ${TEST_CONFIG.researchTopics.join(', ')}`);
  console.log('='.repeat(70));
  console.log();

  // Configure logger
  if (TEST_CONFIG.enableDetailedLogging) {
    Logger.setLogLevel(LogLevel.DEBUG);
    Logger.setDebugMode(true);
  }

  // Display configuration
  console.log(Config.summary());
  console.log();

  Logger.info('Starting long-running stability test');
  Logger.info(`Test will run for ${TEST_CONFIG.durationMinutes} minutes`);

  // Take initial memory snapshot
  takeMemorySnapshot();

  // Calculate test duration
  const testDurationMs = TEST_CONFIG.durationMinutes * 60 * 1000;
  const startTime = Date.now();

  // Main test loop
  let iterationCount = 0;

  while (isTestRunning && (Date.now() - startTime) < testDurationMs) {
    iterationCount++;
    testMetrics.iterations = iterationCount;

    // Execute iteration
    const success = await executeIteration(iterationCount);

    if (success) {
      testMetrics.successfulIterations++;
    } else {
      testMetrics.failedIterations++;
    }

    // Take memory snapshot every 3 iterations
    if (iterationCount % 3 === 0) {
      takeMemorySnapshot();
    }

    // Display progress every iteration
    displayProgress();

    // Wait before next iteration
    const remainingTime = testDurationMs - (Date.now() - startTime);
    if (remainingTime > 0 && isTestRunning) {
      const waitTime = Math.min(TEST_CONFIG.iterationIntervalSeconds * 1000, remainingTime);
      Logger.debug(`Waiting ${waitTime / 1000}s before next iteration...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Take final memory snapshot
  takeMemorySnapshot();

  // Display final summary
  displayFinalSummary();
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  isTestRunning = false;
  displayFinalSummary();
  process.exit(0);
});

// Run the test
runLongRunningTest()
  .then(() => {
    console.log('✓ Long-running test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Long-running test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  });

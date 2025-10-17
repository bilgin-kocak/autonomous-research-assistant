/**
 * ScienceDAO Autonomous Research Agent
 * Main Entry Point
 *
 * This is the primary entry point for running the autonomous research agent.
 * The agent will continuously:
 * - Fetch papers from arXiv
 * - Analyze papers for findings and gaps
 * - Generate novel hypotheses
 * - Log all activity
 *
 * Day 4 Enhancements:
 * - Continuous operation with health monitoring
 * - Enhanced error recovery and retry logic
 * - Performance metrics and statistics
 * - Graceful degradation on API failures
 */

import { scienceAgent, getAgentState } from './agents/scienceAgent';
import { Config } from './utils/config';
import { Logger } from './utils/logger';

/**
 * Operation mode configuration
 */
interface OperationConfig {
  mode: 'single' | 'continuous' | 'test';
  intervalMinutes?: number;
  maxIterations?: number;
  enableHealthChecks?: boolean;
}

/**
 * Health check status
 */
interface HealthStatus {
  openai: boolean;
  arxiv: boolean;
  lastCheck: Date;
  errors: string[];
}

/**
 * Performance metrics
 */
interface PerformanceMetrics {
  startTime: Date;
  iterations: number;
  successfulIterations: number;
  failedIterations: number;
  totalPapersFetched: number;
  totalPapersAnalyzed: number;
  totalHypothesesGenerated: number;
  averageIterationTime: number;
  lastIterationTime: number;
  memoryUsageMB: number;
}

// Global state for graceful shutdown
let isShuttingDown = false;
let metrics: PerformanceMetrics = {
  startTime: new Date(),
  iterations: 0,
  successfulIterations: 0,
  failedIterations: 0,
  totalPapersFetched: 0,
  totalPapersAnalyzed: 0,
  totalHypothesesGenerated: 0,
  averageIterationTime: 0,
  lastIterationTime: 0,
  memoryUsageMB: 0
};

/**
 * Health check for external services
 */
async function performHealthCheck(): Promise<HealthStatus> {
  const status: HealthStatus = {
    openai: false,
    arxiv: false,
    lastCheck: new Date(),
    errors: []
  };

  Logger.debug('Performing health check...');

  // Check OpenAI connectivity
  try {
    if (Config.OPENAI_API_KEY) {
      status.openai = true;
      Logger.debug('✓ OpenAI API key configured');
    } else {
      status.errors.push('OpenAI API key not configured');
      Logger.debug('✗ OpenAI API key missing');
    }
  } catch (error: any) {
    status.errors.push(`OpenAI check failed: ${error.message}`);
    Logger.debug(`✗ OpenAI health check failed: ${error.message}`);
  }

  // Check arXiv connectivity
  try {
    const axios = await import('axios');
    const response = await axios.default.get(Config.ARXIV_API_URL, {
      timeout: 5000,
      params: {
        search_query: 'test',
        max_results: 1
      }
    });
    status.arxiv = response.status === 200;
    Logger.debug('✓ arXiv API accessible');
  } catch (error: any) {
    status.errors.push(`arXiv check failed: ${error.message}`);
    Logger.debug(`✗ arXiv health check failed: ${error.message}`);
  }

  return status;
}

/**
 * Update performance metrics
 */
function updateMetrics(iterationTime: number, success: boolean): void {
  metrics.iterations++;
  if (success) {
    metrics.successfulIterations++;
  } else {
    metrics.failedIterations++;
  }

  metrics.lastIterationTime = iterationTime;
  metrics.averageIterationTime =
    (metrics.averageIterationTime * (metrics.iterations - 1) + iterationTime) /
    metrics.iterations;

  // Update memory usage
  const used = process.memoryUsage();
  metrics.memoryUsageMB = Math.round(used.heapUsed / 1024 / 1024);
}

/**
 * Display performance metrics
 */
function displayMetrics(): void {
  const runtime = Math.round((new Date().getTime() - metrics.startTime.getTime()) / 1000);
  const minutes = Math.floor(runtime / 60);
  const seconds = runtime % 60;

  console.log('\n' + '='.repeat(70));
  console.log('📊 Performance Metrics');
  console.log('='.repeat(70));
  console.log(`Runtime: ${minutes}m ${seconds}s`);
  console.log(`Iterations: ${metrics.iterations} (Success: ${metrics.successfulIterations}, Failed: ${metrics.failedIterations})`);
  console.log(`Success Rate: ${metrics.iterations > 0 ? Math.round((metrics.successfulIterations / metrics.iterations) * 100) : 0}%`);
  console.log(`Average Iteration Time: ${metrics.averageIterationTime.toFixed(1)}ms`);
  console.log(`Last Iteration Time: ${metrics.lastIterationTime.toFixed(1)}ms`);
  console.log(`Memory Usage: ${metrics.memoryUsageMB}MB`);
  console.log(`Papers Fetched: ${metrics.totalPapersFetched}`);
  console.log(`Papers Analyzed: ${metrics.totalPapersAnalyzed}`);
  console.log(`Hypotheses Generated: ${metrics.totalHypothesesGenerated}`);
  console.log('='.repeat(70) + '\n');
}

/**
 * Execute single research iteration with retry logic
 */
async function executeResearchIteration(retryCount: number = 0): Promise<boolean> {
  const maxRetries = 3;
  const startTime = Date.now();

  try {
    Logger.info(`Starting research iteration ${metrics.iterations + 1}...`);

    // Run the agent
    // heartbeatSeconds: how often the agent checks for new tasks (30 seconds)
    await scienceAgent.run(30);

    const elapsedTime = Date.now() - startTime;
    updateMetrics(elapsedTime, true);

    // Update totals from agent state
    const state = await getAgentState();
    metrics.totalPapersAnalyzed = state.papers_analyzed;
    metrics.totalHypothesesGenerated = state.hypotheses_generated;

    Logger.info(`Research iteration completed successfully in ${elapsedTime}ms`);
    return true;
  } catch (error: any) {
    const elapsedTime = Date.now() - startTime;

    Logger.error(`Research iteration failed: ${error.message}`, {
      error: error.message,
      stack: error.stack,
      iteration: metrics.iterations + 1,
      retryCount
    });

    // Retry logic with exponential backoff
    if (retryCount < maxRetries) {
      const backoffMs = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      Logger.info(`Retrying in ${backoffMs / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      return executeResearchIteration(retryCount + 1);
    } else {
      updateMetrics(elapsedTime, false);
      Logger.error(`Research iteration failed after ${maxRetries} retries`);
      return false;
    }
  }
}

/**
 * Main function with continuous operation support
 */
async function main(config: OperationConfig = { mode: 'single' }) {
  console.log('='.repeat(70));
  console.log('🔬 ScienceDAO Autonomous Research Agent');
  console.log('='.repeat(70));
  console.log(`Mode: ${config.mode.toUpperCase()}`);
  if (config.mode === 'continuous' && config.intervalMinutes) {
    console.log(`Interval: ${config.intervalMinutes} minutes`);
  }
  if (config.maxIterations) {
    console.log(`Max Iterations: ${config.maxIterations}`);
  }
  console.log('='.repeat(70));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  // Perform health check
  if (config.enableHealthChecks !== false) {
    console.log('Running health check...');
    const healthStatus = await performHealthCheck();

    if (healthStatus.errors.length > 0) {
      console.log('⚠️  Health check warnings:');
      healthStatus.errors.forEach(error => console.log(`  - ${error}`));
      console.log();
    } else {
      console.log('✓ All services healthy\n');
    }

    if (!healthStatus.openai || !healthStatus.arxiv) {
      Logger.error('Critical services unavailable. Cannot start agent.');
      process.exit(1);
    }
  }

  // Display initial state
  const initialState = await getAgentState();
  console.log('Initial Agent State:');
  console.log(JSON.stringify(initialState, null, 2));
  console.log();

  try {
    Logger.info('Starting ScienceDAO Research Agent');
    Logger.info('Initializing agent and workers...');

    // Initialize the agent
    await scienceAgent.init();

    Logger.info('✓ Agent initialized successfully!');
    Logger.info('Starting research activities...');
    console.log();

    // Operation loop
    let iteration = 0;
    const maxIterations = config.maxIterations || Infinity;

    while (!isShuttingDown && iteration < maxIterations) {
      iteration++;

      // Execute research iteration
      const success = await executeResearchIteration();

      if (!success && config.mode === 'single') {
        Logger.error('Single iteration failed. Exiting.');
        process.exit(1);
      }

      // Display current metrics
      if (config.mode !== 'single') {
        displayMetrics();
      }

      // Break if single mode
      if (config.mode === 'single') {
        Logger.info('Single iteration completed successfully');
        break;
      }

      // Wait before next iteration (continuous mode)
      if (config.mode === 'continuous' && !isShuttingDown && iteration < maxIterations) {
        const waitMinutes = config.intervalMinutes || 10;
        const waitMs = waitMinutes * 60 * 1000;

        Logger.info(`Waiting ${waitMinutes} minutes before next iteration...`);
        Logger.info(`Press Ctrl+C to stop the agent gracefully`);

        // Wait with ability to break on shutdown
        const startWait = Date.now();
        while (Date.now() - startWait < waitMs && !isShuttingDown) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log();
      }
    }

    if (!isShuttingDown) {
      Logger.info('Agent completed all iterations');
      displayMetrics();
    }
  } catch (error: any) {
    Logger.error('Agent execution failed', {
      error: error.message,
      stack: error.stack
    });
    console.error('\n❌ Error:', error.message);
    displayMetrics();
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
  if (isShuttingDown) {
    console.log('\nForce shutdown...');
    process.exit(1);
  }

  isShuttingDown = true;

  console.log('\n\n' + '='.repeat(70));
  console.log('🛑 Shutting down agent gracefully...');
  console.log('Press Ctrl+C again to force quit');
  console.log('='.repeat(70));

  Logger.info('Agent shutdown requested');

  // Display final state
  getAgentState()
    .then(finalState => {
      console.log('\nFinal Agent State:');
      console.log(JSON.stringify(finalState, null, 2));
      console.log();

      // Display final metrics
      displayMetrics();

      // Display activity statistics
      const stats = Logger.getStats();
      console.log('Activity Statistics:');
      Object.entries(stats).forEach(([type, count]) => {
        if (count > 0) {
          console.log(`  ${type}: ${count}`);
        }
      });
      console.log();
      console.log(`Full logs saved to: ${Config.RESEARCH_LOG_FILE}`);
      console.log();

      process.exit(0);
    })
    .catch(error => {
      Logger.error('Error during shutdown', error);
      process.exit(1);
    });
});

// Parse command line arguments for operation mode
const args = process.argv.slice(2);
const operationConfig: OperationConfig = {
  mode: 'single',
  enableHealthChecks: true
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--continuous' || arg === '-c') {
    operationConfig.mode = 'continuous';
    const nextArg = args[i + 1];
    if (nextArg && !nextArg.startsWith('-')) {
      operationConfig.intervalMinutes = parseInt(nextArg, 10);
      i++;
    } else {
      operationConfig.intervalMinutes = 10; // default 10 minutes
    }
  } else if (arg === '--test' || arg === '-t') {
    operationConfig.mode = 'test';
  } else if (arg === '--max-iterations' || arg === '-m') {
    const nextArg = args[i + 1];
    if (nextArg) {
      operationConfig.maxIterations = parseInt(nextArg, 10);
      i++;
    }
  } else if (arg === '--no-health-check') {
    operationConfig.enableHealthChecks = false;
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
ScienceDAO Autonomous Research Agent

Usage: npm start [options]

Options:
  --continuous, -c [minutes]  Run continuously with interval (default: 10 minutes)
  --test, -t                  Run in test mode
  --max-iterations, -m <n>    Maximum number of iterations
  --no-health-check           Skip health checks on startup
  --help, -h                  Show this help message

Examples:
  npm start                   # Single iteration
  npm start --continuous      # Continuous with 10 min interval
  npm start -c 5              # Continuous with 5 min interval
  npm start -m 3              # Run 3 iterations and stop
    `);
    process.exit(0);
  }
}

// Run the agent
main(operationConfig);

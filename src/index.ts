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
 */

import { scienceAgent, getAgentState } from './agents/scienceAgent';
import { Config } from './utils/config';
import { Logger } from './utils/logger';

/**
 * Main function to run the research agent
 */
async function main() {
  console.log('='.repeat(70));
  console.log('🔬 ScienceDAO Autonomous Research Agent');
  console.log('='.repeat(70));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

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

    Logger.info('Agent initialized successfully!');
    Logger.info('Starting research activities...');

    // Run the agent
    // The agent will process tasks autonomously based on its goal and workers
    await scienceAgent.run();

    Logger.info('Agent completed execution');
  } catch (error: any) {
    Logger.error('Agent execution failed', {
      error: error.message,
      stack: error.stack
    });
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n' + '='.repeat(70));
  console.log('🛑 Shutting down agent gracefully...');
  console.log('='.repeat(70));

  Logger.info('Agent shutdown requested');

  // Display final state
  getAgentState().then(finalState => {
    console.log('\nFinal Agent State:');
    console.log(JSON.stringify(finalState, null, 2));
    console.log();

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
  });
});

// Run the agent
main();

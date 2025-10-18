#!/usr/bin/env ts-node

/**
 * ScienceDAO Full Workflow Demo
 *
 * This script demonstrates the COMPLETE autonomous research workflow:
 * 1. Fetch real papers from arXiv
 * 2. Analyze papers with GPT-4
 * 3. Generate hypothesis from research gaps
 * 4. Peer review via ACP (GPT-4 evaluation)
 * 5. Find datasets via ACP
 * 6. Write everything to research_log.json
 *
 * This is NOT a simulation - it's the full multi-agent system in action!
 * Expected runtime: 2-5 minutes (multiple real API calls)
 */

import { fetchPapersWithRateLimit } from '../src/functions/fetchPapers';
import { analyzePaperFunction } from '../src/functions/analyzePaper';
import { generateHypothesisFunction } from '../src/functions/generateHypothesis';
import { coordinateHypothesisWorkflow } from '../src/agents/scienceAgent';
import { Logger } from '../src/utils/logger';
import { Config } from '../src/utils/config';
import dotenv from 'dotenv';
import { ExecutableGameFunctionStatus } from '@virtuals-protocol/game';

// Load environment variables
dotenv.config();

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
  console.clear();
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                               ║', 'cyan');
  log('║       🔬 ScienceDAO FULL AUTONOMOUS WORKFLOW DEMO 🔬         ║', 'bright');
  log('║                                                               ║', 'cyan');
  log('║    Papers → Analysis → Hypothesis → Review → Datasets        ║', 'cyan');
  log('║                                                               ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════╝', 'cyan');
  log('', 'reset');
  log('⚡ This demo runs the COMPLETE research pipeline with real AI!', 'yellow');
  log('⏱️  Expected runtime: 2-5 minutes (multiple API calls)', 'dim');
  log('', 'reset');
}

async function main() {
  try {
    banner();

    const researchTopic = Config.DEFAULT_RESEARCH_FIELD || 'longevity';
    const maxPapers = 3; // Fetch 3 papers for demo

    log('═'.repeat(65), 'blue');
    log('🎯 RESEARCH CONFIGURATION', 'bright');
    log('═'.repeat(65), 'blue');
    log(`  Topic: ${researchTopic}`, 'cyan');
    log(`  Papers to fetch: ${maxPapers}`, 'cyan');
    log(`  AI Model: GPT-4`, 'cyan');
    log('', 'reset');

    // STEP 1: FETCH PAPERS
    log('═'.repeat(65), 'blue');
    log('📚 STEP 1: FETCHING PAPERS FROM ARXIV', 'bright');
    log('═'.repeat(65), 'blue');
    log('', 'reset');
    log('🔍 Searching arXiv database...', 'yellow');

    const startFetch = Date.now();
    const fetchResult = await fetchPapersWithRateLimit(researchTopic, maxPapers);
    const fetchTime = ((Date.now() - startFetch) / 1000).toFixed(1);

    log(`✅ Fetched ${fetchResult.count} papers in ${fetchTime}s`, 'green');
    log('', 'reset');

    fetchResult.papers.forEach((paper, i) => {
      log(`  ${i + 1}. ${paper.title}`, 'cyan');
      log(`     Authors: ${paper.authors.substring(0, 80)}...`, 'dim');
      log('', 'reset');
    });

    // STEP 2: ANALYZE PAPERS
    log('═'.repeat(65), 'blue');
    log('🔬 STEP 2: ANALYZING PAPERS WITH GPT-4', 'bright');
    log('═'.repeat(65), 'blue');
    log('', 'reset');

    const analyses: any[] = [];
    let totalGaps = 0;

    for (let i = 0; i < fetchResult.papers.length; i++) {
      const paper = fetchResult.papers[i];
      log(`📄 Analyzing paper ${i + 1}/${fetchResult.papers.length}...`, 'yellow');
      log(`   "${paper.title.substring(0, 60)}..."`, 'dim');

      const startAnalysis = Date.now();
      const analysisResponse = await analyzePaperFunction.executable(
        {
          paper_title: paper.title,
          paper_summary: paper.summary
        },
        () => {} // Silent logger
      );
      const analysisTime = ((Date.now() - startAnalysis) / 1000).toFixed(1);

      if (analysisResponse.status === ExecutableGameFunctionStatus.Done) {
        const analysis = JSON.parse(analysisResponse.feedback);
        analyses.push(analysis);
        const gaps = analysis.gaps || analysis.research_gaps || [];
        totalGaps += gaps.length;
        log(`   ✅ Analyzed in ${analysisTime}s - Found ${gaps.length} gaps`, 'green');
      } else {
        log(`   ❌ Analysis failed: ${analysisResponse.feedback}`, 'red');
      }
      log('', 'reset');
    }

    log(`📊 Analysis complete: ${totalGaps} research gaps identified total`, 'cyan');
    log('', 'reset');

    // Show some gaps
    if (analyses.length > 0) {
      const sampleGaps = analyses[0].gaps || analyses[0].research_gaps || [];
      if (sampleGaps.length > 0) {
        log('💡 Sample research gaps identified:', 'magenta');
        sampleGaps.slice(0, 2).forEach((gap: string, i: number) => {
          log(`   ${i + 1}. ${gap}`, 'dim');
        });
        log('', 'reset');
      }
    }

    // STEP 3: GENERATE HYPOTHESIS
    log('═'.repeat(65), 'blue');
    log('💡 STEP 3: GENERATING NOVEL HYPOTHESIS', 'bright');
    log('═'.repeat(65), 'blue');
    log('', 'reset');
    log('🧠 Synthesizing findings across all papers...', 'yellow');

    const startHypothesis = Date.now();
    const hypothesisResponse = await generateHypothesisFunction.executable(
      {
        field: researchTopic,
        research_gaps: JSON.stringify(
          analyses.flatMap(a => a.gaps || a.research_gaps || []).slice(0, 5)
        )
      },
      () => {} // Silent logger
    );
    const hypothesisTime = ((Date.now() - startHypothesis) / 1000).toFixed(1);

    if (hypothesisResponse.status !== ExecutableGameFunctionStatus.Done) {
      throw new Error(`Hypothesis generation failed: ${hypothesisResponse.feedback}`);
    }

    const hypothesisData = JSON.parse(hypothesisResponse.feedback);
    log(`✅ Generated ${hypothesisData.hypotheses.length} hypotheses in ${hypothesisTime}s`, 'green');
    log('', 'reset');

    // Use the first (best) hypothesis
    const selectedHypothesis = hypothesisData.hypotheses[0];

    // Log the complete hypothesis to research_log.json for the dashboard
    Logger.hypothesisGeneration('Generated top hypothesis for workflow', {
      hypothesis_id: `demo_${Date.now()}`,
      hypothesis: selectedHypothesis.hypothesis,
      methodology: selectedHypothesis.methodology,
      rationale: selectedHypothesis.rationale,
      expected_impact: selectedHypothesis.expected_impact,
      field: researchTopic,
      novelty_score: selectedHypothesis.novelty_score,
      feasibility_score: selectedHypothesis.feasibility_score,
      impact_score: selectedHypothesis.impact_score,
      rigor_score: selectedHypothesis.rigor_score,
      overall_score: selectedHypothesis.overall_score
    });

    log('📝 Generated Hypothesis (Top Scored):', 'bright');
    log(`   "${selectedHypothesis.hypothesis}"`, 'cyan');
    log('', 'reset');
    log('🔬 Proposed Methodology:', 'bright');
    log(`   ${selectedHypothesis.methodology.substring(0, 200)}...`, 'dim');
    log('', 'reset');

    // STEP 4 & 5: MULTI-AGENT WORKFLOW (Peer Review + Datasets)
    log('═'.repeat(65), 'blue');
    log('🤖 STEP 4 & 5: MULTI-AGENT COORDINATION VIA ACP', 'bright');
    log('═'.repeat(65), 'blue');
    log('', 'reset');

    log('👨‍🔬 Sending to Peer Review Agent...', 'yellow');
    log('   → Evaluating: Novelty, Feasibility, Impact, Rigor', 'dim');
    log('', 'reset');

    log('📚 Sending to Data Curator Agent...', 'yellow');
    log('   → Searching: Kaggle, UCI ML, PubMed Central', 'dim');
    log('', 'reset');

    log('⏳ Multi-agent workflow in progress (30-60 seconds)...', 'yellow');
    log('', 'reset');

    const startWorkflow = Date.now();
    const result = await coordinateHypothesisWorkflow(
      `demo_${Date.now()}`,
      selectedHypothesis.hypothesis,
      selectedHypothesis.methodology,
      researchTopic
    );
    const workflowTime = ((Date.now() - startWorkflow) / 1000).toFixed(1);

    log(`✅ Multi-agent workflow completed in ${workflowTime}s`, 'green');
    log('', 'reset');

    // DISPLAY RESULTS
    log('═'.repeat(65), 'blue');
    log('📊 PEER REVIEW RESULTS', 'bright');
    log('═'.repeat(65), 'blue');
    log('', 'reset');

    log(`   Overall Score: ${colors.cyan}${result.peer_review.overall_score.toFixed(1)}/10${colors.reset}`, 'reset');
    log(`   Novelty:       ${colors.cyan}${result.peer_review.novelty_score.toFixed(1)}/10${colors.reset}`, 'reset');
    log(`   Feasibility:   ${colors.cyan}${result.peer_review.feasibility_score.toFixed(1)}/10${colors.reset}`, 'reset');
    log(`   Impact:        ${colors.cyan}${result.peer_review.impact_score.toFixed(1)}/10${colors.reset}`, 'reset');
    log(`   Rigor:         ${colors.cyan}${result.peer_review.rigor_score.toFixed(1)}/10${colors.reset}`, 'reset');
    log('', 'reset');
    log(`   Status: ${result.approved ? colors.green + '✅ APPROVED' + colors.reset : colors.red + '❌ REJECTED' + colors.reset}`, 'reset');
    log('', 'reset');

    if (result.peer_review.strengths.length > 0) {
      log('💪 Strengths:', 'green');
      result.peer_review.strengths.slice(0, 2).forEach((s: string) => {
        log(`   • ${s}`, 'dim');
      });
      log('', 'reset');
    }

    if (result.datasets && result.datasets.length > 0) {
      log('═'.repeat(65), 'blue');
      log('📚 DATASETS FOUND', 'bright');
      log('═'.repeat(65), 'blue');
      log('', 'reset');
      log(`   Found ${result.datasets.length} relevant datasets:`, 'cyan');
      result.datasets.forEach((dataset: any, i: number) => {
        log(`   ${i + 1}. ${dataset.name} (${dataset.source})`, 'dim');
      });
      log('', 'reset');
    }

    // FINAL SUMMARY
    const totalTime = ((Date.now() - startFetch) / 1000).toFixed(0);
    const minutes = Math.floor(Number(totalTime) / 60);
    const seconds = Number(totalTime) % 60;

    log('╔═══════════════════════════════════════════════════════════════╗', 'green');
    log('║                                                               ║', 'green');
    log('║                ✅ FULL WORKFLOW COMPLETE! ✅                  ║', 'bright');
    log('║                                                               ║', 'green');
    log('╚═══════════════════════════════════════════════════════════════╝', 'green');
    log('', 'reset');

    log('📊 Workflow Summary:', 'bright');
    log(`   ⏱️  Total runtime: ${minutes}m ${seconds}s`, 'cyan');
    log(`   📄 Papers fetched: ${fetchResult.count}`, 'cyan');
    log(`   🔬 Papers analyzed: ${analyses.length}`, 'cyan');
    log(`   🎯 Research gaps found: ${totalGaps}`, 'cyan');
    log(`   💡 Hypotheses generated: 1`, 'cyan');
    log(`   👨‍🔬 Peer review score: ${result.peer_review.overall_score.toFixed(1)}/10`, 'cyan');
    log(`   📚 Datasets found: ${result.datasets?.length || 0}`, 'cyan');
    log(`   ✅ Approved: ${result.approved ? 'YES' : 'NO'}`, result.approved ? 'green' : 'red');
    log(`   💰 Proposal created: ${result.ready_for_proposal ? 'YES' : 'NO'}`, result.ready_for_proposal ? 'green' : 'red');
    log('', 'reset');

    log('🌐 Next Steps:', 'bright');
    log(`   1. Check research_log.json for all results`, 'reset');
    log(`   2. Visit dashboard: ${colors.cyan}http://localhost:5173${colors.reset}`, 'reset');
    log(`   3. See real hypothesis with peer review scores`, 'reset');
    log(`   4. Fund hypothesis with 0.0001 ETH via Privy`, 'reset');
    log('', 'reset');

    log('💡 What Just Happened:', 'bright');
    log('   ✓ Real papers fetched from arXiv', 'green');
    log('   ✓ GPT-4 analyzed all papers scientifically', 'green');
    log('   ✓ Novel hypothesis generated from gaps', 'green');
    log('   ✓ Multi-agent peer review via ACP', 'green');
    log('   ✓ Real dataset searches performed', 'green');
    if (result.ready_for_proposal) {
      log('   ✓ Proposal created on Base blockchain', 'green');
    }
    log('   ✓ All data logged to research_log.json', 'green');
    log('', 'reset');

    log('═'.repeat(65), 'blue');
    log('Full autonomous workflow completed successfully! 🚀', 'green');
    log('═'.repeat(65), 'blue');
    log('', 'reset');

  } catch (error: any) {
    log('\n❌ Error running demo:', 'red');
    console.error(error);
    log('\n💡 Troubleshooting:', 'yellow');
    log('   1. Ensure OPENAI_API_KEY is set in .env', 'reset');
    log('   2. Ensure GAME_API_KEY is set in .env', 'reset');
    log('   3. Check internet connection for API calls', 'reset');
    log('   4. arXiv may be rate-limited - try again in a minute', 'reset');
    log('', 'reset');
    process.exit(1);
  }
}

// Run the demo
main();

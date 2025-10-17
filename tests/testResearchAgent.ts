/**
 * Test script for complete research agent
 * Tests the full workflow: fetch → analyze → generate hypotheses
 */

import { fetchPapersWithRateLimit } from '../src/functions/fetchPapers';
import { batchAnalyzePapers } from '../src/functions/analyzePaper';
import { generateHypotheses } from '../src/functions/generateHypothesis';
import { Config } from '../src/utils/config';
import { Logger } from '../src/utils/logger';

async function testResearchAgent() {
  console.log('='.repeat(70));
  console.log('Testing Complete Research Agent Workflow');
  console.log('='.repeat(70));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  const researchField = 'longevity';

  try {
    // Step 1: Fetch Papers
    console.log(`Step 1: Fetching papers on "${researchField}"...`);
    console.log('-'.repeat(70));
    const fetchResult = await fetchPapersWithRateLimit(researchField, 3);
    console.log(`✓ Fetched ${fetchResult.count} papers`);
    console.log();

    // Display fetched papers
    console.log('Fetched Papers:');
    fetchResult.papers.forEach((paper, index) => {
      console.log(`  ${index + 1}. ${paper.title}`);
      console.log(`     Authors: ${paper.authors}`);
      console.log(`     Published: ${paper.published}`);
    });
    console.log();

    // Step 2: Analyze Papers
    console.log('Step 2: Analyzing papers for findings and gaps...');
    console.log('-'.repeat(70));

    const papersToAnalyze = fetchResult.papers.map(p => ({
      title: p.title,
      summary: p.summary
    }));

    const analyses = await batchAnalyzePapers(papersToAnalyze, 2000);
    console.log(`✓ Analyzed ${analyses.length} papers`);
    console.log();

    // Display analyses
    analyses.forEach((analysis, index) => {
      const paper = fetchResult.papers[index];
      console.log(`Analysis ${index + 1}: ${paper.title.substring(0, 60)}...`);
      console.log('-'.repeat(70));

      console.log('Key Findings:');
      analysis.findings.slice(0, 2).forEach((finding, idx) => {
        console.log(`  ${idx + 1}. ${finding}`);
      });

      console.log();
      console.log('Research Gaps:');
      analysis.gaps.slice(0, 2).forEach((gap, idx) => {
        console.log(`  ${idx + 1}. ${gap}`);
      });
      console.log();
    });

    // Step 3: Aggregate Research Gaps
    console.log('Step 3: Aggregating research gaps...');
    console.log('-'.repeat(70));

    const allGaps: string[] = [];
    analyses.forEach(analysis => {
      allGaps.push(...analysis.gaps);
    });

    console.log(`✓ Identified ${allGaps.length} total research gaps`);
    console.log();

    // Create a summary of gaps
    const gapsSummary = `Research Gaps Identified from ${fetchResult.count} papers on ${researchField}:

${allGaps.map((gap, idx) => `${idx + 1}. ${gap}`).join('\n')}`;

    console.log('Gap Summary:');
    console.log(gapsSummary);
    console.log();

    // Step 4: Generate Hypotheses
    console.log('Step 4: Generating novel hypotheses...');
    console.log('-'.repeat(70));

    const hypothesisResult = await generateHypotheses(gapsSummary, researchField);
    console.log(`✓ Generated ${hypothesisResult.hypotheses.length} hypotheses`);
    console.log();

    // Display hypotheses
    hypothesisResult.hypotheses.forEach((hyp, index) => {
      console.log(`Hypothesis ${index + 1}:`);
      console.log(`  ${hyp.hypothesis}`);
      console.log();
      console.log(`  Rationale: ${hyp.rationale.substring(0, 200)}...`);
      console.log();
      console.log(`  Scores: Novelty=${hyp.novelty_score}, Feasibility=${hyp.feasibility_score}, Impact=${hyp.impact_score}, Overall=${hyp.overall_score.toFixed(1)}`);
      console.log();
    });

    // Step 5: Summary
    console.log('='.repeat(70));
    console.log('Research Agent Workflow Summary');
    console.log('='.repeat(70));
    console.log(`Research Field: ${researchField}`);
    console.log(`Papers Fetched: ${fetchResult.count}`);
    console.log(`Papers Analyzed: ${analyses.length}`);
    console.log(`Research Gaps Identified: ${allGaps.length}`);
    console.log(`Hypotheses Generated: ${hypothesisResult.hypotheses.length}`);
    console.log();

    // Best hypothesis
    const sortedHyps = [...hypothesisResult.hypotheses].sort(
      (a, b) => b.overall_score - a.overall_score
    );
    console.log('Top Hypothesis (by score):');
    console.log(`  ${sortedHyps[0].hypothesis}`);
    console.log(`  Overall Score: ${sortedHyps[0].overall_score.toFixed(1)}/10`);
    console.log();

    // Display log statistics
    console.log('='.repeat(70));
    console.log('Activity Statistics');
    console.log('='.repeat(70));
    const stats = Logger.getStats();
    Object.entries(stats).forEach(([type, count]) => {
      if (count > 0) {
        console.log(`  ${type}: ${count}`);
      }
    });
    console.log();
    console.log(`Full logs saved to: ${Config.RESEARCH_LOG_FILE}`);
    console.log();

    console.log('✓ Complete research workflow executed successfully!');
  } catch (error: any) {
    console.error('✗ Research agent test failed:', error.message);
    throw error;
  }
}

// Run test
testResearchAgent()
  .then(() => {
    console.log();
    console.log('='.repeat(70));
    console.log('Research agent test completed successfully! 🎉');
    console.log('='.repeat(70));
    process.exit(0);
  })
  .catch((error) => {
    console.error();
    console.error('='.repeat(70));
    console.error('Research agent test failed. Check the error above.');
    console.error('='.repeat(70));
    process.exit(1);
  });

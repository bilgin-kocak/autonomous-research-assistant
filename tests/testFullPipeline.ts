/**
 * Test script for full research pipeline
 * Tests fetching papers and analyzing them together
 */

import { fetchPapersWithRateLimit } from '../src/functions/fetchPapers';
import { batchAnalyzePapers } from '../src/functions/analyzePaper';
import { Config } from '../src/utils/config';
import { Logger } from '../src/utils/logger';

async function testFullPipeline() {
  console.log('='.repeat(60));
  console.log('Testing Full Research Pipeline');
  console.log('='.repeat(60));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  try {
    // Step 1: Fetch papers
    console.log('Step 1: Fetching papers on "longevity"...');
    console.log('-'.repeat(60));
    const fetchResult = await fetchPapersWithRateLimit('longevity', 3);
    console.log(`✓ Fetched ${fetchResult.count} papers`);
    console.log();

    // Display fetched papers
    console.log('Fetched Papers:');
    fetchResult.papers.forEach((paper, index) => {
      console.log(`  ${index + 1}. ${paper.title}`);
    });
    console.log();

    // Step 2: Analyze papers
    console.log('Step 2: Analyzing papers...');
    console.log('-'.repeat(60));

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
      console.log(`Analysis ${index + 1}: ${paper.title}`);
      console.log('-'.repeat(60));

      console.log('Key Findings:');
      analysis.findings.forEach((finding, idx) => {
        console.log(`  ${idx + 1}. ${finding}`);
      });

      console.log();
      console.log('Research Gaps:');
      analysis.gaps.forEach((gap, idx) => {
        console.log(`  ${idx + 1}. ${gap}`);
      });

      console.log();
      console.log('Next Steps:');
      analysis.next_steps.forEach((step, idx) => {
        console.log(`  ${idx + 1}. ${step}`);
      });
      console.log();
      console.log();
    });

    // Step 3: Aggregate research gaps
    console.log('Step 3: Aggregating research gaps...');
    console.log('-'.repeat(60));

    const allGaps: string[] = [];
    analyses.forEach(analysis => {
      allGaps.push(...analysis.gaps);
    });

    console.log(`✓ Identified ${allGaps.length} total research gaps across all papers`);
    console.log();

    console.log('All Research Gaps:');
    allGaps.forEach((gap, index) => {
      console.log(`  ${index + 1}. ${gap}`);
    });
    console.log();

    // Display log statistics
    console.log('='.repeat(60));
    console.log('Pipeline Summary');
    console.log('='.repeat(60));
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

    console.log('✓ Full pipeline test completed successfully!');
  } catch (error: any) {
    console.error('✗ Pipeline test failed:', error.message);
    throw error;
  }
}

// Run test
testFullPipeline()
  .then(() => {
    console.log();
    console.log('='.repeat(60));
    console.log('All tests passed! The research pipeline is working correctly.');
    console.log('='.repeat(60));
    process.exit(0);
  })
  .catch((error) => {
    console.error();
    console.error('='.repeat(60));
    console.error('Pipeline test failed. Check the error above.');
    console.error('='.repeat(60));
    process.exit(1);
  });

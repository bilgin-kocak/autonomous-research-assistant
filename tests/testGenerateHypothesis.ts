/**
 * Test script for generateHypothesis function
 * Tests hypothesis generation with sample research gaps
 */

import { generateHypotheses, rankHypotheses, filterHypothesesByScore } from '../src/functions/generateHypothesis';
import { Config } from '../src/utils/config';
import { Logger } from '../src/utils/logger';

// Sample research gaps for testing
const sampleGaps = [
  {
    field: 'longevity',
    gaps: `Based on analysis of recent longevity research papers, the following gaps have been identified:

1. Limited understanding of the molecular mechanisms linking cellular senescence to systemic aging processes
2. Lack of human clinical trials for senolytics, with most evidence from animal models
3. Insufficient data on the long-term effects of NAD+ precursor supplementation in humans
4. No comprehensive studies on the interaction between multiple anti-aging interventions (combination therapies)
5. Limited research on sex-specific differences in aging interventions
6. Inadequate understanding of how lifestyle factors (diet, exercise, stress) interact with pharmacological interventions
7. Need for better biomarkers to measure biological age and intervention effectiveness`
  },
  {
    field: 'aging',
    gaps: `Research gaps in cellular aging mechanisms:

1. The role of mitochondrial dysfunction in age-related neurodegenerative diseases remains poorly understood
2. Limited knowledge about epigenetic clocks and their causal relationship with aging
3. Insufficient research on the gut microbiome's influence on systemic aging
4. Need for better understanding of inflammaging (chronic inflammation in aging) mechanisms
5. Lack of research on reversibility of age-related cellular damage`
  }
];

async function testGenerateHypothesis() {
  console.log('='.repeat(70));
  console.log('Testing Hypothesis Generation Function');
  console.log('='.repeat(70));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  for (let i = 0; i < sampleGaps.length; i++) {
    const sample = sampleGaps[i];

    console.log(`Test ${i + 1}: Generating hypotheses for "${sample.field}"...`);
    console.log('-'.repeat(70));

    try {
      const result = await generateHypotheses(sample.gaps, sample.field);

      console.log(`✓ Successfully generated ${result.hypotheses.length} hypotheses`);
      console.log();

      // Display each hypothesis
      result.hypotheses.forEach((hyp, idx) => {
        console.log(`Hypothesis ${idx + 1}:`);
        console.log(`  Statement: ${hyp.hypothesis}`);
        console.log(`  Rationale: ${hyp.rationale.substring(0, 150)}...`);
        console.log(`  Methodology: ${hyp.methodology.substring(0, 150)}...`);
        console.log(`  Expected Impact: ${hyp.expected_impact.substring(0, 150)}...`);
        console.log();
        console.log('  Scores:');
        console.log(`    - Novelty: ${hyp.novelty_score}/10`);
        console.log(`    - Feasibility: ${hyp.feasibility_score}/10`);
        console.log(`    - Impact: ${hyp.impact_score}/10`);
        console.log(`    - Rigor: ${hyp.rigor_score}/10`);
        console.log(`    - Overall: ${hyp.overall_score.toFixed(1)}/10`);
        console.log();
      });

      // Test ranking
      console.log('Testing ranking functionality...');
      const ranked = rankHypotheses(result.hypotheses);
      console.log(`✓ Hypotheses ranked by score:`);
      ranked.forEach((hyp, idx) => {
        console.log(`  ${idx + 1}. ${hyp.hypothesis.substring(0, 80)}... (Score: ${hyp.overall_score.toFixed(1)})`);
      });
      console.log();

      // Test filtering
      console.log('Testing filtering functionality (min score: 7.0)...');
      const filtered = filterHypothesesByScore(result.hypotheses, 7.0);
      console.log(`✓ ${filtered.length} hypotheses meet the threshold`);
      console.log();

      // Wait before next test
      if (i < sampleGaps.length - 1) {
        console.log('Waiting 3 seconds before next test...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log();
      }
    } catch (error: any) {
      console.error(`✗ Test ${i + 1} failed:`, error.message);
      console.log();
    }
  }

  // Display log statistics
  console.log('='.repeat(70));
  console.log('Test Summary');
  console.log('='.repeat(70));
  const stats = Logger.getStats();
  console.log('Activity Statistics:');
  Object.entries(stats).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`  ${type}: ${count}`);
    }
  });
  console.log();
  console.log(`Logs saved to: ${Config.RESEARCH_LOG_FILE}`);
  console.log();
}

// Run tests
testGenerateHypothesis()
  .then(() => {
    console.log('✓ All hypothesis generation tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Test execution failed:', error);
    process.exit(1);
  });

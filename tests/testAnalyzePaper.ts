/**
 * Test script for analyzePaper function
 * Tests paper analysis using OpenAI GPT-4
 */

import { analyzePaper } from '../src/functions/analyzePaper';
import { Config } from '../src/utils/config';
import { Logger } from '../src/utils/logger';

// Sample papers for testing
const samplePapers = [
  {
    title: 'Deep Learning Approaches to Predict Cellular Senescence',
    summary: `Cellular senescence plays a crucial role in aging and age-related diseases.
    Recent advances in machine learning have opened new possibilities for predicting senescence markers.
    This study presents a novel deep learning approach using convolutional neural networks to analyze
    cellular morphology and predict senescence states. We trained our model on a dataset of 10,000
    cell images and achieved 95% accuracy. Our findings suggest that morphological features alone can
    reliably predict senescence, offering a non-invasive alternative to traditional molecular markers.
    However, the model's performance on different cell types and the underlying biological mechanisms
    remain to be fully understood.`
  },
  {
    title: 'Metformin and Longevity: A Systematic Review',
    summary: `Metformin, a widely prescribed anti-diabetic drug, has shown promise as a potential
    longevity-promoting intervention. This systematic review examines 45 studies investigating
    metformin's effects on lifespan and healthspan in various model organisms and humans. We found
    consistent evidence of lifespan extension in C. elegans and some rodent models, with effects
    ranging from 5-15% increase. Human observational studies suggest reduced mortality in diabetic
    patients taking metformin. The mechanisms appear to involve AMPK activation, improved mitochondrial
    function, and reduced inflammation. Despite promising results, questions remain about optimal dosing,
    effects in non-diabetic populations, and long-term safety in aging individuals.`
  }
];

async function testAnalyzePaper() {
  console.log('='.repeat(60));
  console.log('Testing Paper Analysis Function');
  console.log('='.repeat(60));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  for (let i = 0; i < samplePapers.length; i++) {
    const paper = samplePapers[i];

    console.log(`Test ${i + 1}: Analyzing paper "${paper.title}"...`);
    console.log('-'.repeat(60));

    try {
      const analysis = await analyzePaper(paper.title, paper.summary);

      console.log('✓ Analysis successful!');
      console.log();

      console.log('Key Findings:');
      analysis.findings.forEach((finding, idx) => {
        console.log(`  ${idx + 1}. ${finding}`);
      });
      console.log();

      console.log('Methodology:');
      console.log(`  ${analysis.methodology}`);
      console.log();

      console.log('Research Gaps:');
      analysis.gaps.forEach((gap, idx) => {
        console.log(`  ${idx + 1}. ${gap}`);
      });
      console.log();

      console.log('Potential Next Steps:');
      analysis.next_steps.forEach((step, idx) => {
        console.log(`  ${idx + 1}. ${step}`);
      });
      console.log();

      // Wait 2 seconds between tests to respect rate limits
      if (i < samplePapers.length - 1) {
        console.log('Waiting 2 seconds before next test...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log();
      }
    } catch (error: any) {
      console.error(`✗ Test ${i + 1} failed:`, error.message);
      console.log();
    }
  }

  // Display log statistics
  console.log('='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
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
testAnalyzePaper()
  .then(() => {
    console.log('✓ All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Test execution failed:', error);
    process.exit(1);
  });

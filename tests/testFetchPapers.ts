/**
 * Test script for fetchPapers function
 * Tests fetching papers from arXiv on different topics
 */

import { fetchPapersWithRateLimit } from '../src/functions/fetchPapers';
import { Config } from '../src/utils/config';
import { Logger } from '../src/utils/logger';

async function testFetchPapers() {
  console.log('='.repeat(60));
  console.log('Testing arXiv Paper Fetcher');
  console.log('='.repeat(60));
  console.log();

  // Display configuration
  console.log(Config.summary());
  console.log();

  // Test 1: Fetch papers on longevity
  console.log('Test 1: Fetching papers on "longevity"...');
  console.log('-'.repeat(60));
  try {
    const result1 = await fetchPapersWithRateLimit('longevity', 5);
    console.log(`✓ Successfully fetched ${result1.count} papers on "${result1.topic}"`);
    console.log();

    // Display first paper details
    if (result1.papers.length > 0) {
      const firstPaper = result1.papers[0];
      console.log('First Paper:');
      console.log(`  Title: ${firstPaper.title}`);
      console.log(`  Authors: ${firstPaper.authors}`);
      console.log(`  Published: ${firstPaper.published}`);
      console.log(`  Categories: ${firstPaper.categories}`);
      console.log(`  Link: ${firstPaper.link}`);
      console.log(`  Summary: ${firstPaper.summary.substring(0, 150)}...`);
      console.log();
    }
  } catch (error: any) {
    console.error('✗ Test 1 failed:', error.message);
  }

  // Test 2: Fetch papers on aging
  console.log('Test 2: Fetching papers on "aging"...');
  console.log('-'.repeat(60));
  try {
    const result2 = await fetchPapersWithRateLimit('aging', 3);
    console.log(`✓ Successfully fetched ${result2.count} papers on "${result2.topic}"`);
    console.log();

    // List all paper titles
    result2.papers.forEach((paper, index) => {
      console.log(`  ${index + 1}. ${paper.title}`);
    });
    console.log();
  } catch (error: any) {
    console.error('✗ Test 2 failed:', error.message);
  }

  // Test 3: Fetch papers on senescence
  console.log('Test 3: Fetching papers on "senescence"...');
  console.log('-'.repeat(60));
  try {
    const result3 = await fetchPapersWithRateLimit('senescence', 3);
    console.log(`✓ Successfully fetched ${result3.count} papers on "${result3.topic}"`);
    console.log();

    // List all paper titles
    result3.papers.forEach((paper, index) => {
      console.log(`  ${index + 1}. ${paper.title}`);
    });
    console.log();
  } catch (error: any) {
    console.error('✗ Test 3 failed:', error.message);
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
testFetchPapers()
  .then(() => {
    console.log('✓ All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Test execution failed:', error);
    process.exit(1);
  });

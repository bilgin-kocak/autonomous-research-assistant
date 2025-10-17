import { GameWorker } from '@virtuals-protocol/game';
import { fetchPapersFunction } from '../functions/fetchPapers';
import { analyzePaperFunction } from '../functions/analyzePaper';
import { generateHypothesisFunction } from '../functions/generateHypothesis';

/**
 * Research Worker
 *
 * Specializes in scientific research tasks including:
 * - Fetching papers from arXiv
 * - Analyzing literature for findings and gaps
 * - Generating novel hypotheses based on research gaps
 *
 * This worker coordinates all core research functions and provides
 * the agent with comprehensive research capabilities.
 */
export const researchWorker = new GameWorker({
  id: 'research_worker',
  name: 'Research Worker',
  description: `Specializes in scientific research tasks with expertise in three core areas:

1. Literature Acquisition: Fetches the latest scientific papers from arXiv database on any research topic. Can retrieve papers sorted by publication date, relevance, or other criteria. Supports multiple research fields including longevity, aging, neuroscience, climate science, and more.

2. Paper Analysis: Performs deep analysis of scientific papers to extract:
   - Key findings and discoveries
   - Methodologies used
   - Research gaps and unexplored areas
   - Potential next steps for investigation

3. Hypothesis Generation: Creates novel, testable research hypotheses based on identified gaps. Each hypothesis includes:
   - Clear, specific statement
   - Scientific rationale
   - Proposed methodology
   - Expected impact
   - Scores for novelty, feasibility, impact, and rigor

The Research Worker is rigorous, systematic, and focused on advancing scientific knowledge through careful analysis and innovative thinking.`,

  functions: [
    fetchPapersFunction,
    analyzePaperFunction,
    generateHypothesisFunction
  ],

  getEnvironment: async () => {
    return {
      current_date: new Date().toISOString(),
      current_time: new Date().toLocaleTimeString(),
      databases_available: ['arXiv', 'PubMed (coming soon)'],
      analysis_capabilities: [
        'gap_identification',
        'hypothesis_generation',
        'literature_review',
        'methodology_assessment',
        'impact_evaluation'
      ],
      ai_models_available: ['GPT-4 for analysis', 'GPT-4 for hypothesis generation'],
      research_fields_supported: [
        'longevity',
        'aging',
        'senescence',
        'neuroscience',
        'biology',
        'chemistry',
        'physics',
        'climate science',
        'medicine'
      ],
      max_papers_per_request: 50,
      rate_limits: {
        arxiv: '1 request per 3 seconds',
        openai: 'Standard API limits apply'
      }
    };
  }
});

/**
 * Export the worker for use in agents
 */
export default researchWorker;

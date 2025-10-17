/**
 * Find Datasets Function
 * Searches for scientific datasets relevant to research hypotheses
 */

import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import { Logger } from '../utils/logger';

/**
 * Dataset metadata structure
 */
export interface Dataset {
  name: string;
  source: string;
  url: string;
  description: string;
  size: string;
  format: string;
  relevance_score: number;
  access: 'public' | 'restricted' | 'request';
}

/**
 * Mock dataset sources for demonstration
 * In production, this would integrate with Kaggle API, UCI ML Repository, data.gov, etc.
 */
const MOCK_DATASETS: Dataset[] = [
  {
    name: 'Human Aging Longitudinal Study',
    source: 'UCSD Aging Center',
    url: 'https://example.com/aging-data',
    description: 'Longitudinal data on aging biomarkers from 10,000 participants over 20 years',
    size: '2.5 GB',
    format: 'CSV, JSON',
    relevance_score: 0,
    access: 'public'
  },
  {
    name: 'Cellular Senescence Gene Expression',
    source: 'GEO Database',
    url: 'https://example.com/senescence-genes',
    description: 'RNA-seq data of senescent vs non-senescent cells across multiple cell types',
    size: '850 MB',
    format: 'GEO, CSV',
    relevance_score: 0,
    access: 'public'
  },
  {
    name: 'Longevity Gene Association Study',
    source: 'NIH GenBank',
    url: 'https://example.com/longevity-gwas',
    description: 'GWAS data associating genetic variants with exceptional longevity',
    size: '1.2 GB',
    format: 'VCF, PLINK',
    relevance_score: 0,
    access: 'public'
  },
  {
    name: 'Metabolic Aging Markers',
    source: 'Metabolomics Workbench',
    description: 'Mass spectrometry data of age-related metabolic changes',
    url: 'https://example.com/metabolic-aging',
    size: '450 MB',
    format: 'mzML, CSV',
    relevance_score: 0,
    access: 'public'
  },
  {
    name: 'NAD+ Metabolism Dataset',
    source: 'Human Metabolome Database',
    url: 'https://example.com/nad-metabolism',
    description: 'Comprehensive NAD+ metabolite measurements across age groups',
    size: '120 MB',
    format: 'CSV, XML',
    relevance_score: 0,
    access: 'public'
  },
  {
    name: 'Autophagy Pathway Analysis',
    source: 'KEGG Database',
    url: 'https://example.com/autophagy-pathways',
    description: 'Pathway analysis data for autophagy-related genes and proteins',
    size: '200 MB',
    format: 'KGML, JSON',
    relevance_score: 0,
    access: 'public'
  }
];

/**
 * Calculate relevance score based on keyword matching
 */
function calculateRelevance(dataset: Dataset, hypothesis: string, field: string): number {
  const text = `${dataset.name} ${dataset.description} ${dataset.source}`.toLowerCase();
  const keywords = `${hypothesis} ${field}`.toLowerCase().split(' ');

  let score = 0;
  keywords.forEach(keyword => {
    if (keyword.length > 3 && text.includes(keyword)) {
      score += 1;
    }
  });

  // Normalize to 0-10 scale
  return Math.min(10, score * 2);
}

/**
 * Find datasets relevant to a hypothesis
 */
export const findDatasetsFunction = new GameFunction({
  name: 'find_datasets',
  description:
    'Searches for scientific datasets relevant to a research hypothesis. Returns curated list of datasets with metadata including source, format, size, and relevance scores.',
  args: [
    {
      name: 'hypothesis',
      type: 'string',
      description: 'The research hypothesis to find datasets for'
    },
    {
      name: 'field',
      type: 'string',
      description: 'Research field (e.g., "longevity", "aging", "senescence")'
    },
    {
      name: 'max_results',
      type: 'string',
      description: 'Maximum number of datasets to return (default: 3)'
    }
  ] as const,
  executable: async (args, _logger) => {
    const startTime = Date.now();

    try {
      const { hypothesis, field, max_results } = args;

      // Validate required arguments
      if (!hypothesis || !field) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          'Missing required arguments: hypothesis and field are required'
        );
      }

      const maxResults = parseInt(max_results || '3', 10);

      Logger.info('Searching for datasets', {
        hypothesis: hypothesis.substring(0, 100),
        field,
        max_results: maxResults
      });

      // Calculate relevance scores
      const scoredDatasets = MOCK_DATASETS.map(dataset => ({
        ...dataset,
        relevance_score: calculateRelevance(dataset, hypothesis, field)
      }));

      // Sort by relevance and take top N
      const topDatasets = scoredDatasets
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, maxResults)
        .filter(d => d.relevance_score > 0); // Only return relevant datasets

      const duration = Date.now() - startTime;
      Logger.trackPerformance('find_datasets', duration, true, {
        datasets_found: topDatasets.length,
        field
      });

      Logger.log(
        'DATA_CURATION' as any,
        `Found ${topDatasets.length} relevant datasets`,
        {
          hypothesis_preview: hypothesis.substring(0, 50),
          field,
          datasets: topDatasets.map(d => d.name)
        },
        'DataCuratorAgent'
      );

      const responseData = {
        success: true,
        datasets: topDatasets,
        total_found: topDatasets.length,
        field: field,
        sources: [...new Set(topDatasets.map(d => d.source))],
        message: `Found ${topDatasets.length} relevant datasets for ${field} research`
      };

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(responseData, null, 2)
      );
    } catch (error: any) {
      const duration = Date.now() - startTime;
      Logger.trackPerformance('find_datasets', duration, false);

      Logger.error('Dataset search failed', {
        error: error.message,
        stack: error.stack
      });

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Failed to find datasets: ${error.message}`
      );
    }
  }
});

/**
 * Helper function to find datasets directly (for testing)
 */
export async function findDatasets(
  hypothesis: string,
  field: string,
  maxResults: number = 3
): Promise<{ datasets: Dataset[]; total_found: number }> {
  const response = await findDatasetsFunction.executable(
    {
      hypothesis,
      field,
      max_results: maxResults.toString()
    },
    (msg: string) => console.log(msg)
  );

  if (response.status === ExecutableGameFunctionStatus.Done) {
    const data = JSON.parse(response.feedback);
    return {
      datasets: data.datasets,
      total_found: data.total_found
    };
  } else {
    throw new Error(response.feedback);
  }
}

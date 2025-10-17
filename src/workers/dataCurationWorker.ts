/**
 * Data Curation Worker
 * Specializes in finding and curating scientific datasets
 */

import { GameWorker } from '@virtuals-protocol/game';
import { findDatasetsFunction } from '../functions/findDatasets';

/**
 * Data Curation Worker
 * Provides dataset discovery and curation capabilities
 */
export const dataCurationWorker = new GameWorker({
  id: 'data_curation_worker',
  name: 'Data Curation Worker',
  description:
    'Specializes in finding, validating, and curating scientific datasets from public repositories. Can search Kaggle, UCI ML Repository, PubMed Central, data.gov, and other scientific data sources.',
  functions: [findDatasetsFunction],
  getEnvironment: async () => ({
    current_time: new Date().toISOString(),
    data_sources: [
      'Kaggle',
      'UCI ML Repository',
      'PubMed Central',
      'data.gov',
      'Human Metabolome Database',
      'KEGG Database',
      'GEO Database'
    ],
    capabilities: [
      'dataset_search',
      'quality_validation',
      'metadata_extraction',
      'relevance_scoring'
    ],
    status: 'active'
  })
});

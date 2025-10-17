/**
 * Data Curator Agent
 * Specializes in finding and curating scientific datasets
 */

import { GameAgent } from '@virtuals-protocol/game';
import { dataCurationWorker } from '../workers/dataCurationWorker';

/**
 * Agent state for Data Curator
 */
export interface DataCuratorState {
  datasets_found: number;
  searches_performed: number;
  sources: string[];
  status: 'active' | 'idle';
  last_search: string;
}

// Global state for the agent
let agentState: DataCuratorState = {
  datasets_found: 0,
  searches_performed: 0,
  sources: ['Kaggle', 'UCI ML', 'PubMed Central', 'data.gov'],
  status: 'idle',
  last_search: new Date().toISOString()
};

/**
 * Get current agent state
 */
export async function getDataCuratorState(): Promise<DataCuratorState> {
  return { ...agentState };
}

/**
 * Update agent state
 */
export function updateDataCuratorState(updates: Partial<DataCuratorState>): void {
  agentState = { ...agentState, ...updates };
}

/**
 * Increment datasets found
 */
export function incrementDatasetsFound(count: number = 1): void {
  agentState.datasets_found += count;
  agentState.searches_performed += 1;
  agentState.last_search = new Date().toISOString();
}

/**
 * Data Curator Agent
 * Finds and curates scientific datasets relevant to research hypotheses
 */
export const dataCuratorAgent = new GameAgent(
  process.env.GAME_API_KEY || '',
  {
    name: 'Data Curator',
    goal: 'Find, validate, and curate scientific datasets relevant to research hypotheses',
    description:
      'I specialize in finding quality datasets from public repositories like Kaggle, UCI ML Repository, PubMed Central, and data.gov. I validate data integrity, assess relevance, and prepare dataset metadata for analysis. I provide researchers with curated, high-quality data sources for their studies.',
    getAgentState: async () => getDataCuratorState(),
    workers: [dataCurationWorker]
  }
);

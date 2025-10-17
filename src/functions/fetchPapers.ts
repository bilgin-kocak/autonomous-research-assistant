import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import axios from 'axios';
import xml2js from 'xml2js';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';

/**
 * Paper structure returned from arXiv
 */
export interface ArxivPaper {
  title: string;
  authors: string;
  summary: string;
  published: string;
  link: string;
  categories: string;
}

/**
 * Response structure for fetch papers function
 */
export interface FetchPapersResponse {
  papers: ArxivPaper[];
  count: number;
  topic: string;
}

/**
 * Fetch Papers Function
 * Fetches recent scientific papers from arXiv based on a research topic
 */
export const fetchPapersFunction = new GameFunction({
  name: 'fetch_arxiv_papers',
  description:
    'Fetches recent scientific papers from arXiv based on a research topic. Use this to gather the latest research in a specific field. Returns papers with title, authors, abstract, publication date, and link.',
  args: [
    {
      name: 'topic',
      type: 'string',
      description:
        "The research topic or keyword to search for (e.g., 'machine learning', 'quantum computing', 'longevity', 'aging', 'senescence')"
    },
    {
      name: 'max_results',
      description: 'Maximum number of papers to fetch (default: 10, max: 50)'
    }
  ] as const,
  executable: async (args, logger) => {
    try {
      const topic = args.topic as string;
      const maxResults = Math.min(
        Number(args.max_results) || Config.ARXIV_MAX_RESULTS,
        50
      );

      Logger.info(`Starting paper fetch for topic: ${topic}`, {
        topic,
        maxResults
      });

      // Build arXiv API query
      const query = `search_query=all:${encodeURIComponent(topic)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;
      const url = `${Config.ARXIV_API_URL}?${query}`;

      Logger.info(`Requesting arXiv API: ${url}`);

      // Fetch papers from arXiv
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'ScienceDAO-Agent/1.0'
        }
      });

      // Parse XML response
      const parser = new xml2js.Parser({
        explicitArray: true,
        ignoreAttrs: false
      });

      const result = await parser.parseStringPromise(response.data);

      // Extract papers from feed
      const entries = result.feed?.entry || [];
      const papers: ArxivPaper[] = entries.map((entry: any) => {
        // Extract title and clean it
        const title = entry.title?.[0]?.trim().replace(/\s+/g, ' ') || 'No title';

        // Extract authors
        const authors = entry.author
          ?.map((a: any) => a.name?.[0])
          .filter(Boolean)
          .join(', ') || 'Unknown';

        // Extract and truncate summary
        let summary = entry.summary?.[0]?.trim().replace(/\s+/g, ' ') || 'No summary';
        if (summary.length > Config.PAPER_SUMMARY_MAX_LENGTH) {
          summary = summary.substring(0, Config.PAPER_SUMMARY_MAX_LENGTH) + '...';
        }

        // Extract publication date
        const published = entry.published?.[0] || 'Unknown date';

        // Extract arXiv link
        const link = entry.id?.[0] || '';

        // Extract categories
        const categories = entry.category
          ?.map((c: any) => c.$?.term)
          .filter(Boolean)
          .join(', ') || 'Uncategorized';

        return {
          title,
          authors,
          summary,
          published,
          link,
          categories
        };
      });

      // Log success
      Logger.paperFetch(topic, papers.length);

      // Prepare response
      const responseData: FetchPapersResponse = {
        papers,
        count: papers.length,
        topic
      };

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(responseData, null, 2)
      );
    } catch (error: any) {
      const errorMessage = `Failed to fetch papers: ${error.message}`;
      Logger.error(errorMessage, {
        error: error.message,
        stack: error.stack
      });

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        errorMessage
      );
    }
  }
});

/**
 * Helper function to introduce delay for rate limiting
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch papers with rate limiting
 * Use this wrapper to respect arXiv's rate limits (1 request per 3 seconds)
 */
export async function fetchPapersWithRateLimit(
  topic: string,
  maxResults: number = Config.ARXIV_MAX_RESULTS
): Promise<FetchPapersResponse> {
  try {
    // Execute the function
    const response = await fetchPapersFunction.executable(
      { topic, max_results: maxResults.toString() },
      (msg: string) => console.log(msg)
    );

    // Wait for rate limit period before next request
    await delay(Config.ARXIV_RATE_LIMIT_MS);

    if (response.status === ExecutableGameFunctionStatus.Done) {
      return JSON.parse(response.feedback);
    } else {
      throw new Error(response.feedback);
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch papers: ${error.message}`);
  }
}

import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import axios from 'axios';
import { Config } from '../utils/config';
import { Logger } from '../utils/logger';

/**
 * Paper analysis structure
 */
export interface PaperAnalysis {
  findings: string[];
  methodology: string;
  gaps: string[];
  next_steps: string[];
}

/**
 * Analyze Paper Function
 * Analyzes a scientific paper to extract key findings, methodology, and research gaps
 */
export const analyzePaperFunction = new GameFunction({
  name: 'analyze_research_paper',
  description:
    'Analyzes a scientific paper to extract key findings, methodology, and research gaps. Use this to understand what has been studied and what\'s missing. Returns structured analysis with findings, methodology, identified gaps, and potential next steps.',
  args: [
    {
      name: 'paper_summary',
      type: 'string',
      description: 'The abstract or summary of the paper to analyze'
    },
    {
      name: 'paper_title',
      type: 'string',
      description: 'The title of the paper'
    }
  ] as const,
  executable: async (args, logger) => {
    try {
      const paperSummary = args.paper_summary as string;
      const paperTitle = args.paper_title as string;

      Logger.info(`Starting analysis for paper: ${paperTitle}`);

      // Validate inputs
      if (!paperSummary || paperSummary.trim().length < 10) {
        throw new Error('Paper summary is too short or empty');
      }

      if (!paperTitle || paperTitle.trim().length < 5) {
        throw new Error('Paper title is too short or empty');
      }

      // Prepare the analysis prompt
      const systemPrompt = `You are a scientific research analyst with expertise in identifying research gaps and opportunities. Your task is to:
1. Extract key findings from the paper
2. Identify the methodology used
3. Identify research gaps (what hasn't been studied or needs further investigation)
4. Suggest potential next steps for future research

Provide your analysis in valid JSON format with the following structure:
{
  "findings": ["finding1", "finding2", ...],
  "methodology": "description of methodology",
  "gaps": ["gap1", "gap2", ...],
  "next_steps": ["step1", "step2", ...]
}`;

      const userPrompt = `Title: ${paperTitle}

Abstract: ${paperSummary}

Provide analysis in JSON format with keys: findings, methodology, gaps, next_steps`;

      Logger.info('Calling OpenAI API for paper analysis');

      // Call OpenAI API
      const response = await axios.post(
        Config.OPENAI_API_URL,
        {
          model: Config.OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: Config.OPENAI_TEMPERATURE_ANALYSIS,
          max_tokens: Config.OPENAI_MAX_TOKENS
        },
        {
          headers: {
            Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Extract analysis from response
      const analysisText = response.data.choices[0]?.message?.content;

      if (!analysisText) {
        throw new Error('No response received from OpenAI API');
      }

      Logger.info('Received analysis from OpenAI');

      // Parse JSON from response (handle potential markdown code blocks)
      let analysisJson: PaperAnalysis;
      try {
        // Remove markdown code blocks if present
        const cleanedText = analysisText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        analysisJson = JSON.parse(cleanedText);

        // Validate structure
        if (!analysisJson.findings || !analysisJson.methodology ||
            !analysisJson.gaps || !analysisJson.next_steps) {
          throw new Error('Invalid analysis structure');
        }
      } catch (parseError: any) {
        Logger.error('Failed to parse analysis JSON', parseError);

        // Fallback: return structured text
        analysisJson = {
          findings: ['Analysis parsing failed. Raw response: ' + analysisText.substring(0, 200)],
          methodology: 'Not extracted',
          gaps: ['Unable to extract gaps due to parsing error'],
          next_steps: ['Manual review needed']
        };
      }

      // Log the analysis
      Logger.paperAnalysis(paperTitle, analysisJson);

      // Return the analysis
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(analysisJson, null, 2)
      );
    } catch (error: any) {
      const errorMessage = `Analysis failed: ${error.message}`;
      Logger.error(errorMessage, {
        error: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        errorMessage
      );
    }
  }
});

/**
 * Helper function to analyze a paper
 * Provides a simpler interface for paper analysis
 */
export async function analyzePaper(
  paperTitle: string,
  paperSummary: string
): Promise<PaperAnalysis> {
  try {
    const response = await analyzePaperFunction.executable(
      {
        paper_title: paperTitle,
        paper_summary: paperSummary
      },
      (msg: string) => console.log(msg)
    );

    if (response.status === ExecutableGameFunctionStatus.Done) {
      return JSON.parse(response.feedback);
    } else {
      throw new Error(response.feedback);
    }
  } catch (error: any) {
    throw new Error(`Failed to analyze paper: ${error.message}`);
  }
}

/**
 * Batch analyze multiple papers
 * Analyzes multiple papers with delay to respect rate limits
 */
export async function batchAnalyzePapers(
  papers: Array<{ title: string; summary: string }>,
  delayMs: number = 1000
): Promise<PaperAnalysis[]> {
  const analyses: PaperAnalysis[] = [];

  for (const paper of papers) {
    try {
      const analysis = await analyzePaper(paper.title, paper.summary);
      analyses.push(analysis);

      // Delay between requests to avoid rate limiting
      if (papers.indexOf(paper) < papers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error: any) {
      Logger.error(`Failed to analyze paper: ${paper.title}`, error);
      // Continue with next paper even if one fails
    }
  }

  return analyses;
}

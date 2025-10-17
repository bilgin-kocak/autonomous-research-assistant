import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import axios from 'axios';
import { Config } from '../utils/config';
import { Logger, ActivityType } from '../utils/logger';

/**
 * Hypothesis structure with scores
 */
export interface Hypothesis {
  hypothesis: string;
  rationale: string;
  methodology: string;
  expected_impact: string;
  novelty_score: number;
  feasibility_score: number;
  impact_score: number;
  rigor_score: number;
  overall_score: number;
}

/**
 * Response structure for hypothesis generation
 */
export interface GenerateHypothesisResponse {
  hypotheses: Hypothesis[];
  field: string;
  gaps_analyzed: string;
  generated_at: string;
}

/**
 * Generate Hypothesis Function
 * Generates novel research hypotheses based on analyzed papers and identified research gaps
 */
export const generateHypothesisFunction = new GameFunction({
  name: 'generate_hypothesis',
  description:
    'Generates novel research hypotheses based on analyzed papers and identified research gaps. Creates testable scientific hypotheses with novelty, feasibility, impact, and rigor scores. Use this after analyzing papers to propose new research directions.',
  args: [
    {
      name: 'research_gaps',
      type: 'string',
      description: 'Description of identified research gaps from analyzed papers'
    },
    {
      name: 'field',
      type: 'string',
      description:
        "Scientific field (e.g., 'longevity', 'neuroscience', 'climate science', 'aging')"
    }
  ] as const,
  executable: async (args, logger) => {
    try {
      const researchGaps = args.research_gaps as string;
      const field = args.field as string;

      Logger.info(`Starting hypothesis generation for field: ${field}`);

      // Validate inputs
      if (!researchGaps || researchGaps.trim().length < 20) {
        throw new Error('Research gaps description is too short or empty');
      }

      if (!field || field.trim().length < 3) {
        throw new Error('Field name is too short or empty');
      }

      // Prepare the hypothesis generation prompt
      const systemPrompt = `You are a research scientist generating novel, testable hypotheses. Your responsibilities include:

1. Analyzing research gaps to identify opportunities for innovation
2. Creating specific, measurable, and testable hypotheses
3. Ensuring hypotheses are feasible with current or near-future technology
4. Considering ethical implications and societal impact
5. Providing clear experimental methodology
6. Scoring each hypothesis objectively

Guidelines for hypothesis generation:
- Be specific: Avoid vague statements. Include concrete variables and expected relationships.
- Be measurable: Ensure outcomes can be quantified or clearly observed.
- Be innovative: Build on gaps rather than incremental improvements.
- Be feasible: Consider current technology, funding, and timeframes.
- Be rigorous: Base hypotheses on sound scientific principles.

Provide your output in valid JSON format with this exact structure:
{
  "hypotheses": [
    {
      "hypothesis": "Clear, specific statement of the hypothesis (If X, then Y because Z)",
      "rationale": "Why this hypothesis matters and how it addresses the research gap",
      "methodology": "Detailed experimental approach to test this hypothesis",
      "expected_impact": "Potential outcomes and significance if hypothesis is confirmed",
      "novelty_score": 8,
      "feasibility_score": 7,
      "impact_score": 9,
      "rigor_score": 8,
      "overall_score": 8.0
    }
  ]
}

Scoring criteria (1-10):
- Novelty: How original and innovative is this hypothesis?
- Feasibility: Can this be tested with current/near-future technology?
- Impact: Would success significantly advance the field?
- Rigor: Is the methodology scientifically sound?
- Overall: Average of the four scores above

Generate exactly 3 hypotheses.`;

      const userPrompt = `Research Field: ${field}

Research Gaps Identified:
${researchGaps}

Based on these research gaps, generate 3 novel, testable hypotheses that would significantly advance the field of ${field}.

Each hypothesis should:
1. Directly address one or more of the identified gaps
2. Be testable with a clear experimental design
3. Have potential for significant impact
4. Be feasible to investigate

Provide the response in the exact JSON format specified, with all required fields.`;

      Logger.info('Calling OpenAI API for hypothesis generation');

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
          temperature: Config.OPENAI_TEMPERATURE_HYPOTHESIS,
          max_tokens: 2000 // More tokens for detailed hypotheses
        },
        {
          headers: {
            Authorization: `Bearer ${Config.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 60 second timeout for complex generation
        }
      );

      // Extract hypotheses from response
      const hypothesesText = response.data.choices[0]?.message?.content;

      if (!hypothesesText) {
        throw new Error('No response received from OpenAI API');
      }

      Logger.info('Received hypotheses from OpenAI');

      // Parse JSON from response (handle potential markdown code blocks)
      let hypothesesData: { hypotheses: Hypothesis[] };
      try {
        // Remove markdown code blocks if present
        const cleanedText = hypothesesText
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        hypothesesData = JSON.parse(cleanedText);

        // Validate structure
        if (
          !hypothesesData.hypotheses ||
          !Array.isArray(hypothesesData.hypotheses) ||
          hypothesesData.hypotheses.length === 0
        ) {
          throw new Error('Invalid hypotheses structure');
        }

        // Calculate overall scores if not provided
        hypothesesData.hypotheses = hypothesesData.hypotheses.map(hyp => {
          if (!hyp.overall_score) {
            hyp.overall_score =
              (hyp.novelty_score +
                hyp.feasibility_score +
                hyp.impact_score +
                hyp.rigor_score) /
              4;
          }
          return hyp;
        });
      } catch (parseError: any) {
        Logger.error('Failed to parse hypotheses JSON', parseError);

        // Fallback: create a simple structured response
        hypothesesData = {
          hypotheses: [
            {
              hypothesis: 'Parsing failed. Raw response: ' + hypothesesText.substring(0, 200),
              rationale: 'JSON parsing error occurred',
              methodology: 'Manual review needed',
              expected_impact: 'Unable to determine',
              novelty_score: 5,
              feasibility_score: 5,
              impact_score: 5,
              rigor_score: 5,
              overall_score: 5
            }
          ]
        };
      }

      // Prepare final response
      const result: GenerateHypothesisResponse = {
        hypotheses: hypothesesData.hypotheses,
        field,
        gaps_analyzed: researchGaps.substring(0, 200) + '...', // Truncate for logging
        generated_at: new Date().toISOString()
      };

      // Log hypothesis generation
      Logger.hypothesisGeneration(
        `Generated ${result.hypotheses.length} hypotheses for ${field}`,
        {
          count: result.hypotheses.length,
          field,
          scores: result.hypotheses.map(h => h.overall_score)
        }
      );

      // Return the hypotheses
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(result, null, 2)
      );
    } catch (error: any) {
      const errorMessage = `Hypothesis generation failed: ${error.message}`;
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
 * Helper function to generate hypotheses
 * Provides a simpler interface for hypothesis generation
 */
export async function generateHypotheses(
  researchGaps: string,
  field: string
): Promise<GenerateHypothesisResponse> {
  try {
    const response = await generateHypothesisFunction.executable(
      {
        research_gaps: researchGaps,
        field: field
      },
      (msg: string) => console.log(msg)
    );

    if (response.status === ExecutableGameFunctionStatus.Done) {
      return JSON.parse(response.feedback);
    } else {
      throw new Error(response.feedback);
    }
  } catch (error: any) {
    throw new Error(`Failed to generate hypotheses: ${error.message}`);
  }
}

/**
 * Score and rank hypotheses
 * Returns hypotheses sorted by overall score (highest first)
 */
export function rankHypotheses(hypotheses: Hypothesis[]): Hypothesis[] {
  return [...hypotheses].sort((a, b) => b.overall_score - a.overall_score);
}

/**
 * Filter hypotheses by minimum score threshold
 */
export function filterHypothesesByScore(
  hypotheses: Hypothesis[],
  minScore: number = 7.0
): Hypothesis[] {
  return hypotheses.filter(h => h.overall_score >= minScore);
}

/**
 * Review Hypothesis Function
 * Evaluates research hypotheses for scientific validity, novelty, and feasibility
 */

import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import axios from 'axios';
import { Logger } from '../utils/logger';

/**
 * Hypothesis review structure
 */
export interface HypothesisReview {
  hypothesis_id: string;
  novelty_score: number; // 1-10
  feasibility_score: number; // 1-10
  impact_score: number; // 1-10
  rigor_score: number; // 1-10
  overall_score: number; // Average of above
  approved: boolean; // true if overall_score >= 7.0
  feedback: string;
  reviewer_confidence: number; // 1-10
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * Review hypothesis using GPT-4
 */
export const reviewHypothesisFunction = new GameFunction({
  name: 'review_hypothesis',
  description:
    'Critically evaluates a research hypothesis for scientific validity, novelty, feasibility, and potential impact. Acts as a rigorous peer reviewer providing scores and constructive feedback.',
  args: [
    {
      name: 'hypothesis_id',
      type: 'string',
      description: 'Unique identifier for the hypothesis'
    },
    {
      name: 'hypothesis',
      type: 'string',
      description: 'The research hypothesis to review'
    },
    {
      name: 'methodology',
      type: 'string',
      description: 'Proposed methodology for testing the hypothesis'
    },
    {
      name: 'field',
      type: 'string',
      description: 'Research field (e.g., "longevity", "aging")'
    }
  ] as const,
  executable: async (args, logger) => {
    const startTime = Date.now();

    try {
      const { hypothesis_id, hypothesis, methodology, field } = args;

      // Validate required arguments
      if (!hypothesis_id || !hypothesis || !methodology || !field) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          'Missing required arguments: hypothesis_id, hypothesis, methodology, and field are all required'
        );
      }

      Logger.info(`Reviewing hypothesis: ${hypothesis_id}`, {
        field,
        hypothesis_preview: hypothesis.substring(0, 100)
      });

      // Construct review prompt
      const systemPrompt = `You are a rigorous peer reviewer for scientific research proposals in ${field}.
Your role is to critically evaluate research hypotheses for:
1. Novelty (1-10): Is this hypothesis truly novel and original?
2. Feasibility (1-10): Can this be tested with current technology and reasonable resources?
3. Impact (1-10): Would success significantly advance the field?
4. Rigor (1-10): Is the methodology sound and well-designed?

Provide constructive, specific feedback. Be critical but fair. Consider ethical implications.`;

      const userPrompt = `Please review this research hypothesis:

**Hypothesis:** ${hypothesis}

**Proposed Methodology:** ${methodology}

**Research Field:** ${field}

Provide your review as a JSON object with the following structure:
{
  "novelty_score": <number 1-10>,
  "feasibility_score": <number 1-10>,
  "impact_score": <number 1-10>,
  "rigor_score": <number 1-10>,
  "reviewer_confidence": <number 1-10>,
  "strengths": [<array of 2-3 strength points>],
  "weaknesses": [<array of 2-3 weakness points>],
  "recommendations": [<array of 2-3 improvement suggestions>],
  "feedback": "<overall assessment in 2-3 sentences>"
}`;

      // Call OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.4, // Balanced: not too random, not too deterministic
          max_tokens: 800
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;

      // Parse JSON response
      let reviewData: any;
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        reviewData = JSON.parse(jsonStr);
      } catch (parseError) {
        Logger.warning('Failed to parse JSON from GPT-4 response, attempting fallback');
        reviewData = JSON.parse(content);
      }

      // Calculate overall score
      const overall_score =
        (reviewData.novelty_score +
          reviewData.feasibility_score +
          reviewData.impact_score +
          reviewData.rigor_score) /
        4;

      const review: HypothesisReview = {
        hypothesis_id,
        novelty_score: reviewData.novelty_score,
        feasibility_score: reviewData.feasibility_score,
        impact_score: reviewData.impact_score,
        rigor_score: reviewData.rigor_score,
        overall_score: Math.round(overall_score * 10) / 10,
        approved: overall_score >= 7.0,
        feedback: reviewData.feedback,
        reviewer_confidence: reviewData.reviewer_confidence,
        strengths: reviewData.strengths || [],
        weaknesses: reviewData.weaknesses || [],
        recommendations: reviewData.recommendations || []
      };

      const duration = Date.now() - startTime;
      Logger.trackAPICall('OpenAI', duration, true);
      Logger.trackPerformance('review_hypothesis', duration, true, {
        overall_score: review.overall_score,
        approved: review.approved
      });

      Logger.log(
        'PEER_REVIEW' as any,
        `Peer review completed for ${hypothesis_id}`,
        {
          hypothesis_id,
          overall_score: review.overall_score,
          approved: review.approved,
          novelty: review.novelty_score,
          feasibility: review.feasibility_score
        },
        'PeerReviewAgent'
      );

      const responseData = {
        success: true,
        review,
        message: review.approved
          ? `Hypothesis approved with score ${review.overall_score}/10`
          : `Hypothesis needs improvement (score: ${review.overall_score}/10)`
      };

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(responseData, null, 2)
      );
    } catch (error: any) {
      const duration = Date.now() - startTime;
      Logger.trackAPICall('OpenAI', duration, false, error.message);
      Logger.trackPerformance('review_hypothesis', duration, false);

      Logger.error('Hypothesis review failed', {
        error: error.message,
        stack: error.stack
      });

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Failed to review hypothesis: ${error.message}`
      );
    }
  }
});

/**
 * Helper function to review hypothesis directly (for testing)
 */
export async function reviewHypothesis(
  hypothesisId: string,
  hypothesis: string,
  methodology: string,
  field: string
): Promise<HypothesisReview> {
  const response = await reviewHypothesisFunction.executable(
    {
      hypothesis_id: hypothesisId,
      hypothesis,
      methodology,
      field
    },
    (msg: string) => console.log(msg)
  );

  if (response.status === ExecutableGameFunctionStatus.Done) {
    const data = JSON.parse(response.feedback);
    return data.review;
  } else {
    throw new Error(response.feedback);
  }
}

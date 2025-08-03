'use server';

/**
 * @fileOverview Sentiment analysis flow for journal entries.
 *
 * - analyzeEntrySentiment - Analyzes the sentiment of a journal entry.
 * - AnalyzeEntrySentimentInput - The input type for the analyzeEntrySentiment function.
 * - AnalyzeEntrySentimentOutput - The return type for the analyzeEntrySentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEntrySentimentInputSchema = z.object({
  text: z
    .string()
    .describe('The text content of the journal entry to analyze.'),
});
export type AnalyzeEntrySentimentInput = z.infer<typeof AnalyzeEntrySentimentInputSchema>;

const AnalyzeEntrySentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the journal entry, e.g., positive, negative, neutral.'
    ),
  score: z
    .number()
    .describe(
      'A numerical score representing the sentiment strength. Higher values indicate more positive sentiment, while lower values indicate more negative sentiment.'
    ),
});
export type AnalyzeEntrySentimentOutput = z.infer<typeof AnalyzeEntrySentimentOutputSchema>;

export async function analyzeEntrySentiment(
  input: AnalyzeEntrySentimentInput
): Promise<AnalyzeEntrySentimentOutput> {
  return analyzeEntrySentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEntrySentimentPrompt',
  input: {schema: AnalyzeEntrySentimentInputSchema},
  output: {schema: AnalyzeEntrySentimentOutputSchema},
  prompt: `Analyze the sentiment of the following text:

Text: {{{text}}}

Determine the overall sentiment (positive, negative, or neutral) and provide a numerical score indicating the sentiment strength. The score should range from -1 (very negative) to 1 (very positive), with 0 representing neutral sentiment.

Respond in JSON format with the sentiment label and score.`,
});

const analyzeEntrySentimentFlow = ai.defineFlow(
  {
    name: 'analyzeEntrySentimentFlow',
    inputSchema: AnalyzeEntrySentimentInputSchema,
    outputSchema: AnalyzeEntrySentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

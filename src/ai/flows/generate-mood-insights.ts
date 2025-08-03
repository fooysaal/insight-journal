'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating mood insights based on journal entries and activity data.
 *
 * generateMoodInsights - A function that generates mood insights for a user.
 * GenerateMoodInsightsInput - The input type for the generateMoodInsights function.
 * GenerateMoodInsightsOutput - The return type for the generateMoodInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodInsightsInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      timestamp: z.string(),
      text: z.string().optional(),
      mood: z.string(),
      activities: z
        .object({
          steps: z.number().optional(),
          screenTime: z.number().optional(),
        })
        .optional(),
      weather: z.string().optional(),
    })
  ),
});
export type GenerateMoodInsightsInput = z.infer<typeof GenerateMoodInsightsInputSchema>;

const GenerateMoodInsightsOutputSchema = z.object({
  insights: z.array(z.string()),
});
export type GenerateMoodInsightsOutput = z.infer<typeof GenerateMoodInsightsOutputSchema>;

export async function generateMoodInsights(input: GenerateMoodInsightsInput): Promise<GenerateMoodInsightsOutput> {
  return generateMoodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoodInsightsPrompt',
  input: {schema: GenerateMoodInsightsInputSchema},
  output: {schema: GenerateMoodInsightsOutputSchema},
  prompt: `You are an AI assistant designed to generate insights about a user's mood based on their journal entries and activity data.

  Analyze the following journal entries and activity data to identify trends and correlations between mood, activities, and weather.

  Journal Entries:
  {{#each journalEntries}}
  - Timestamp: {{timestamp}}, Mood: {{mood}}, Text: {{text}}, Activities: Steps - {{activities.steps}}, Screen Time - {{activities.screenTime}}, Weather: {{weather}}
  {{/each}}

  Generate a few concise and insightful statements about the user's mood trends and the factors that influence them. For example:

  - "You tend to feel happier on days when you take more steps."
  - "You seem to experience lower moods on days with more screen time."
  - "Your mood is generally positive when the weather is sunny."

  Insights should be related to trends between mood, activities, and weather.
  Return your findings as a list of strings in the 'insights' field.
  `,
});

const generateMoodInsightsFlow = ai.defineFlow(
  {
    name: 'generateMoodInsightsFlow',
    inputSchema: GenerateMoodInsightsInputSchema,
    outputSchema: GenerateMoodInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

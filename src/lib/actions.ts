'use server';

import { analyzeEntrySentiment, AnalyzeEntrySentimentInput, AnalyzeEntrySentimentOutput } from "@/ai/flows/analyze-entry-sentiment";
import { generateMoodInsights, GenerateMoodInsightsInput, GenerateMoodInsightsOutput } from "@/ai/flows/generate-mood-insights";
import type { JournalEntry } from "./types";

export async function analyzeSentiment(input: AnalyzeEntrySentimentInput): Promise<AnalyzeEntrySentimentOutput> {
    return await analyzeEntrySentiment(input);
}

export async function getInsights(entries: JournalEntry[]): Promise<GenerateMoodInsightsOutput> {
    const input: GenerateMoodInsightsInput = {
        journalEntries: entries.map(e => ({
            timestamp: e.timestamp,
            text: e.text,
            mood: e.mood.label,
            activities: e.activities,
            weather: e.weather
        }))
    };
    return await generateMoodInsights(input);
}

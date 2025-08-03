'use client';

import { useState } from 'react';
import { useJournalStore } from '@/hooks/useJournalStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, LineChart as LineChartIcon, BarChart2 } from 'lucide-react';
import { getInsights } from '@/lib/actions';
import type { GenerateMoodInsightsOutput } from '@/ai/flows/generate-mood-insights';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar
} from 'recharts';

const moodToScore = (mood: string): number => {
    const mapping: { [key: string]: number } = {
        'Excited': 5,
        'Happy': 4,
        'Neutral': 3,
        'Tired': 2,
        'Anxious': 2,
        'Sad': 1,
        'Angry': 1,
    };
    return mapping[mood] || 3;
};

export function InsightsDashboard() {
  const { entries, isInitialized } = useJournalStore();
  const [insights, setInsights] = useState<GenerateMoodInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInsights(entries);
      setInsights(result);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const moodChartData = entries.map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: moodToScore(entry.mood.label),
  })).reverse();

  const activityMoodData = entries.map(entry => ({
    name: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: moodToScore(entry.mood.label),
    steps: entry.activities.steps || 0,
    screenTime: entry.activities.screenTime ? entry.activities.screenTime / 60 : 0, // in hours
  }));


  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (entries.length < 3) {
    return (
      <Alert>
        <LineChartIcon className="h-4 w-4" />
        <AlertTitle>Not Enough Data</AlertTitle>
        <AlertDescription>
          You need at least 3 journal entries to generate insights and view charts. Keep journaling!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>Click the button to analyze your journal entries and find patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateInsights} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
          {error && <p className="text-destructive mt-4">{error}</p>}
          {insights && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Here's what I found:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {insights.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
                <CardTitle>Mood Over Time</CardTitle>
                <CardDescription>Your mood fluctuations over your last entries.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={moodChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 5]} tickFormatter={(value) => ['Sad', 'Tired', 'Neutral', 'Happy', 'Excited'][value-1]}/>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Mood vs. Activity</CardTitle>
                <CardDescription>How your mood correlates with steps and screen time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityMoodData}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}/>
                         <Legend />
                         <Bar dataKey="steps" fill="hsl(var(--primary))" name="Steps" />
                         <Bar dataKey="mood" fill="hsl(var(--accent))" name="Mood Score" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

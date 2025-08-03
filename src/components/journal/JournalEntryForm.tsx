
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useJournalStore } from '@/hooks/useJournalStore';
import { MOODS } from '@/lib/constants';
import type { Mood } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Mic, Loader2, Sparkles } from 'lucide-react';
import { analyzeSentiment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  text: z.string().optional(),
  mood: z.object({
    emoji: z.string(),
    label: z.string(),
  }),
  activities: z.object({
    steps: z.coerce.number().min(0).optional(),
    screenTime: z.coerce.number().min(0).optional(),
  }),
  weather: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function JournalEntryForm() {
  const router = useRouter();
  const { addEntry } = useJournalStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState<{ sentiment: string; score: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      mood: MOODS[1], // Default to Happy
      activities: {
        steps: undefined,
        screenTime: undefined,
      },
      weather: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    addEntry({ ...values, sentiment: sentiment || undefined });
    toast({
      title: "Entry Saved!",
      description: "Your journal entry has been successfully saved.",
    });
    router.push('/');
  };

  const handleTextChange = async (text: string) => {
    if (text.trim().split(' ').length > 5) { // Analyze after a few words
      setIsAnalyzing(true);
      try {
        const result = await analyzeSentiment({ text });
        setSentiment(result);
      } catch (error) {
        console.error("Sentiment analysis failed", error);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setSentiment(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood: Mood) => (
                        <Button
                          key={mood.label}
                          type="button"
                          variant={field.value.label === mood.label ? 'default' : 'outline'}
                          onClick={() => field.onChange(mood)}
                          className="flex-grow sm:flex-grow-0"
                        >
                          <span className="text-2xl mr-2">{mood.emoji}</span> {mood.label}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's on your mind?</CardTitle>
          </CardHeader>
          <CardContent>
             <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        placeholder="Let your thoughts flow..."
                        className="resize-none pr-10"
                        rows={8}
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          handleTextChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 text-muted-foreground"
                      onClick={() => alert('Voice-to-text not implemented yet.')}
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </div>
                  {isAnalyzing && (
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing sentiment...
                    </div>
                  )}
                  {sentiment && !isAnalyzing && (
                    <div className="flex items-center text-sm text-accent-foreground bg-accent/80 rounded-full px-3 py-1 mt-2 w-fit">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI sentiment: <span className="font-semibold ml-1 capitalize">{sentiment.sentiment}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Daily Activities</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="activities.steps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Steps Walked</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 8000" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="activities.screenTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screen Time (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 240" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="weather"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weather</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunny" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Entry
            </Button>
        </div>
      </form>
    </Form>
  );
}

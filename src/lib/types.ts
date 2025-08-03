export type Mood = {
  emoji: string;
  label: string;
};

export type JournalEntry = {
  id: string;
  timestamp: string;
  text?: string;
  mood: Mood;
  activities: {
    steps?: number;
    screenTime?: number; // in minutes
  };
  weather?: string;
  sentiment?: {
    sentiment: string;
    score: number;
  };
};

export type JournalEntryInput = Omit<JournalEntry, 'id' | 'timestamp'>;

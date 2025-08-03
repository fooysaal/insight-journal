'use client';
import type { JournalEntry, JournalEntryInput } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    text: 'Felt really productive today. Managed to finish a big project at work and still had energy to go for a run. The weather was perfect.',
    mood: { emoji: '😊', label: 'Happy' },
    activities: { steps: 12000, screenTime: 300 },
    weather: 'Sunny',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    text: 'A bit of a slow day. Feeling a little down, maybe because of the rainy weather. Spent a lot of time on my phone.',
    mood: { emoji: '😔', label: 'Sad' },
    activities: { steps: 2500, screenTime: 480 },
    weather: 'Rainy',
  },
  {
    id: '3',
    timestamp: new Date().toISOString(),
    text: 'Excited about the weekend! Planning a hike with friends. Feeling optimistic and energetic.',
    mood: { emoji: '😄', label: 'Excited' },
    activities: { steps: 5000, screenTime: 180 },
    weather: 'Cloudy',
  },
];


export function useJournalStore() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('insight-journal-entries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      } else {
        setEntries(MOCK_ENTRIES);
      }
    } catch (error) {
      console.error("Failed to load entries from localStorage", error);
      setEntries(MOCK_ENTRIES);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('insight-journal-entries', JSON.stringify(entries));
      } catch (error) {
        console.error("Failed to save entries to localStorage", error);
      }
    }
  }, [entries, isInitialized]);

  const addEntry = useCallback((entry: JournalEntryInput) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    setEntries(prev => [newEntry, ...prev]);
  }, []);

  return { entries, addEntry, isInitialized };
}

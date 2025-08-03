'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen } from 'lucide-react';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { useJournalStore } from '@/hooks/useJournalStore';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { entries, isInitialized } = useJournalStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your personal space for reflection and growth.</p>
        </div>
        <Link href="/journal/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!isInitialized && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
        {isInitialized && entries.length > 0 && entries.map((entry) => (
          <JournalEntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {isInitialized && entries.length === 0 && (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No journal entries yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start by creating your first entry.</p>
            <div className="mt-6">
              <Link href="/journal/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Entry
                </Button>
              </Link>
            </div>
          </div>
      )}
    </div>
  );
}

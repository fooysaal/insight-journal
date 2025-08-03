import { JournalEntryForm } from '@/components/journal/JournalEntryForm';

export default function NewJournalEntryPage() {
  return (
    <div className="max-w-2xl mx-auto">
       <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">New Journal Entry</h1>
        <p className="text-muted-foreground">Log your thoughts, mood, and activities for today.</p>
      </div>
      <JournalEntryForm />
    </div>
  );
}

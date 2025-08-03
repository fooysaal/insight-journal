import { InsightsDashboard } from '@/components/insights/InsightsDashboard';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">Insights</h1>
        <p className="text-muted-foreground">Discover trends and correlations in your well-being.</p>
      </div>
      <InsightsDashboard />
    </div>
  );
}

import type { JournalEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footprints, Smartphone, Sun, Cloudy, CloudRain } from 'lucide-react';

function WeatherIcon({ weather, className }: { weather?: string; className?: string }) {
  if (!weather) return null;
  const lowerCaseWeather = weather.toLowerCase();
  if (lowerCaseWeather.includes('sun')) return <Sun className={className} />;
  if (lowerCaseWeather.includes('cloud')) return <Cloudy className={className} />;
  if (lowerCaseWeather.includes('rain')) return <CloudRain className={className} />;
  return <Cloudy className={className} />;
}

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const entryDate = new Date(entry.timestamp);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-4xl">{entry.mood.emoji}</CardTitle>
            <CardDescription className="mt-2">{entryDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </div>
          <Badge variant="outline">{entry.mood.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{entry.text || 'No text for this entry.'}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-4">
          {entry.activities.steps && (
            <div className="flex items-center gap-1" title="Steps">
              <Footprints className="h-4 w-4 text-primary" />
              <span>{entry.activities.steps.toLocaleString()}</span>
            </div>
          )}
          {entry.activities.screenTime && (
            <div className="flex items-center gap-1" title="Screen Time">
              <Smartphone className="h-4 w-4 text-primary" />
              <span>{Math.round(entry.activities.screenTime / 60)}h</span>
            </div>
          )}
        </div>
        {entry.weather && (
          <div className="flex items-center gap-1" title="Weather">
            <WeatherIcon weather={entry.weather} className="h-4 w-4 text-primary" />
            <span>{entry.weather}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

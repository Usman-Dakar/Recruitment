import { useState } from 'react';
import { addMonths, format, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCalendarEntries } from '../hooks/useCalendarEntries';
import type { CalendarEntry, CalendarViewMode } from '../types/calendar.types';
import { CalendarGrid } from './CalendarGrid';
import { EntryDetailPanel } from './EntryDetailPanel';
import { NewEntryModal } from './NewEntryModal';

const VIEWS: { id: CalendarViewMode; label: string }[] = [
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [newEntryDate, setNewEntryDate] = useState<Date | null>(null);

  const { data: entries = [] } = useCalendarEntries();

  const prev = () => setCurrentDate(d => subMonths(d, 1));
  const next = () => setCurrentDate(d => addMonths(d, 1));
  const today = () => setCurrentDate(new Date());

  const periodLabel = format(currentDate, 'MMMM yyyy');

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prev} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={next} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>Today</Button>
          <span className="min-w-[140px] text-sm font-semibold text-foreground">{periodLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 w-48 pl-8 text-sm"
              placeholder="Search entries…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex rounded-md border border-border">
            {VIEWS.map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md',
                  view === v.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid + Detail panel side by side */}
      <div className="flex flex-1 overflow-hidden">
        <CalendarGrid
          currentDate={currentDate}
          view={view}
          entries={entries}
          searchQuery={searchQuery}
          onDayClick={date => { setSelectedEntry(null); setNewEntryDate(date); }}
          onEntryClick={entry => { setNewEntryDate(null); setSelectedEntry(entry); }}
        />

        {selectedEntry && (
          <EntryDetailPanel
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </div>

      <NewEntryModal
        open={newEntryDate !== null}
        initialDate={newEntryDate}
        onClose={() => setNewEntryDate(null)}
      />
    </div>
  );
}

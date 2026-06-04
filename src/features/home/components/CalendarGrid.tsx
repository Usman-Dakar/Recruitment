import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarEntry, CalendarViewMode } from '../types/calendar.types';

const ENTRY_COLORS: Record<CalendarEntry['type'], string> = {
  interview: 'bg-primary/15 text-primary',
  evaluation: 'bg-purple-100 text-purple-700',
  meeting: 'bg-blue-100 text-blue-700',
  task: 'bg-amber-100 text-amber-700',
};

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarViewMode;
  entries: CalendarEntry[];
  searchQuery: string;
  onDayClick: (date: Date) => void;
  onEntryClick: (entry: CalendarEntry) => void;
}

export function CalendarGrid({ currentDate, view, entries, searchQuery, onDayClick, onEntryClick }: CalendarGridProps) {
  if (view !== 'month') {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        {view === 'week' ? 'Week' : 'Day'} view — coming in a later step
      </div>
    );
  }

  const filtered = searchQuery
    ? entries.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : entries;

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_HEADERS.map(d => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex flex-col flex-1 divide-y divide-border overflow-y-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 flex-1 divide-x divide-border min-h-[100px]">
            {week.map(day => {
              const dayEntries = filtered.filter(e => isSameDay(e.start, day));
              const visible = dayEntries.slice(0, 2);
              const overflow = dayEntries.length - visible.length;
              const inMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => onDayClick(day)}
                  className={cn(
                    'p-1.5 cursor-pointer hover:bg-muted/50 transition-colors',
                    !inMonth && 'bg-muted/20',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday(day) && 'bg-primary text-primary-foreground',
                      !isToday(day) && inMonth && 'text-foreground',
                      !isToday(day) && !inMonth && 'text-muted-foreground',
                    )}
                  >
                    {format(day, 'd')}
                  </span>

                  <div className="mt-0.5 space-y-0.5">
                    {visible.map(entry => (
                      <button
                        key={entry.id}
                        onClick={e => { e.stopPropagation(); onEntryClick(entry); }}
                        className={cn(
                          'w-full truncate rounded px-1 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-80',
                          ENTRY_COLORS[entry.type],
                        )}
                      >
                        {entry.title}
                      </button>
                    ))}
                    {overflow > 0 && (
                      <p className="px-1 text-[11px] text-muted-foreground">+{overflow} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

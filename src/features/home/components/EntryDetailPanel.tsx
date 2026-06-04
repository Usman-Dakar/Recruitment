import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SlidePanel } from '@/components/ui/slide-panel';
import type { CalendarEntry } from '../types/calendar.types';

const TYPE_LABELS: Record<CalendarEntry['type'], string> = {
  interview: 'Interview', evaluation: 'Evaluation', meeting: 'Meeting', task: 'Task',
};
const TYPE_VARIANTS: Record<CalendarEntry['type'], 'default' | 'info' | 'warning' | 'success'> = {
  interview: 'default', evaluation: 'info', meeting: 'info', task: 'warning',
};

interface EntryDetailPanelProps {
  entry: CalendarEntry;
  onClose: () => void;
}

export function EntryDetailPanel({ entry, onClose }: EntryDetailPanelProps) {
  return (
    <SlidePanel title="Entry details" onClose={onClose}>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{entry.title}</h3>
          <Badge variant={TYPE_VARIANTS[entry.type]} className="mt-1">
            {TYPE_LABELS[entry.type]}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <DetailRow label="Date" value={format(entry.start, 'EEEE, MMMM d, yyyy')} />
          <DetailRow label="Time" value={`${format(entry.start, 'h:mm a')} – ${format(entry.end, 'h:mm a')}`} />
          {entry.candidateName && <DetailRow label="Candidate" value={entry.candidateName} />}
        </div>

        {entry.notes && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{entry.notes}</p>
            </div>
          </>
        )}

        {entry.cvAttached && (
          <>
            <Separator />
            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">CV attached</span>
            </div>
          </>
        )}
      </div>
    </SlidePanel>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

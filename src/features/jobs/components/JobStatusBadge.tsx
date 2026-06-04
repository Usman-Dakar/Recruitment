import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '../types/job.types';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'outline' | 'destructive' | 'warning' | 'info';

const STATUS_CONFIG: Record<JobStatus, { label: string; variant: BadgeVariant }> = {
  draft:     { label: 'Draft',      variant: 'secondary' },
  published: { label: 'Published',  variant: 'default'   },
  listed:    { label: 'Listed',     variant: 'success'   },
  archived:  { label: 'Archived',   variant: 'outline'   },
};

interface JobStatusBadgeProps { status: JobStatus; }

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}

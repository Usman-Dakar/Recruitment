import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useJobs } from '@/features/jobs';
import { useReferrals } from '../hooks';
import type { ReferralStatus } from '../types/general.types';

const STATUS_VARIANT: Record<ReferralStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'secondary',
  in_review: 'outline',
  hired: 'default',
  rejected: 'destructive',
};

const STATUS_LABEL: Record<ReferralStatus, string> = {
  pending: 'Pending',
  in_review: 'In review',
  hired: 'Hired',
  rejected: 'Rejected',
};

export function ReferralPortalSection() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { data: jobsData } = useJobs({});
  const { data: referrals, isLoading: referralsLoading } = useReferrals();

  const referralJobs = jobsData?.data.filter(j => j.referralsEnabled) ?? [];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-semibold">Referral portal</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 py-5 flex flex-col gap-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Jobs with referrals enabled
            </p>
            {referralJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3">
                No jobs have referrals enabled. Go to a job and turn on referrals to enable them.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {referralJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-muted/40 group">
                    <div>
                      <span className="text-sm font-medium">{job.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">{job.department}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs opacity-0 group-hover:opacity-100"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View job
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Referrals I made
            </p>
            {referralsLoading && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            )}
            {!referralsLoading && referrals && referrals.length === 0 && (
              <p className="text-sm text-muted-foreground py-3">You have not made any referrals yet.</p>
            )}
            {!referralsLoading && referrals && referrals.length > 0 && (
              <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
                {referrals.map(ref => (
                  <div key={ref.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{ref.candidateName}</p>
                      <p className="text-xs text-muted-foreground">{ref.jobTitle} · referred by {ref.referredBy}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[ref.status]} className="text-xs shrink-0">
                      {STATUS_LABEL[ref.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                      {formatDistanceToNow(ref.referredAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useTeamMembers } from '../hooks';
import { RoleComparisonPanel } from './RoleComparisonPanel';
import type { TeamRole } from '../types/general.types';

const ROLE_VARIANT: Record<TeamRole, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  recruiter: 'secondary',
  hiring_manager: 'outline',
  viewer: 'outline',
};

const ROLE_LABEL: Record<TeamRole, string> = {
  admin: 'Admin',
  recruiter: 'Recruiter',
  hiring_manager: 'Hiring Manager',
  viewer: 'Viewer',
};

export function TeamMembersSection() {
  const [open, setOpen] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const { data: members, isLoading } = useTeamMembers();

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(p => !p)}
          className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Team members</span>
            {members && <Badge variant="secondary" className="text-xs">{members.length}</Badge>}
          </div>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {open && (
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(p => !p)}
              >
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                {showComparison ? 'Hide' : 'Compare'} roles
              </Button>
            </div>

            {isLoading && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            )}

            {!isLoading && members && (
              <div className="flex flex-col divide-y divide-border">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 py-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{member.avatarInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant={ROLE_VARIANT[member.role]} className="text-xs shrink-0">
                      {ROLE_LABEL[member.role]}
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                      Joined {formatDistanceToNow(member.joinedAt, { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {open && showComparison && <RoleComparisonPanel />}
    </div>
  );
}

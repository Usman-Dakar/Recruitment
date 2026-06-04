import { X, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRolePermissions } from '../hooks';
import type { TeamRole } from '../types/general.types';

const ROLE_LABELS: Record<TeamRole, string> = {
  admin: 'Admin',
  recruiter: 'Recruiter',
  hiring_manager: 'Hiring Manager',
  viewer: 'Viewer',
};

const ROLES: TeamRole[] = ['admin', 'recruiter', 'hiring_manager', 'viewer'];

export function RoleComparisonPanel() {
  const { data: permissions, isLoading } = useRolePermissions();

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-muted/30 border-b border-border">
        <p className="text-sm font-semibold">Role permissions</p>
        <p className="text-xs text-muted-foreground mt-0.5">What each role can do in your workspace</p>
      </div>

      {isLoading && (
        <div className="p-4 flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
        </div>
      )}

      {!isLoading && permissions && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-1/2">Feature</th>
                {ROLES.map(role => (
                  <th key={role} className="text-center px-3 py-2.5 font-medium text-muted-foreground">
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, i) => (
                <tr key={perm.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                  <td className="px-4 py-2.5 text-sm">{perm.feature}</td>
                  {ROLES.map(role => (
                    <td key={role} className="px-3 py-2.5 text-center">
                      {perm[role] ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

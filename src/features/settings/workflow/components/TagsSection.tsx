import { Separator } from '@/components/ui/separator';
import { TagManager } from './TagManager';

export function TagsSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Tags</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage tag libraries used across candidates, pipeline stages, and sources.
        </p>
      </div>

      <TagManager
        type="candidate"
        title="Candidate tags"
        description="Applied to candidate profiles (e.g. React, Senior, Remote-only)."
      />

      <Separator />

      <TagManager
        type="pipeline"
        title="Pipeline tags"
        description="Applied to candidates within a job pipeline (e.g. Fast track, On hold)."
      />

      <Separator />

      <TagManager
        type="source"
        title="Source tags"
        description="Track where candidates originated (e.g. LinkedIn, Referral, Agency)."
      />
    </div>
  );
}

import { useState } from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useCareersPage, useUpdateCareersPage } from '../hooks';
import { SectionEditor } from './SectionEditor';
import type { CareersPage, CareersPageSection } from '../types/templates.types';

const SECTION_LABEL: Record<string, string> = {
  hero: 'Hero banner',
  about: 'About us',
  perks: 'Why work here',
  jobs: 'Open positions',
};

export function CareersPageBuilder() {
  const { data: page, isLoading } = useCareersPage();
  const updateMutation = useUpdateCareersPage();
  const [draft, setDraft] = useState<CareersPage | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const working: CareersPage | null = draft ?? page ?? null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-40" />
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  if (!working) return null;

  function updateSection(updated: CareersPageSection) {
    setDraft(prev => {
      const base = prev ?? page!;
      return { ...base, sections: base.sections.map(s => s.id === updated.id ? updated : s) };
    });
  }

  function handleSave() {
    if (!working) return;
    updateMutation.mutate(working, {
      onSuccess: () => { toast.success('Careers page saved'); setDraft(null); },
      onError: () => toast.error('Failed to save careers page'),
    });
  }

  const isDirty = draft !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">Careers page</h3>
          <p className="text-xs text-muted-foreground">
            Customise the public-facing careers page shown to candidates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={working.published}
              onCheckedChange={(v: boolean) => setDraft(prev => ({ ...(prev ?? page!), published: v }))}
            />
            <Label htmlFor="published" className="text-sm">
              {working.published ? 'Published' : 'Draft'}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={!isDirty || updateMutation.isPending} size="sm">
            Save
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Label className="text-sm shrink-0">Brand colour</Label>
        <input
          type="color"
          value={working.primaryColor}
          onChange={e => setDraft(prev => ({ ...(prev ?? page!), primaryColor: e.target.value }))}
          className="h-8 w-12 cursor-pointer rounded border"
        />
        <span className="text-xs text-muted-foreground font-mono">{working.primaryColor}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">Sections</h4>
        {working.sections.map(section => {
          const isOpen = openSection === section.id;
          return (
            <div key={section.id} className="rounded-lg border bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium flex-1">
                  {SECTION_LABEL[section.type] ?? section.type}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateSection({ ...section, enabled: !section.enabled })}
                  className="text-muted-foreground"
                >
                  {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                >
                  {isOpen ? 'Collapse' : 'Edit'}
                </Button>
              </div>
              {isOpen && (
                <div className="border-t px-4 pb-4">
                  <SectionEditor section={section} onChange={updateSection} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

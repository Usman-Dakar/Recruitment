import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { CareersPageSection } from '../types/templates.types';

interface SectionEditorProps {
  section: CareersPageSection;
  onChange: (updated: CareersPageSection) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  return (
    <div className="flex flex-col gap-3 pt-3">
      {(section.type === 'hero' || section.type === 'about') && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Headline</Label>
            <Input
              value={section.headline ?? ''}
              onChange={e => onChange({ ...section, headline: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Body</Label>
            <Textarea
              value={section.body ?? ''}
              onChange={e => onChange({ ...section, body: e.target.value })}
              rows={3}
            />
          </div>
        </>
      )}
      {section.type === 'perks' && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Headline</Label>
            <Input
              value={section.headline ?? ''}
              onChange={e => onChange({ ...section, headline: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs">Perks</Label>
            {(section.items ?? []).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={e => {
                    const items = [...(section.items ?? [])];
                    items[i] = e.target.value;
                    onChange({ ...section, items });
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const items = (section.items ?? []).filter((_, idx) => idx !== i);
                    onChange({ ...section, items });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="self-start"
              onClick={() => onChange({ ...section, items: [...(section.items ?? []), ''] })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add perk
            </Button>
          </div>
        </>
      )}
      {section.type === 'jobs' && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Headline</Label>
          <Input
            value={section.headline ?? ''}
            onChange={e => onChange({ ...section, headline: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Open positions are pulled automatically from published jobs.
          </p>
        </div>
      )}
    </div>
  );
}

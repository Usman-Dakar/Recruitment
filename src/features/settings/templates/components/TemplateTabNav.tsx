import { cn } from '@/lib/utils';
import type { TemplateTab } from '../types/templates.types';

interface TemplateTabNavProps {
  active: TemplateTab;
  onChange: (tab: TemplateTab) => void;
}

const TABS: { id: TemplateTab; label: string }[] = [
  { id: 'job', label: 'Job templates' },
  { id: 'email', label: 'Email templates' },
  { id: 'questionnaire', label: 'Questionnaires' },
  { id: 'careers', label: 'Careers page' },
];

export function TemplateTabNav({ active, onChange }: TemplateTabNavProps) {
  return (
    <div className="flex gap-1 border-b">
      {TABS.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            active === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

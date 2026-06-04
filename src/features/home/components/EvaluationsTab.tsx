import { useState } from 'react';
import { useEvaluations } from '../hooks/useEvaluations';
import type { Evaluation } from '../types/evaluation.types';
import { DismissedTable } from './DismissedTable';
import { EvaluationList } from './EvaluationList';
import { EvaluationPanel } from './EvaluationPanel';

export function EvaluationsTab() {
  const { data: all = [], isLoading } = useEvaluations();
  const [selected, setSelected] = useState<{ evaluation: Evaluation; index: number } | null>(null);

  const requested = all.filter(e => e.status === 'requested');
  const dismissed = all.filter(e => e.status === 'dismissed');

  const handleSelect = (evaluation: Evaluation, index: number) => {
    setSelected({ evaluation, index });
  };

  const handleComplete = () => {
    if (!selected) return;
    const next = requested.find((_, i) => i > selected.index);
    if (next) {
      const nextIndex = requested.indexOf(next);
      setSelected({ evaluation: next, index: nextIndex });
    } else {
      setSelected(null);
    }
  };

  // Refresh selected evaluation from latest data
  const liveSelected = selected
    ? (all.find(e => e.id === selected.evaluation.id) ?? null)
    : null;

  if (liveSelected && selected) {
    return (
      <EvaluationPanel
        evaluation={liveSelected}
        onBack={() => setSelected(null)}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Evaluations</h2>
          <p className="text-xs text-muted-foreground">
            {requested.length} pending · click to review
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        <EvaluationList
          evaluations={requested}
          isLoading={isLoading}
          onSelect={handleSelect}
        />
        <DismissedTable evaluations={dismissed} />
      </div>
    </div>
  );
}

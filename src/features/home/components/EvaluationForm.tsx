import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCompleteEvaluation, useEvaluationNotes } from '../hooks/useEvaluationMutations';
import type { Evaluation } from '../types/evaluation.types';
import { AddTaskModal } from './AddTaskModal';

interface EvaluationFormProps {
  evaluation: Evaluation;
  onComplete: () => void;
}

export function EvaluationForm({ evaluation, onComplete }: EvaluationFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(evaluation.questions.map(q => [q.id, q.answer])),
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const { mutate: complete, isPending: completing } = useCompleteEvaluation();
  const { add: addNote, remove: removeNote } = useEvaluationNotes(evaluation.id);

  const handleComplete = () => {
    complete(evaluation.id, {
      onSuccess: () => { toast.success('Evaluation completed. Moving to next candidate.'); onComplete(); },
      onError: () => toast.error('Failed to complete evaluation'),
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote.mutate(newNote.trim(), {
      onSuccess: () => setNewNote(''),
      onError: () => toast.error('Failed to add note'),
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Template header */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Template</p>
        <p className="text-sm font-semibold text-foreground">{evaluation.template}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Interview questions */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Interview Questions
          </p>
          {evaluation.questions.map(q => (
            <div key={q.id} className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">{q.question}</p>
              <textarea
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
                placeholder="Enter your assessment…"
                value={answers[q.id] ?? ''}
                onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* More Details */}
        <div className="rounded-md border border-border">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
            onClick={() => setDetailsOpen(v => !v)}
          >
            More Details
            {detailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {detailsOpen && (
            <div className="border-t border-border px-4 py-3 space-y-1 text-sm text-muted-foreground">
              <p>Position: <span className="text-foreground">{evaluation.candidate.position}</span></p>
              <p>Job: <span className="text-foreground">{evaluation.jobTitle}</span></p>
              <p>Requested by: <span className="text-foreground">{evaluation.requestedBy}</span></p>
            </div>
          )}
        </div>

        <Separator />

        {/* Notes */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
          {evaluation.notes.map(note => (
            <div key={note.id} className="rounded-md border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">{note.authorName}</p>
                  <p className="text-xs text-muted-foreground">{format(note.createdAt, 'MMM d, yyyy')}</p>
                </div>
                <button
                  onClick={() => removeNote.mutate(note.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-foreground">{note.content}</p>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Add a note…"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            />
            <Button size="sm" variant="outline" onClick={handleAddNote} disabled={addNote.isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-4 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setTaskModalOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add task
        </Button>
        <Button onClick={handleComplete} disabled={completing}>
          {completing ? 'Completing…' : 'Move to next step'}
        </Button>
      </div>

      <AddTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        evaluationId={evaluation.id}
        candidateId={evaluation.candidate.id}
        candidateName={evaluation.candidate.name}
      />
    </div>
  );
}

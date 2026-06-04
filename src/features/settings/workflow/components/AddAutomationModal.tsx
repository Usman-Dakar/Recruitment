import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddAutomation } from '../hooks';
import type { AutomationTrigger, AutomationAction } from '../types/workflow.types';

const TRIGGER_OPTIONS: { value: AutomationTrigger; label: string }[] = [
  { value: 'stage_entered', label: 'Stage entered' },
  { value: 'stage_left', label: 'Stage left' },
  { value: 'evaluation_completed', label: 'Evaluation completed' },
  { value: 'offer_sent', label: 'Offer sent' },
];

const ACTION_OPTIONS: { value: AutomationAction; label: string }[] = [
  { value: 'send_email', label: 'Send email' },
  { value: 'create_task', label: 'Create task' },
  { value: 'send_notification', label: 'Send notification' },
  { value: 'move_to_stage', label: 'Move to next stage' },
];

const schema = z.object({
  trigger: z.enum(['stage_entered', 'stage_left', 'evaluation_completed', 'offer_sent']),
  action: z.enum(['send_email', 'create_task', 'send_notification', 'move_to_stage']),
});

type FormValues = z.infer<typeof schema>;

interface AddAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageId: string;
  stageName: string;
}

export function AddAutomationModal({ open, onOpenChange, stageId, stageName }: AddAutomationModalProps) {
  const addMutation = useAddAutomation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { trigger: 'stage_entered', action: 'send_notification' },
  });

  function onSubmit(values: FormValues) {
    addMutation.mutate(
      { stageId, trigger: values.trigger, action: values.action },
      {
        onSuccess: () => {
          toast.success('Automation added');
          form.reset();
          onOpenChange(false);
        },
        onError: () => toast.error('Failed to add automation'),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add automation to "{stageName}"</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>When (trigger)</Label>
            <Select
              value={form.watch('trigger')}
              onValueChange={v => form.setValue('trigger', v as AutomationTrigger)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Then (action)</Label>
            <Select
              value={form.watch('action')}
              onValueChange={v => form.setValue('action', v as AutomationAction)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={addMutation.isPending}>Add automation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTask } from '../hooks/useTaskMutations';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in_progress', 'done']),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  evaluationId?: string;
  candidateId?: string;
  candidateName?: string;
}

export function AddTaskModal({ open, onClose, evaluationId, candidateId, candidateName }: AddTaskModalProps) {
  const { mutate: createTask, isPending } = useCreateTask();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium', status: 'todo' },
  });

  const onSubmit = (values: FormValues) => {
    createTask(
      {
        title: values.title,
        status: values.status,
        priority: values.priority,
        ...(values.dueDate ? { dueDate: values.dueDate } : {}),
        ...(evaluationId ? { evaluationId } : {}),
        ...(candidateId ? { candidateId } : {}),
        ...(candidateName ? { candidateName } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Task added');
          reset();
          onClose();
        },
        onError: () => toast.error('Failed to create task'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add task{candidateName ? ` — ${candidateName}` : ''}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task</Label>
            <Input id="task-title" placeholder="e.g. Send assessment" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select defaultValue="medium" onValueChange={v => setValue('priority', v as FormValues['priority'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select defaultValue="todo" onValueChange={v => setValue('status', v as FormValues['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-due">Due date (optional)</Label>
            <Input id="task-due" type="date" {...register('dueDate')} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Adding…' : 'Add task'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

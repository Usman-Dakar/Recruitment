import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCalendarEntry } from '../hooks/useCreateCalendarEntry';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  startTime: z.string().min(1, 'Required'),
  endTime: z.string().min(1, 'Required'),
  type: z.enum(['interview', 'evaluation', 'meeting', 'task']),
  notes: z.string().optional(),
  requestInterview: z.boolean(),
  requestEvaluation: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface NewEntryModalProps {
  open: boolean;
  initialDate: Date | null;
  onClose: () => void;
}

export function NewEntryModal({ open, initialDate, onClose }: NewEntryModalProps) {
  const { mutate: createEntry, isPending } = useCreateCalendarEntry();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        type: 'meeting',
        requestInterview: false,
        requestEvaluation: false,
      },
    });

  useEffect(() => {
    if (initialDate) {
      reset({
        date: format(initialDate, 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '10:00',
        type: 'meeting',
        requestInterview: false,
        requestEvaluation: false,
        title: '',
        notes: '',
      });
    }
  }, [initialDate, reset]);

  const requestEvaluation = watch('requestEvaluation');
  const heading = requestEvaluation ? 'Request Evaluation' : 'New Entry';

  const onSubmit = (values: FormValues) => {
    const input = {
      title: values.title,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      type: values.type,
      requestInterview: values.requestInterview,
      requestEvaluation: values.requestEvaluation,
      ...(values.notes ? { notes: values.notes } : {}),
    };
    createEntry(input, {
      onSuccess: () => {
        toast.success('Entry added to calendar');
        onClose();
      },
      onError: () => toast.error('Failed to create entry'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Interview — Jane Doe" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                defaultValue="meeting"
                onValueChange={v => setValue('type', v as FormValues['type'])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="evaluation">Evaluation</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Start time</Label>
              <Input id="startTime" type="time" {...register('startTime')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">End time</Label>
              <Input id="endTime" type="time" {...register('endTime')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes…" {...register('notes')} />
          </div>

          <div className="space-y-2 rounded-md border border-border p-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" {...register('requestInterview')} />
              Schedule interview
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded" {...register('requestEvaluation')} />
              Request evaluation
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreateJob } from '../hooks/useJobMutations';
import { useJobTemplates } from '@/features/settings/templates';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  department: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  type: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  description: z.string().optional(),
  requirements: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const TYPE_OPTIONS: { value: FormValues['type']; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const TYPE_LABEL: Record<string, string> = {
  full_time: 'Full-time', part_time: 'Part-time',
  contract: 'Contract', internship: 'Internship',
};

interface CreateJobModalProps { open: boolean; onClose: () => void; }

export function CreateJobModal({ open, onClose }: CreateJobModalProps) {
  const [mode, setMode] = useState<'scratch' | 'template'>('scratch');
  const { mutate: createJob, isPending } = useCreateJob();
  const { data: jobTemplates, isLoading: templatesLoading } = useJobTemplates();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'full_time' },
  });
  const type = watch('type');

  const onSubmit = (values: FormValues) => {
    createJob({
      title: values.title,
      department: values.department,
      location: values.location,
      type: values.type,
      ...(values.description ? { description: values.description } : {}),
      ...(values.requirements ? { requirements: values.requirements } : {}),
    }, { onSuccess: () => { reset(); onClose(); } });
  };

  const handleClose = () => { reset(); setMode('scratch'); onClose(); };

  function applyTemplate(tpl: NonNullable<typeof jobTemplates>[number]) {
    reset({
      title: tpl.title,
      department: tpl.department,
      type: tpl.type as FormValues['type'],
      location: '',
      description: tpl.description,
      requirements: tpl.requirements,
    });
    setMode('scratch');
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create Job</DialogTitle></DialogHeader>

        {/* Mode toggle */}
        <div className="flex rounded-md border border-border">
          {(['scratch', 'template'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn(
                'flex-1 py-2 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md',
                mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
              )}>
              {m === 'scratch' ? 'From scratch' : 'From template'}
            </button>
          ))}
        </div>

        {/* Template picker */}
        {mode === 'template' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Select a template to pre-fill the job form. You can edit all fields before creating.
            </p>

            {templatesLoading && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            )}

            {!templatesLoading && (!jobTemplates || jobTemplates.length === 0) && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No job templates yet.</p>
                <p className="text-xs text-muted-foreground">
                  Create templates in Settings → Templates.
                </p>
              </div>
            )}

            {!templatesLoading && jobTemplates && jobTemplates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{tpl.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {TYPE_LABEL[tpl.type] ?? tpl.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{tpl.department}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Scratch / pre-filled form */}
        {mode === 'scratch' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Input placeholder="e.g. Senior Frontend Engineer" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input placeholder="e.g. Engineering" {...register('department')} />
                {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input placeholder="e.g. Remote" {...register('location')} />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={v => setValue('type', v as FormValues['type'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea placeholder="Role overview…" rows={3} className="resize-none text-sm" {...register('description')} />
            </div>
            <div className="space-y-1.5">
              <Label>Requirements <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea placeholder="Skills and experience…" rows={3} className="resize-none text-sm" {...register('requirements')} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Creating…' : 'Create job'}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

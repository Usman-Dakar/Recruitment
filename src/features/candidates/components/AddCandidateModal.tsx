import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCreateCandidate } from '../hooks/useCandidateMutations';
import type { CandidateOrigin } from '../types/candidate.types';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Required'),
  origin: z.enum(['direct', 'referral', 'linkedin', 'job_board', 'agency']),
  referredBy: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const ORIGIN_OPTIONS: { value: string; label: string }[] = [
  { value: 'direct', label: 'Direct' },
  { value: 'referral', label: 'Referred' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'job_board', label: 'Job Board' },
  { value: 'agency', label: 'Agency' },
];

interface AddCandidateModalProps { open: boolean; onClose: () => void; }

export function AddCandidateModal({ open, onClose }: AddCandidateModalProps) {
  const [mode, setMode] = useState<'manual' | 'upload'>('manual');
  const [parsing, setParsing] = useState(false);
  const { mutate: createCandidate, isPending } = useCreateCandidate();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { origin: 'direct' },
  });
  const origin = watch('origin');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setParsing(true);
    setTimeout(() => {
      setValue('name', 'Alex Rivera'); setValue('email', 'alex.rivera@example.com');
      setValue('position', 'Full Stack Developer'); setValue('origin', 'linkedin');
      setParsing(false); setMode('manual');
    }, 1500);
  };

  const onSubmit = (values: FormValues) => {
    createCandidate({
      name: values.name, email: values.email, position: values.position,
      origin: values.origin as CandidateOrigin,
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.referredBy ? { referredBy: values.referredBy } : {}),
    }, { onSuccess: () => { reset(); onClose(); } });
  };

  const handleClose = () => { reset(); setParsing(false); setMode('manual'); onClose(); };

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Candidate</DialogTitle></DialogHeader>

        <div className="flex rounded-md border border-border">
          {(['manual', 'upload'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn('flex-1 py-2 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md',
                mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
              {m === 'manual' ? 'Manual entry' : 'Upload CV'}
            </button>
          ))}
        </div>

        {mode === 'upload' && (
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-8 hover:border-primary transition-colors">
            {parsing ? <><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="text-sm text-muted-foreground">Parsing CV…</p></> : <><Upload className="h-8 w-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Click to select a CV file</p><p className="text-xs text-muted-foreground">Fields will be auto-populated</p></>}
            <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={handleFileChange} />
          </label>
        )}

        {mode === 'manual' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input placeholder="Full name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="email@co.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Input placeholder="Job title" {...register('position')} />
                {errors.position && <p className="text-xs text-destructive">{errors.position.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input placeholder="+1 555…" {...register('phone')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Origin</Label>
              <Select value={origin} onValueChange={v => setValue('origin', v as FormValues['origin'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ORIGIN_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {origin === 'referral' && (
              <div className="space-y-1.5">
                <Label>Referred by</Label>
                <Input placeholder="Referrer's name" {...register('referredBy')} />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Adding…' : 'Add candidate'}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

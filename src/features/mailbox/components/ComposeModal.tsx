import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendEmail } from '../hooks/useMailboxMutations';

const schema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message is required'),
});
type FormValues = z.infer<typeof schema>;

interface ComposeModalProps { open: boolean; onClose: () => void; }

export function ComposeModal({ open, onClose }: ComposeModalProps) {
  const { mutate: sendEmail, isPending } = useSendEmail();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    sendEmail(values, { onSuccess: () => { reset(); onClose(); } });
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label>To</Label>
            <Input type="email" placeholder="recipient@email.com" {...register('to')} />
            {errors.to && <p className="text-xs text-destructive">{errors.to.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input placeholder="Subject" {...register('subject')} />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea placeholder="Write your message…" rows={6} className="resize-none text-sm" {...register('body')} />
            {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" type="button" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              {isPending ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

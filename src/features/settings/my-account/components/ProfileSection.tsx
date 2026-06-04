import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyProfile, useUpdateProfile } from '../hooks';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  language: z.string().min(1),
  timezone: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
];

const TIMEZONES = [
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'America/New_York', label: 'New York (ET)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
];

export function ProfileSection() {
  const { data: profile, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', jobTitle: '', department: '', language: 'en', timezone: 'Europe/London' },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phone: profile.phone ?? '',
        jobTitle: profile.jobTitle ?? '',
        department: profile.department ?? '',
        language: profile.language,
        timezone: profile.timezone,
      });
    }
  }, [profile, form]);

  function onSubmit(values: FormValues) {
    updateMutation.mutate(
      {
        name: values.name,
        ...(values.phone ? { phone: values.phone } : {}),
        ...(values.jobTitle ? { jobTitle: values.jobTitle } : {}),
        ...(values.department ? { department: values.department } : {}),
        language: values.language,
        timezone: values.timezone,
      },
      {
        onSuccess: () => toast.success('Profile updated'),
        onError: () => toast.error('Failed to update profile'),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xl font-semibold text-primary">{profile?.avatarInitials}</span>
        </div>
        <div>
          <p className="font-medium">{profile?.name}</p>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Full name *</Label>
          <Input {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Email</Label>
          <Input value={profile?.email ?? ''} disabled className="bg-muted" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Phone</Label>
          <Input {...form.register('phone')} placeholder="+44 7700 000000" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Job title</Label>
          <Input {...form.register('jobTitle')} placeholder="e.g. Head of Talent" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Department</Label>
          <Input {...form.register('department')} placeholder="e.g. People & Talent" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Language</Label>
          <Select
            value={form.watch('language')}
            onValueChange={v => form.setValue('language', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(l => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Timezone</Label>
          <Select
            value={form.watch('timezone')}
            onValueChange={v => form.setValue('timezone', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map(tz => (
                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={updateMutation.isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

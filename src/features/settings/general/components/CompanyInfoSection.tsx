import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanyInfo, useUpdateCompany } from '../hooks';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  website: z.string().optional(),
  industry: z.string().min(1, 'Required'),
  size: z.string().min(1, 'Required'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const INDUSTRY_OPTIONS = ['Software / SaaS', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Other'];
const SIZE_OPTIONS = ['1–10', '11–50', '51–200', '201–500', '500+'];

export function CompanyInfoSection() {
  const [open, setOpen] = useState(true);
  const { data: company, isLoading } = useCompanyInfo();
  const updateMutation = useUpdateCompany();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', website: '', industry: '', size: '', address: '', city: '', country: '' },
  });

  useEffect(() => {
    if (company) form.reset(company);
  }, [company, form]);

  function onSubmit(values: FormValues) {
    updateMutation.mutate(
      {
        name: values.name,
        website: values.website ?? '',
        industry: values.industry,
        size: values.size,
        address: values.address ?? '',
        city: values.city ?? '',
        country: values.country ?? '',
      },
      {
        onSuccess: () => toast.success('Company info saved'),
        onError: () => toast.error('Save failed'),
      },
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <span className="text-sm font-semibold">Company information</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 py-5">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Company name *</Label>
                  <Input {...form.register('name')} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Website</Label>
                  <Input {...form.register('website')} placeholder="https://example.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Industry *</Label>
                  <Select value={form.watch('industry')} onValueChange={v => form.setValue('industry', v)}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>{INDUSTRY_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Company size *</Label>
                  <Select value={form.watch('size')} onValueChange={v => form.setValue('size', v)}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>{SIZE_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Address</Label>
                  <Input {...form.register('address')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>City</Label>
                  <Input {...form.register('city')} />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <Label>Country</Label>
                  <Input {...form.register('country')} className="max-w-xs" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>Save changes</Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

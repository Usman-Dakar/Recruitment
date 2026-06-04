import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerify2FA } from '../hooks/useVerify2FA';

const schema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
});

type FormValues = z.infer<typeof schema>;

interface TwoFactorFormProps {
  tempToken: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function TwoFactorForm({ tempToken, onBack, onSuccess }: TwoFactorFormProps) {
  const { mutate: verify, isPending, error } = useVerify2FA();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    verify({ code: values.code, tempToken }, { onSuccess });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">Two-factor authentication</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="code">Authentication code</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
            className="tracking-[0.5em] text-center font-mono text-lg"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-xs text-destructive">{errors.code.message}</p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Demo hint: use code <span className="font-mono font-semibold text-foreground">000000</span>
        </p>

        {error && (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Verifying…' : 'Verify'}
        </Button>
      </form>
    </div>
  );
}

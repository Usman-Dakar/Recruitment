import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthLayout,
  ChatbotWidget,
  LoginForm,
  LoginLanding,
  TwoFactorForm,
} from '@/features/auth';

type Step = 'landing' | 'login' | '2fa';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('landing');
  const [tempToken, setTempToken] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    setTempToken(token);
    setStep('2fa');
  };

  const handle2FASuccess = () => {
    navigate('/home', { replace: true });
  };

  return (
    <>
      <AuthLayout>
        {step === 'landing' && (
          <LoginLanding onUsernameLogin={() => setStep('login')} />
        )}
        {step === 'login' && (
          <LoginForm
            onBack={() => setStep('landing')}
            onSuccess={handleLoginSuccess}
          />
        )}
        {step === '2fa' && (
          <TwoFactorForm
            tempToken={tempToken}
            onBack={() => setStep('login')}
            onSuccess={handle2FASuccess}
          />
        )}
      </AuthLayout>
      <ChatbotWidget />
    </>
  );
}

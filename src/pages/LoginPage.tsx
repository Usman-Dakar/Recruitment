import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { inputClass, errClass } from '@/lib/formStyles'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import type { LoginFormData, RegisterFormData } from '@/types'

type Tab = 'login' | 'register'

/* ── Zod schemas ── */
const loginSchema = z.object({
  UserName: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
  pass:     z.string().min(1, 'Password is required.'),
  remember: z.boolean(),
})

const registerSchema = z.object({
  FirstName:   z.string().min(1, 'First name is required.'),
  LastName:    z.string().min(1, 'Last name is required.'),
  DisplayName: z.string().min(1, 'Display name is required.'),
  Email:       z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
})

/* ── Login tab ── */
function LoginTab() {
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setUser = useAuthStore((s) => s.setUser)
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), defaultValues: { remember: false } })

  const onSubmit = async (data: LoginFormData) => {
    await new Promise<void>((r) => setTimeout(r, 600))

    const emailLocal = data.UserName.split('@')[0]
    const parts = emailLocal.split('.')
    const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    const lastName = parts.length > 1 ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : ''

    const mockUser = {
      luid: 1,
      firstName,
      lastName,
      displayName: emailLocal,
      email: data.UserName,
    }

    setUser(mockUser)
    updatePersonalInfo({ firstName, lastName, email: data.UserName })

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      <div>
        <label htmlFor="UserName" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          id="UserName"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('UserName')}
          className={inputClass}
          aria-describedby={errors.UserName ? 'login-email-err' : undefined}
        />
        {errors.UserName && <p id="login-email-err" className={errClass}>{errors.UserName.message}</p>}
      </div>

      <div>
        <label htmlFor="pass" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="pass"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('pass')}
            className={inputClass + ' pr-10'}
            aria-describedby={errors.pass ? 'login-pass-err' : undefined}
          />
          <button
            type="button"
            aria-label={showPass ? 'Hide password' : 'Show password'}
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.pass && <p id="login-pass-err" className={errClass}>{errors.pass.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('remember')}
            className="w-4 h-4 rounded bg-surface-700 border-white/20 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-slate-400">Save Password</span>
        </label>
        <button
          type="button"
          className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        id="login_btn_ctrl"
        disabled={isSubmitting}
        className="w-full py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}

/* ── Register tab ── */
function RegisterTab() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (_data: RegisterFormData) => {
    await new Promise<void>((r) => setTimeout(r, 600))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="py-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto">
          <Briefcase className="w-7 h-7 text-brand-400" aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-slate-100">Account Created!</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto">
          Please check your email for instructions to set up your password and activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="FirstName" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
            First Name
          </label>
          <input
            id="FirstName"
            type="text"
            autoComplete="given-name"
            placeholder="First Name"
            {...register('FirstName')}
            className={inputClass}
          />
          {errors.FirstName && <p className={errClass}>{errors.FirstName.message}</p>}
        </div>
        <div>
          <label htmlFor="LastName" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
            Last Name
          </label>
          <input
            id="LastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last Name"
            {...register('LastName')}
            className={inputClass}
          />
          {errors.LastName && <p className={errClass}>{errors.LastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="DisplayName" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Display Name
        </label>
        <input
          id="DisplayName"
          type="text"
          autoComplete="nickname"
          placeholder="Display Name"
          {...register('DisplayName')}
          className={inputClass}
        />
        {errors.DisplayName && <p className={errClass}>{errors.DisplayName.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('Email')}
          className={inputClass}
        />
        {errors.Email && <p className={errClass}>{errors.Email.message}</p>}
      </div>

      <p className="text-xs text-slate-500">
        By clicking &lsquo;Sign up&rsquo;, you agree to our{' '}
        <a href="/terms" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
          terms of service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
          privacy policy
        </a>
        .
      </p>

      <button
        id="signUpBtn"
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>
  )
}

/* ── Page ── */
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>('login')

  useEffect(() => {
    if (window.location.hash === '#register') setActiveTab('register')
  }, [])

  return (
    <div className="min-h-[calc(100svh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="gradient-text">AX Jobs</span>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden glow-brand">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {(['login', 'register'] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-3.5 text-sm font-semibold capitalize transition-colors',
                  activeTab === tab
                    ? 'text-brand-400 border-b-2 border-brand-500'
                    : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent',
                )}
              >
                {tab === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'login' ? <LoginTab /> : <RegisterTab />}

            {activeTab === 'login' && (
              <p className="mt-5 text-center text-sm text-slate-500">
                New to site?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                  Create Account
                </button>
              </p>
            )}

            {activeTab === 'register' && (
              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

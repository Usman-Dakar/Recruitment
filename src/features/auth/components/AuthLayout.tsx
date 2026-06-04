interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      {/* Left panel — form area */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-8 lg:w-[60%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Right panel — brand/product showcase */}
      <div className="hidden flex-col justify-between bg-[hsl(var(--auth-panel))] px-10 py-12 lg:flex lg:w-[40%]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            HR Platform
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            One platform for your entire talent journey
          </h2>
        </div>

        <div className="space-y-4">
          {/* Recruitee ATS card */}
          <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                R
              </div>
              <span className="text-sm font-semibold text-white">Recruitee ATS</span>
            </div>
            <p className="text-xs text-white/70">
              Attract, hire and onboard talent with one collaborative recruiting platform.
            </p>
          </div>

          {/* HR HRIS card */}
          <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/20 text-xs font-bold text-white">
                H
              </div>
              <span className="text-sm font-semibold text-white">HR HRIS</span>
            </div>
            <p className="text-xs text-white/70">
              Manage your workforce with powerful HR tools built for modern teams.
            </p>
          </div>
        </div>

        <p className="text-xs font-semibold text-white/40">tellent</p>
      </div>
    </div>
  );
}

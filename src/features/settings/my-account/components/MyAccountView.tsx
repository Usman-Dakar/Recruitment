import { Separator } from '@/components/ui/separator';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';
import { NotificationPrefsSection } from './NotificationPrefsSection';

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

export function MyAccountView() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">
      <h1 className="text-xl font-semibold">My Account</h1>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Profile"
          description="Update your name, contact details, and regional preferences."
        />
        <ProfileSection />
      </section>

      <Separator />

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Password"
          description="Change your login password. Use at least 8 characters."
        />
        <PasswordSection />
      </section>

      <Separator />

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Notification preferences"
          description="Choose how you are notified about activity in your workspace."
        />
        <NotificationPrefsSection />
      </section>
    </div>
  );
}

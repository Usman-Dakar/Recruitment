import { CompanyInfoSection } from './CompanyInfoSection';
import { LocationsSection } from './LocationsSection';
import { TeamMembersSection } from './TeamMembersSection';
import { ReferralPortalSection } from './ReferralPortalSection';

export function GeneralSettingsView() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">General</h1>
      <CompanyInfoSection />
      <LocationsSection />
      <TeamMembersSection />
      <ReferralPortalSection />
    </div>
  );
}

export type TeamRole = 'admin' | 'recruiter' | 'hiring_manager' | 'viewer';

export type ReferralStatus = 'pending' | 'in_review' | 'hired' | 'rejected';

export interface CompanyInfo {
  name: string;
  website: string;
  industry: string;
  size: string;
  address: string;
  city: string;
  country: string;
}

export interface Location {
  id: string;
  name: string;
  isHeadquarters: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarInitials: string;
  joinedAt: Date;
}

export interface RolePermission {
  feature: string;
  admin: boolean;
  recruiter: boolean;
  hiring_manager: boolean;
  viewer: boolean;
}

export interface Referral {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  referredBy: string;
  referredAt: Date;
  status: ReferralStatus;
}

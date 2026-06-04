import { subDays } from 'date-fns';
import type {
  CompanyInfo,
  Location,
  TeamMember,
  RolePermission,
  Referral,
} from '../types/general.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /settings/general/company
let MOCK_COMPANY: CompanyInfo = {
  name: 'Dakar Technologies',
  website: 'https://dakar.io',
  industry: 'Software / SaaS',
  size: '51–200',
  address: '12 Fintech Square',
  city: 'London',
  country: 'United Kingdom',
};

// TODO: replace with API — GET /settings/general/locations
// Note: locations are auto-added when a job is created with a new location (cross-module rule)
let MOCK_LOCATIONS: Location[] = [
  { id: 'loc1', name: 'London', isHeadquarters: true },
  { id: 'loc2', name: 'New York', isHeadquarters: false },
  { id: 'loc3', name: 'Berlin', isHeadquarters: false },
  { id: 'loc4', name: 'Paris', isHeadquarters: false },
  { id: 'loc5', name: 'Remote', isHeadquarters: false },
];

// TODO: replace with API — GET /settings/general/team
const MOCK_TEAM: TeamMember[] = [
  { id: 'u1', name: 'Anas Khan', email: 'anas.khan@dakar.io', role: 'admin', avatarInitials: 'AK', joinedAt: new Date('2026-01-01') },
  { id: 'u2', name: 'Maria Garcia', email: 'maria.garcia@dakar.io', role: 'recruiter', avatarInitials: 'MG', joinedAt: new Date('2026-02-10') },
  { id: 'u3', name: 'James Osei', email: 'james.osei@dakar.io', role: 'hiring_manager', avatarInitials: 'JO', joinedAt: new Date('2026-03-05') },
  { id: 'u4', name: 'Sophie Chen', email: 'sophie.chen@dakar.io', role: 'recruiter', avatarInitials: 'SC', joinedAt: new Date('2026-03-20') },
  { id: 'u5', name: 'Ravi Patel', email: 'ravi.patel@dakar.io', role: 'viewer', avatarInitials: 'RP', joinedAt: new Date('2026-04-15') },
];

// TODO: replace with API — GET /settings/general/role-permissions
const MOCK_PERMISSIONS: RolePermission[] = [
  { feature: 'View candidates',        admin: true,  recruiter: true,  hiring_manager: true,  viewer: true  },
  { feature: 'Create / edit candidates', admin: true, recruiter: true, hiring_manager: false, viewer: false },
  { feature: 'Delete candidates',      admin: true,  recruiter: false, hiring_manager: false, viewer: false },
  { feature: 'View jobs',              admin: true,  recruiter: true,  hiring_manager: true,  viewer: true  },
  { feature: 'Create / edit jobs',     admin: true,  recruiter: true,  hiring_manager: false, viewer: false },
  { feature: 'Publish / archive jobs', admin: true,  recruiter: false, hiring_manager: false, viewer: false },
  { feature: 'Run evaluations',        admin: true,  recruiter: true,  hiring_manager: true,  viewer: false },
  { feature: 'View analytics',         admin: true,  recruiter: true,  hiring_manager: false, viewer: false },
  { feature: 'Manage settings',        admin: true,  recruiter: false, hiring_manager: false, viewer: false },
  { feature: 'Invite team members',    admin: true,  recruiter: false, hiring_manager: false, viewer: false },
];

// TODO: replace with API — GET /settings/general/referrals
const MOCK_REFERRALS: Referral[] = [
  { id: 'ref1', jobId: 'j1', jobTitle: 'Senior Frontend Engineer', candidateName: 'Priya Nair', referredBy: 'Maria Garcia', referredAt: subDays(new Date(), 10), status: 'in_review' },
  { id: 'ref2', jobId: 'j4', jobTitle: 'Backend Engineer', candidateName: 'Lucas Becker', referredBy: 'Anas Khan', referredAt: subDays(new Date(), 20), status: 'hired' },
  { id: 'ref3', jobId: 'j6', jobTitle: 'Marketing Lead', candidateName: 'Zara Ahmed', referredBy: 'James Osei', referredAt: subDays(new Date(), 5), status: 'pending' },
];

export const mockGeneralService = {
  getCompany: async (): Promise<CompanyInfo> => {
    await delay(250);
    return { ...MOCK_COMPANY };
  },

  updateCompany: async (input: CompanyInfo): Promise<CompanyInfo> => {
    await delay(400);
    MOCK_COMPANY = { ...input };
    return { ...MOCK_COMPANY };
  },

  getLocations: async (): Promise<Location[]> => {
    await delay(200);
    return [...MOCK_LOCATIONS];
  },

  // TODO: replace with API — POST /settings/general/locations
  addLocation: async (name: string): Promise<Location> => {
    await delay(300);
    const loc: Location = { id: `loc${Date.now()}`, name, isHeadquarters: false };
    MOCK_LOCATIONS = [...MOCK_LOCATIONS, loc];
    return loc;
  },

  // TODO: replace with API — DELETE /settings/general/locations/:id
  deleteLocation: async (id: string): Promise<void> => {
    await delay(200);
    MOCK_LOCATIONS = MOCK_LOCATIONS.filter(l => l.id !== id);
  },

  getTeam: async (): Promise<TeamMember[]> => {
    await delay(250);
    return [...MOCK_TEAM];
  },

  getRolePermissions: async (): Promise<RolePermission[]> => {
    await delay(150);
    return [...MOCK_PERMISSIONS];
  },

  getReferrals: async (): Promise<Referral[]> => {
    await delay(200);
    return [...MOCK_REFERRALS];
  },
};

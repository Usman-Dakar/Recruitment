import { subDays, subHours } from 'date-fns';
import type {
  AcquisitionSource,
  AcquisitionEntry,
  ImportCandidatesInput,
} from '../types/acquisitions.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const now = new Date();

// TODO: replace with API — GET /acquisitions/sources
let MOCK_SOURCES: AcquisitionSource[] = [
  {
    id: 'src1',
    name: 'LinkedIn',
    type: 'linkedin',
    isActive: true,
    totalCount: 31,
    thisMonthCount: 8,
    conversionRate: 9.7,
    lastActivityAt: subHours(now, 3),
  },
  {
    id: 'src2',
    name: 'Indeed',
    type: 'job_board',
    isActive: true,
    totalCount: 17,
    thisMonthCount: 4,
    conversionRate: 5.9,
    lastActivityAt: subDays(now, 1),
  },
  {
    id: 'src3',
    name: 'Agency Partner — Hays',
    type: 'agency',
    isActive: true,
    totalCount: 4,
    thisMonthCount: 1,
    conversionRate: 25.0,
    lastActivityAt: subDays(now, 3),
  },
  {
    id: 'src4',
    name: 'Referral Portal',
    type: 'referral',
    isActive: true,
    totalCount: 13,
    thisMonthCount: 3,
    conversionRate: 15.4,
    lastActivityAt: subDays(now, 2),
  },
  {
    id: 'src5',
    name: 'Company Website',
    type: 'direct',
    isActive: true,
    totalCount: 22,
    thisMonthCount: 5,
    conversionRate: 4.5,
    lastActivityAt: subHours(now, 12),
  },
  {
    id: 'src6',
    name: 'Twitter / X',
    type: 'social',
    isActive: false,
    totalCount: 2,
    thisMonthCount: 0,
    conversionRate: 0,
    lastActivityAt: subDays(now, 30),
  },
];

// TODO: replace with API — GET /acquisitions/entries
let MOCK_ENTRIES: AcquisitionEntry[] = [
  { id: 'ae1', sourceId: 'src1', sourceName: 'LinkedIn', name: 'David Park', email: 'david.park@email.com', position: 'Frontend Engineer', importedAt: subHours(now, 3), status: 'added' },
  { id: 'ae2', sourceId: 'src1', sourceName: 'LinkedIn', name: 'Nina Gomez', email: 'nina.gomez@email.com', position: 'Product Designer', importedAt: subHours(now, 5), status: 'added' },
  { id: 'ae3', sourceId: 'src5', sourceName: 'Company Website', name: 'Omar Hassan', email: 'omar.hassan@email.com', position: 'Backend Engineer', importedAt: subHours(now, 12), status: 'pending' },
  { id: 'ae4', sourceId: 'src4', sourceName: 'Referral Portal', name: 'Chloe Martin', email: 'chloe.martin@email.com', position: 'Marketing Lead', importedAt: subDays(now, 1), status: 'added' },
  { id: 'ae5', sourceId: 'src2', sourceName: 'Indeed', name: 'James Wong', email: 'james.wong@email.com', position: 'Data Analyst', importedAt: subDays(now, 1), status: 'duplicate' },
  { id: 'ae6', sourceId: 'src3', sourceName: 'Agency Partner — Hays', name: 'Fatima Al-Rashid', email: 'fatima.alrashid@email.com', position: 'Engineering Manager', importedAt: subDays(now, 3), status: 'added' },
  { id: 'ae7', sourceId: 'src4', sourceName: 'Referral Portal', name: 'Lucas Becker', email: 'lucas.becker@email.com', position: 'Full Stack Developer', importedAt: subDays(now, 4), status: 'added' },
  { id: 'ae8', sourceId: 'src2', sourceName: 'Indeed', name: 'Amara Diallo', email: 'amara.diallo@email.com', position: 'UX Researcher', importedAt: subDays(now, 5), status: 'pending' },
];

export const mockAcquisitionsService = {
  getSources: async (): Promise<AcquisitionSource[]> => {
    await delay(300);
    return [...MOCK_SOURCES];
  },

  getEntries: async (sourceId?: string): Promise<AcquisitionEntry[]> => {
    await delay(250);
    if (sourceId) return MOCK_ENTRIES.filter(e => e.sourceId === sourceId);
    return [...MOCK_ENTRIES];
  },

  // TODO: replace with API — PATCH /acquisitions/sources/:id
  toggleSource: async (sourceId: string, isActive: boolean): Promise<void> => {
    await delay(200);
    MOCK_SOURCES = MOCK_SOURCES.map(s =>
      s.id === sourceId ? { ...s, isActive } : s,
    );
  },

  // TODO: replace with API — POST /acquisitions/import
  importCandidates: async (input: ImportCandidatesInput): Promise<AcquisitionEntry[]> => {
    await delay(600);
    const source = MOCK_SOURCES.find(s => s.id === input.sourceId);
    if (!source) throw new Error('Source not found');

    const newEntries: AcquisitionEntry[] = input.entries.map((e, i) => ({
      id: `ae${Date.now()}_${i}`,
      sourceId: input.sourceId,
      sourceName: source.name,
      name: e.name,
      email: e.email,
      position: e.position,
      importedAt: new Date(),
      status: 'pending' as const,
    }));

    MOCK_ENTRIES = [...newEntries, ...MOCK_ENTRIES];
    MOCK_SOURCES = MOCK_SOURCES.map(s =>
      s.id === input.sourceId
        ? { ...s, totalCount: s.totalCount + newEntries.length, thisMonthCount: s.thisMonthCount + newEntries.length, lastActivityAt: new Date() }
        : s,
    );

    return newEntries;
  },
};

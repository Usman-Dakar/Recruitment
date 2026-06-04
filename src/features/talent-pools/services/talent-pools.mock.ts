import type { TalentPool, CreateTalentPoolInput } from '../types/talent-pool.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /talent-pools
// Note: c8 (Lena Fischer) was auto-removed from 'Leadership Pipeline' on hire — cross-module rule
let MOCK_POOLS: TalentPool[] = [
  {
    id: 'tp1',
    name: 'Senior Engineers',
    description: 'Senior frontend, backend, and full-stack engineers ready for immediate placement.',
    candidateIds: ['c1', 'c3', 'c7'],
    createdAt: new Date('2026-03-01'),
  },
  {
    id: 'tp2',
    name: 'Product Talent',
    description: 'Product managers and business analysts with SaaS experience.',
    candidateIds: ['c2', 'c5'],
    createdAt: new Date('2026-03-15'),
  },
  {
    id: 'tp3',
    name: 'Design Talent',
    description: 'UX designers, visual designers, and design researchers.',
    candidateIds: ['c6'],
    createdAt: new Date('2026-04-01'),
  },
  {
    id: 'tp4',
    name: 'Leadership Pipeline',
    description: 'Senior leaders and managers identified for future executive roles.',
    candidateIds: [],
    createdAt: new Date('2026-02-15'),
  },
];

export const mockTalentPoolsService = {
  getAll: async (): Promise<TalentPool[]> => {
    await delay(300);
    return [...MOCK_POOLS];
  },

  getById: async (id: string): Promise<TalentPool | null> => {
    await delay(200);
    return MOCK_POOLS.find(p => p.id === id) ?? null;
  },

  create: async (input: CreateTalentPoolInput): Promise<TalentPool> => {
    await delay(400);
    const pool: TalentPool = {
      id: `tp${Date.now()}`,
      name: input.name,
      description: input.description ?? '',
      candidateIds: [],
      createdAt: new Date(),
    };
    MOCK_POOLS = [pool, ...MOCK_POOLS];
    return pool;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_POOLS = MOCK_POOLS.filter(p => p.id !== id);
  },

  // TODO: replace with API — POST /talent-pools/:id/candidates
  addCandidates: async (poolId: string, candidateIds: string[]): Promise<void> => {
    await delay(300);
    MOCK_POOLS = MOCK_POOLS.map(p =>
      p.id === poolId
        ? { ...p, candidateIds: [...new Set([...p.candidateIds, ...candidateIds])] }
        : p,
    );
  },

  // TODO: replace with API — DELETE /talent-pools/:id/candidates/:candidateId
  removeCandidate: async (poolId: string, candidateId: string): Promise<void> => {
    await delay(200);
    MOCK_POOLS = MOCK_POOLS.map(p =>
      p.id === poolId
        ? { ...p, candidateIds: p.candidateIds.filter(id => id !== candidateId) }
        : p,
    );
  },

  // Called when a candidate is hired — removes them from ALL pools (cross-module rule)
  // TODO: invoke from useUpdateCandidateStatus onSuccess when status === 'hired'
  removeFromAllPools: async (candidateId: string): Promise<void> => {
    await delay(100);
    MOCK_POOLS = MOCK_POOLS.map(p => ({
      ...p,
      candidateIds: p.candidateIds.filter(id => id !== candidateId),
    }));
  },
};

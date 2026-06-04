import type { TalentPool, CreateTalentPoolInput } from '../types/talent-pool.types';
import { mockTalentPoolsService } from './talent-pools.mock';

export const talentPoolsService = {
  getAll: (): Promise<TalentPool[]> =>
    mockTalentPoolsService.getAll(), // TODO: replace with API — GET /talent-pools
  getById: (id: string): Promise<TalentPool | null> =>
    mockTalentPoolsService.getById(id), // TODO: replace with API — GET /talent-pools/:id
  create: (input: CreateTalentPoolInput): Promise<TalentPool> =>
    mockTalentPoolsService.create(input), // TODO: replace with API — POST /talent-pools
  delete: (id: string): Promise<void> =>
    mockTalentPoolsService.delete(id), // TODO: replace with API — DELETE /talent-pools/:id
  addCandidates: (poolId: string, candidateIds: string[]): Promise<void> =>
    mockTalentPoolsService.addCandidates(poolId, candidateIds), // TODO: replace with API — POST /talent-pools/:id/candidates
  removeCandidate: (poolId: string, candidateId: string): Promise<void> =>
    mockTalentPoolsService.removeCandidate(poolId, candidateId), // TODO: replace with API — DELETE /talent-pools/:id/candidates/:candidateId
  removeFromAllPools: (candidateId: string): Promise<void> =>
    mockTalentPoolsService.removeFromAllPools(candidateId), // TODO: called on candidate hire
};

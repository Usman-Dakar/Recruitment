import type { ImportCandidatesInput } from '../types/acquisitions.types';
import { mockAcquisitionsService } from './acquisitions.mock';

export const acquisitionsService = {
  getSources: () =>
    mockAcquisitionsService.getSources(), // TODO: replace with API — GET /acquisitions/sources
  getEntries: (sourceId?: string) =>
    mockAcquisitionsService.getEntries(sourceId), // TODO: replace with API — GET /acquisitions/entries
  toggleSource: (sourceId: string, isActive: boolean) =>
    mockAcquisitionsService.toggleSource(sourceId, isActive), // TODO: replace with API — PATCH /acquisitions/sources/:id
  importCandidates: (input: ImportCandidatesInput) =>
    mockAcquisitionsService.importCandidates(input), // TODO: replace with API — POST /acquisitions/import
};

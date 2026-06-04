import type { CompanyInfo } from '../types/general.types';
import { mockGeneralService } from './general.mock';

export const generalService = {
  getCompany: () =>
    mockGeneralService.getCompany(), // TODO: replace with API — GET /settings/general/company
  updateCompany: (input: CompanyInfo) =>
    mockGeneralService.updateCompany(input), // TODO: replace with API — PATCH /settings/general/company
  getLocations: () =>
    mockGeneralService.getLocations(), // TODO: replace with API — GET /settings/general/locations
  addLocation: (name: string) =>
    mockGeneralService.addLocation(name), // TODO: replace with API — POST /settings/general/locations
  deleteLocation: (id: string) =>
    mockGeneralService.deleteLocation(id), // TODO: replace with API — DELETE /settings/general/locations/:id
  getTeam: () =>
    mockGeneralService.getTeam(), // TODO: replace with API — GET /settings/general/team
  getRolePermissions: () =>
    mockGeneralService.getRolePermissions(), // TODO: replace with API — GET /settings/general/role-permissions
  getReferrals: () =>
    mockGeneralService.getReferrals(), // TODO: replace with API — GET /settings/general/referrals
};

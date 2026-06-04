export type SourceType = 'job_board' | 'linkedin' | 'agency' | 'referral' | 'direct' | 'social';

export type EntryStatus = 'pending' | 'added' | 'duplicate' | 'failed';

export interface AcquisitionSource {
  id: string;
  name: string;
  type: SourceType;
  isActive: boolean;
  totalCount: number;
  thisMonthCount: number;
  conversionRate: number; // percentage (0-100)
  lastActivityAt: Date | null;
}

export interface AcquisitionEntry {
  id: string;
  sourceId: string;
  sourceName: string;
  name: string;
  email: string;
  position: string;
  importedAt: Date;
  status: EntryStatus;
}

export interface ImportCandidatesInput {
  sourceId: string;
  entries: { name: string; email: string; position: string }[];
}

export type DateRange = '7d' | '30d' | '90d' | '1y';
export type MetricId = 'applications' | 'pipeline' | 'sources' | 'time_to_hire';

export interface AnalyticsFilters {
  dateRange: DateRange;
  jobId?: string;
}

export interface AnalyticsOverview {
  totalApplications: number;
  activeJobs: number;
  hired: number;
  avgTimeToHire: number;
  conversionRate: number;
  openPositions: number;
}

export interface ApplicationsDataPoint {
  date: string;
  count: number;
}

export interface PipelineStageData {
  stage: string;
  count: number;
  color: string;
}

export interface SourceData {
  source: string;
  count: number;
  percentage: number;
}

export interface TimeToHireData {
  job: string;
  days: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  applications: ApplicationsDataPoint[];
  pipeline: PipelineStageData[];
  sources: SourceData[];
  timeToHire: TimeToHireData[];
}

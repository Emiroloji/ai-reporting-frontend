export type ReportStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Report {
  id: string;
  name: string;
  prompt?: string;
  status: ReportStatus;
  creditsUsed?: number;
  createdAt: string;
  updatedAt?: string;
  resultUrl?: string;
  errorMessage?: string;
}

export interface ReportCreateRequest {
  name: string;
  prompt?: string;
}

export interface ReportCreateResponse {
  id: string;
  status: ReportStatus;
  creditsUsed?: number;
  createdAt: string;
}
export interface AIAnalysisRequest {
  fileId: number;
  analysisType?: string;
}

export interface ColumnStatistics {
  count: number;
  mean?: number;
  std?: number;
  min?: number;
  max?: number;
  q25?: number;
  q50?: number;
  q75?: number;
  uniqueValues?: number;
  nullCount?: number;
}

export interface AIAnalysisResponse {
  fileId: number;
  fileName: string;
  rowCount: number;
  columns: string[];
  statistics: Record<string, ColumnStatistics>;
  data: Array<Record<string, unknown>>;
  summary?: string;
  insights?: string[];
  generatedAt: string;
}

export interface AnalysisReport {
  id: number;
  fileId: number;
  fileName: string;
  analysisData: AIAnalysisResponse;
  createdAt: string;
  userId: number;
}

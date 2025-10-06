import api from './http';
import type {
  AIAnalysisRequest,
  AIAnalysisResponse,
  AnalysisReport,
} from '../types/analysis';

export const analysisService = {
  analyzeFile: async (
    fileId: number,
    analysisType?: string
  ): Promise<AIAnalysisResponse> => {
    const payload: AIAnalysisRequest = {
      fileId,
      analysisType,
    };
    const res = await api.post<AIAnalysisResponse>(
      `/ai/${fileId}/analyze`,
      payload
    );
    return res.data;
  },

  getReport: async (fileId: number): Promise<AnalysisReport> => {
    const res = await api.get<AnalysisReport>(`/reports/${fileId}`);
    return res.data;
  },

  getAllReports: async (): Promise<AnalysisReport[]> => {
    const res = await api.get<AnalysisReport[]>('/reports');
    return res.data;
  },

  deleteReport: async (reportId: number): Promise<void> => {
    await api.delete(`/reports/${reportId}`);
  },
};

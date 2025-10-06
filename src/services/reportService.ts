import api from './http';
import type {
  Report,
  ReportCreateRequest,
  ReportCreateResponse,
} from '../types/report';

const BASE = '/reports';

export const reportService = {
  create: async (data: ReportCreateRequest): Promise<ReportCreateResponse> => {
    const res = await api.post<ReportCreateResponse>(`${BASE}`, data);
    return res.data;
  },

  uploadFile: async (reportId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`${BASE}/${encodeURIComponent(reportId)}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  get: async (reportId: string): Promise<Report> => {
    const res = await api.get<Report>(`${BASE}/${encodeURIComponent(reportId)}`);
    return res.data;
  },

  list: async (): Promise<Report[]> => {
    const res = await api.get<Report[]>(`${BASE}`);
    return res.data;
  },

  download: async (reportId: string): Promise<void> => {
    const res = await api.get(`${BASE}/${encodeURIComponent(reportId)}/download`, {
      responseType: 'blob',
    });
    const blobUrl = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `report-${reportId}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  },
};
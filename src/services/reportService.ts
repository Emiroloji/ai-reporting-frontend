import { supabase } from '../lib/supabase';
import type {
  Report,
  ReportCreateRequest,
  ReportCreateResponse,
} from '../types/report';

interface DbAnalysisReport {
  id: number;
  file_id: number;
  user_id: string;
  report_data: Record<string, unknown>;
  row_count: number;
  column_count: number;
  created_at: string;
}

const mapDbReportToReport = (dbReport: DbAnalysisReport, fileName?: string): Report => ({
  id: dbReport.id.toString(),
  name: fileName || `Report #${dbReport.id}`,
  status: 'completed',
  creditsUsed: 10,
  createdAt: dbReport.created_at,
  updatedAt: dbReport.created_at,
});

export const reportService = {
  create: async (data: ReportCreateRequest): Promise<ReportCreateResponse> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: report, error } = await supabase
      .from('analysis_reports')
      .insert({
        user_id: user.id,
        file_id: 0,
        report_data: { name: data.name, prompt: data.prompt },
        row_count: 0,
        column_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: report.id.toString(),
      status: 'queued',
      createdAt: report.created_at,
    };
  },

  uploadFile: async (_reportId: string, _file: File): Promise<void> => {
    throw new Error('Not implemented');
  },

  get: async (reportId: string): Promise<Report> => {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*, uploaded_files(file_name)')
      .eq('id', parseInt(reportId, 10))
      .single();

    if (error) throw error;

    const dbReport = data as DbAnalysisReport & { uploaded_files?: { file_name: string } };
    return mapDbReportToReport(dbReport, dbReport.uploaded_files?.file_name);
  },

  list: async (): Promise<Report[]> => {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*, uploaded_files(file_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as Array<DbAnalysisReport & { uploaded_files?: { file_name: string } }>).map(
      (dbReport) => mapDbReportToReport(dbReport, dbReport.uploaded_files?.file_name)
    );
  },

  download: async (reportId: string): Promise<void> => {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('report_data')
      .eq('id', parseInt(reportId, 10))
      .single();

    if (error) throw error;

    const blob = new Blob([JSON.stringify(data.report_data, null, 2)], {
      type: 'application/json',
    });
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `report-${reportId}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  },
};
import { supabase } from '../lib/supabase';
import { fileService } from './fileService';
import { mappingService } from './mappingService';
import { creditService } from './creditService';
import type {
  AIAnalysisResponse,
  AnalysisReport,
} from '../types/analysis';

interface DbAnalysisReport {
  id: number;
  file_id: number;
  user_id: string;
  report_data: Record<string, unknown>;
  row_count: number;
  column_count: number;
  created_at: string;
}

const mapDbReportToAnalysisReport = (dbReport: DbAnalysisReport, fileName: string): AnalysisReport => ({
  id: dbReport.id,
  fileId: dbReport.file_id,
  fileName,
  analysisData: dbReport.report_data as unknown as AIAnalysisResponse,
  createdAt: dbReport.created_at,
  userId: 0,
});

export const analysisService = {
  analyzeFile: async (
    fileId: number,
    _analysisType?: string
  ): Promise<AIAnalysisResponse> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const credits = await creditService.getMyCredits();
    if (credits.balance < 10) {
      throw new Error('Insufficient credits. Analysis costs 10 credits.');
    }

    const file = await fileService.getFileById(fileId);
    const mappings = await mappingService.getMappings(fileId);

    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('uploaded-files')
      .download(file.storagePath);

    if (downloadError) throw downloadError;

    let analysisData: AIAnalysisResponse;

    if (file.fileType === 'csv') {
      const text = await fileBlob.text();
      const lines = text.split('\n').filter(line => line.trim());
      const columns = lines[0]?.split(',').map(col => col.trim()) || [];
      const dataRows = lines.slice(1, Math.min(101, lines.length));

      const rows = dataRows.map(line => {
        const values = line.split(',');
        const row: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx]?.trim() || '';
        });
        return row;
      });

      analysisData = {
        fileId,
        fileName: file.fileName,
        rowCount: lines.length - 1,
        columns,
        statistics: {},
        data: rows,
        summary: `Analysis of ${file.fileName} completed. Found ${lines.length - 1} rows and ${columns.length} columns.`,
        insights: [
          `Total rows: ${lines.length - 1}`,
          `Total columns: ${columns.length}`,
          `Mappings configured: ${mappings.length}`,
        ],
        generatedAt: new Date().toISOString(),
      };
    } else {
      analysisData = {
        fileId,
        fileName: file.fileName,
        rowCount: 0,
        columns: [],
        statistics: {},
        data: [],
        summary: `File type ${file.fileType} requires additional processing.`,
        insights: ['File uploaded successfully', 'Configure mappings to enable full analysis'],
        generatedAt: new Date().toISOString(),
      };
    }

    const { error } = await supabase
      .from('analysis_reports')
      .insert({
        file_id: fileId,
        user_id: user.id,
        report_data: analysisData,
        row_count: analysisData.rowCount,
        column_count: analysisData.columns.length,
      });

    if (error) throw error;

    await creditService.addCredits({
      amount: -10,
      description: `Analysis of file: ${file.fileName}`,
    });

    await supabase
      .from('uploaded_files')
      .update({ status: 'analyzed' })
      .eq('id', fileId);

    return analysisData;
  },

  getReport: async (fileId: number): Promise<AnalysisReport> => {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*, uploaded_files(file_name)')
      .eq('file_id', fileId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const dbReport = data as DbAnalysisReport & { uploaded_files: { file_name: string } };
    return mapDbReportToAnalysisReport(dbReport, dbReport.uploaded_files.file_name);
  },

  getAllReports: async (): Promise<AnalysisReport[]> => {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*, uploaded_files(file_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as Array<DbAnalysisReport & { uploaded_files: { file_name: string } }>).map(
      (dbReport) => mapDbReportToAnalysisReport(dbReport, dbReport.uploaded_files.file_name)
    );
  },

  deleteReport: async (reportId: number): Promise<void> => {
    const { error } = await supabase
      .from('analysis_reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
  },
};

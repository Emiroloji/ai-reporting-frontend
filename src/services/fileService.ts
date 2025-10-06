import { supabase } from '../lib/supabase';
import type {
  UploadedFile,
  FileUploadResponse,
  FilePreview,
} from '../types/file';

interface DbUploadedFile {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  uploaded_at: string;
  user_id: string;
  status: string;
}

const mapDbFileToFile = (dbFile: DbUploadedFile): UploadedFile => ({
  id: dbFile.id,
  fileName: dbFile.file_name,
  fileType: dbFile.file_type,
  fileSize: dbFile.file_size,
  storagePath: dbFile.storage_path,
  uploadedAt: dbFile.uploaded_at,
  userId: 0,
  status: dbFile.status as UploadedFile['status'],
});

export const fileService = {
  upload: async (file: File): Promise<FileUploadResponse> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploaded-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('uploaded_files')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: fileExt || 'unknown',
        file_size: file.size,
        storage_path: filePath,
        status: 'uploaded',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      fileName: data.file_name,
      fileType: data.file_type,
      fileSize: data.file_size,
      message: 'File uploaded successfully',
    };
  },

  getMyFiles: async (): Promise<UploadedFile[]> => {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return (data as DbUploadedFile[]).map(mapDbFileToFile);
  },

  getFileById: async (fileId: number): Promise<UploadedFile> => {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) throw error;

    return mapDbFileToFile(data as DbUploadedFile);
  },

  deleteFile: async (fileId: number): Promise<void> => {
    const file = await fileService.getFileById(fileId);

    const { error: storageError } = await supabase.storage
      .from('uploaded-files')
      .remove([file.storagePath]);

    if (storageError) throw storageError;

    const { error } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('id', fileId);

    if (error) throw error;
  },

  downloadFile: async (fileId: number): Promise<Blob> => {
    const file = await fileService.getFileById(fileId);

    const { data, error } = await supabase.storage
      .from('uploaded-files')
      .download(file.storagePath);

    if (error) throw error;

    return data;
  },

  previewFile: async (fileId: number): Promise<FilePreview> => {
    const file = await fileService.getFileById(fileId);

    const { data, error } = await supabase.storage
      .from('uploaded-files')
      .download(file.storagePath);

    if (error) throw error;

    if (file.fileType === 'csv') {
      const text = await data.text();
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        return { columns: [], rows: [], totalRows: 0, previewRows: 0 };
      }

      const columns = lines[0].split(',').map(col => col.trim());
      const rows = lines.slice(1, Math.min(11, lines.length)).map(line => {
        const values = line.split(',');
        const row: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx]?.trim() || '';
        });
        return row;
      });

      return {
        columns,
        rows,
        totalRows: lines.length - 1,
        previewRows: rows.length,
      };
    }

    if (file.fileType === 'xlsx' || file.fileType === 'xls') {
      return {
        columns: ['Note'],
        rows: [{ 'Note': 'Excel preview requires additional processing. Please use mapping to continue.' }],
        totalRows: 0,
        previewRows: 1,
      };
    }

    throw new Error('Unsupported file type for preview');
  },
};

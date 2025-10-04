import api from './http';
import type {
  UploadedFile,
  FileUploadResponse,
  FilePreview,
} from '../types/file';

export const fileService = {
  upload: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<FileUploadResponse>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getMyFiles: async (): Promise<UploadedFile[]> => {
    const res = await api.get<UploadedFile[]>('/files/my');
    return res.data;
  },

  getFileById: async (fileId: number): Promise<UploadedFile> => {
    const res = await api.get<UploadedFile>(`/files/${fileId}`);
    return res.data;
  },

  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },

  downloadFile: async (fileId: number): Promise<Blob> => {
    const res = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return res.data;
  },

  previewFile: async (fileId: number): Promise<FilePreview> => {
    const res = await api.get<FilePreview>(`/files/${fileId}/preview`);
    return res.data;
  },
};

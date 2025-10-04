export interface UploadedFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  uploadedAt: string;
  userId: number;
  status?: 'uploaded' | 'processing' | 'analyzed' | 'error';
}

export interface FileUploadResponse {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  message: string;
}

export interface FilePreview {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  totalRows: number;
  previewRows: number;
}

export interface FileColumnMapping {
  id: number;
  fileId: number;
  sourceColumn: string;
  targetField: string;
  createdAt?: string;
}

export interface CreateMappingRequest {
  sourceColumn: string;
  targetField: string;
}

export interface UpdateMappingRequest {
  sourceColumn?: string;
  targetField?: string;
}

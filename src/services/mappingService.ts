import api from './http';
import type {
  FileColumnMapping,
  CreateMappingRequest,
  UpdateMappingRequest,
} from '../types/file';

export const mappingService = {
  getMappings: async (fileId: number): Promise<FileColumnMapping[]> => {
    const res = await api.get<FileColumnMapping[]>(`/files/${fileId}/mapping`);
    return res.data;
  },

  createMapping: async (
    fileId: number,
    mapping: CreateMappingRequest
  ): Promise<FileColumnMapping> => {
    const res = await api.post<FileColumnMapping>(
      `/files/${fileId}/mapping`,
      mapping
    );
    return res.data;
  },

  updateMapping: async (
    fileId: number,
    mappingId: number,
    mapping: UpdateMappingRequest
  ): Promise<FileColumnMapping> => {
    const res = await api.put<FileColumnMapping>(
      `/files/${fileId}/mapping/${mappingId}`,
      mapping
    );
    return res.data;
  },

  deleteMapping: async (fileId: number, mappingId: number): Promise<void> => {
    await api.delete(`/files/${fileId}/mapping/${mappingId}`);
  },

  deleteAllMappings: async (fileId: number): Promise<void> => {
    await api.delete(`/files/${fileId}/mapping`);
  },
};

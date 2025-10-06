import { supabase } from '../lib/supabase';
import type {
  FileColumnMapping,
  CreateMappingRequest,
  UpdateMappingRequest,
} from '../types/file';

interface DbMapping {
  id: number;
  file_id: number;
  source_column: string;
  target_field: string;
  created_at: string;
}

const mapDbMappingToMapping = (dbMapping: DbMapping): FileColumnMapping => ({
  id: dbMapping.id,
  fileId: dbMapping.file_id,
  sourceColumn: dbMapping.source_column,
  targetField: dbMapping.target_field,
  createdAt: dbMapping.created_at,
});

export const mappingService = {
  getMappings: async (fileId: number): Promise<FileColumnMapping[]> => {
    const { data, error } = await supabase
      .from('file_column_mappings')
      .select('*')
      .eq('file_id', fileId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data as DbMapping[]).map(mapDbMappingToMapping);
  },

  createMapping: async (
    fileId: number,
    mapping: CreateMappingRequest
  ): Promise<FileColumnMapping> => {
    const { data, error } = await supabase
      .from('file_column_mappings')
      .insert({
        file_id: fileId,
        source_column: mapping.sourceColumn,
        target_field: mapping.targetField,
      })
      .select()
      .single();

    if (error) throw error;

    return mapDbMappingToMapping(data as DbMapping);
  },

  updateMapping: async (
    fileId: number,
    mappingId: number,
    mapping: UpdateMappingRequest
  ): Promise<FileColumnMapping> => {
    const updates: Record<string, string> = {};
    if (mapping.sourceColumn) updates.source_column = mapping.sourceColumn;
    if (mapping.targetField) updates.target_field = mapping.targetField;

    const { data, error } = await supabase
      .from('file_column_mappings')
      .update(updates)
      .eq('id', mappingId)
      .eq('file_id', fileId)
      .select()
      .single();

    if (error) throw error;

    return mapDbMappingToMapping(data as DbMapping);
  },

  deleteMapping: async (fileId: number, mappingId: number): Promise<void> => {
    const { error } = await supabase
      .from('file_column_mappings')
      .delete()
      .eq('id', mappingId)
      .eq('file_id', fileId);

    if (error) throw error;
  },

  deleteAllMappings: async (fileId: number): Promise<void> => {
    const { error } = await supabase
      .from('file_column_mappings')
      .delete()
      .eq('file_id', fileId);

    if (error) throw error;
  },
};

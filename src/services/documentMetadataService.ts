
import { supabase } from '@/integrations/supabase/client';
import type { DocumentMetadata, UploadMetadata } from '@/types/googleDrive';

export class DocumentMetadataService {
  static async saveDocument(
    driveFileId: string,
    file: File,
    metadata: UploadMetadata,
    userId: string
  ): Promise<DocumentMetadata> {
    const { data: documentData, error } = await supabase
      .from('documents')
      .insert({
        drive_file_id: driveFileId,
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        client_id: metadata.client_id,
        process_id: metadata.process_id,
        user_id: userId,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return documentData as unknown as DocumentMetadata;
  }

  static async deleteDocument(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      throw error;
    }
  }
}

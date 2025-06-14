
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GoogleDriveApiService } from '@/services/googleDriveApi';
import { GoogleDriveTokenManager } from '@/utils/googleDriveToken';
import { DocumentMetadataService } from '@/services/documentMetadataService';
import type { DocumentMetadata, UploadMetadata } from '@/types/googleDrive';

export function useGoogleDrive() {
  const [loading, setLoading] = useState(false);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDriveToken();
    }
  }, [user]);

  const fetchDriveToken = async () => {
    if (!user) return;
    
    const token = await GoogleDriveTokenManager.fetchToken(user.id);
    setDriveToken(token);
  };

  const uploadFile = async (
    file: File, 
    metadata: UploadMetadata
  ): Promise<DocumentMetadata | null> => {
    if (!driveToken) {
      toast.error('Conecte-se ao Google Drive primeiro nas configurações');
      return null;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setLoading(true);

    try {
      const driveService = new GoogleDriveApiService(driveToken);
      
      // 1. Upload para Google Drive
      const driveFile = await driveService.uploadFile(file);

      // 2. Salvar metadados no Supabase
      try {
        const documentData = await DocumentMetadataService.saveDocument(
          driveFile.id,
          file,
          metadata,
          user.id
        );

        toast.success('Documento enviado com sucesso!');
        return documentData;
      } catch (supabaseError) {
        // Se falhar no Supabase, tentar deletar do Drive
        await driveService.deleteFile(driveFile.id);
        throw supabaseError;
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar documento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (documentId: string, driveFileId: string): Promise<boolean> => {
    if (!driveToken) {
      toast.error('Token do Google Drive não encontrado');
      return false;
    }

    try {
      const driveService = new GoogleDriveApiService(driveToken);
      
      // 1. Deletar do Google Drive
      const driveDeleted = await driveService.deleteFile(driveFileId);
      
      if (!driveDeleted) {
        console.warn('Erro ao deletar do Drive, mas continuando...');
      }

      // 2. Remover metadados do Supabase
      await DocumentMetadataService.deleteDocument(documentId);

      toast.success('Documento excluído com sucesso!');
      return true;

    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      toast.error('Erro ao excluir documento');
      return false;
    }
  };

  const getFileDownloadLink = async (driveFileId: string): Promise<string | null> => {
    if (!driveToken) {
      return null;
    }

    const driveService = new GoogleDriveApiService(driveToken);
    return await driveService.getFileDownloadLink(driveFileId);
  };

  return {
    loading,
    driveToken,
    uploadFile,
    deleteFile,
    getFileDownloadLink,
    isConnected: GoogleDriveTokenManager.isTokenValid(driveToken),
    refreshToken: fetchDriveToken,
  };
}

// Re-export types for backward compatibility
export type { DocumentMetadata, DriveFile } from '@/types/googleDrive';

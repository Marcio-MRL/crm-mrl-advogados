
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
  parents: string[];
}

export interface DocumentMetadata {
  id: string;
  drive_file_id: string;
  name: string;
  description?: string;
  category: string;
  client_id?: string;
  process_id?: string;
  user_id: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

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
    try {
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('access_token, expires_at')
        .eq('user_id', user?.id)
        .contains('scope', 'https://www.googleapis.com/auth/drive.file')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar token do Drive:', error);
        return;
      }

      if (data && data.access_token) {
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        if (!expiresAt || expiresAt > new Date()) {
          setDriveToken(data.access_token);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar token do Google Drive:', error);
    }
  };

  const uploadFile = async (
    file: File, 
    metadata: {
      name: string;
      description?: string;
      category: string;
      client_id?: string;
      process_id?: string;
    }
  ): Promise<DocumentMetadata | null> => {
    if (!driveToken) {
      toast.error('Conecte-se ao Google Drive primeiro');
      return null;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setLoading(true);

    try {
      // 1. Upload para Google Drive
      const formData = new FormData();
      const driveMetadata = {
        name: file.name,
        parents: ['1BVG6lFz8rQyBmGKv_document_folder_id'] // Pasta específica do MRL
      };

      formData.append('metadata', new Blob([JSON.stringify(driveMetadata)], { type: 'application/json' }));
      formData.append('file', file);

      const driveResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${driveToken}`,
        },
        body: formData,
      });

      if (!driveResponse.ok) {
        throw new Error('Erro no upload para Google Drive');
      }

      const driveFile = await driveResponse.json();

      // 2. Salvar metadados no Supabase
      const { data: documentData, error: supabaseError } = await supabase
        .from('documents')
        .insert({
          drive_file_id: driveFile.id,
          name: metadata.name,
          description: metadata.description,
          category: metadata.category,
          client_id: metadata.client_id,
          process_id: metadata.process_id,
          user_id: user.id,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (supabaseError) {
        // Se falhar no Supabase, tentar deletar do Drive
        await fetch(`https://www.googleapis.com/drive/v3/files/${driveFile.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${driveToken}`,
          },
        });
        throw supabaseError;
      }

      toast.success('Documento enviado com sucesso!');
      return documentData;

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
      // 1. Deletar do Google Drive
      const driveResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${driveToken}`,
        },
      });

      if (!driveResponse.ok) {
        console.warn('Erro ao deletar do Drive, mas continuando...');
      }

      // 2. Remover metadados do Supabase
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        throw error;
      }

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

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=webContentLink`, {
        headers: {
          'Authorization': `Bearer ${driveToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter link de download');
      }

      const data = await response.json();
      return data.webContentLink;

    } catch (error) {
      console.error('Erro ao obter link de download:', error);
      return null;
    }
  };

  return {
    loading,
    driveToken,
    uploadFile,
    deleteFile,
    getFileDownloadLink,
    isConnected: !!driveToken,
  };
}

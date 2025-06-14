
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GoogleDriveApiService } from '@/services/googleDriveApi';
import { GoogleDriveTokenManager } from '@/utils/googleDriveToken';
import { DocumentMetadataService } from '@/services/documentMetadataService';
import type { DocumentMetadata, UploadMetadata } from '@/types/googleDrive';

export function useGoogleDrive() {
  const [loading, setLoading] = useState(false);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastConnectionCheck, setLastConnectionCheck] = useState<Date | null>(null);
  const { user } = useAuth();

  const fetchDriveToken = useCallback(async () => {
    if (!user || loading) {
      console.log('⚠️ Usuário não encontrado ou já carregando, não é possível verificar token');
      setIsConnected(false);
      setDriveToken(null);
      return;
    }
    
    try {
      console.log('🔄 Iniciando verificação de token do Google Drive...');
      setLoading(true);
      
      const token = await GoogleDriveTokenManager.fetchToken(user.id);
      
      if (token) {
        console.log('🔍 Token encontrado, testando conexão...');
        const connectionValid = await GoogleDriveTokenManager.testTokenConnection(token);
        
        setDriveToken(token);
        setIsConnected(connectionValid);
        
        if (connectionValid) {
          console.log('✅ Google Drive conectado e funcionando');
        } else {
          console.log('❌ Token encontrado mas conexão falhou');
          setDriveToken(null);
        }
      } else {
        console.log('⚠️ Nenhum token válido encontrado');
        setIsConnected(false);
        setDriveToken(null);
      }
      
      setLastConnectionCheck(new Date());
    } catch (error) {
      console.error('❌ Erro na verificação de token:', error);
      setIsConnected(false);
      setDriveToken(null);
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  // Verificação inicial apenas uma vez quando o usuário está disponível
  useEffect(() => {
    if (user && !lastConnectionCheck) {
      fetchDriveToken();
    } else if (!user) {
      console.log('⚠️ Usuário não encontrado');
      setIsConnected(false);
      setDriveToken(null);
    }
  }, [user, lastConnectionCheck, fetchDriveToken]);

  const uploadFile = async (
    file: File, 
    metadata: UploadMetadata
  ): Promise<DocumentMetadata | null> => {
    if (!driveToken || !isConnected) {
      toast.error('Conecte-se ao Google Drive primeiro nas configurações');
      return null;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setLoading(true);

    try {
      console.log('📤 Iniciando upload do arquivo:', file.name);
      
      const driveService = new GoogleDriveApiService(driveToken);
      
      // 1. Upload para Google Drive
      const driveFile = await driveService.uploadFile(file);
      console.log('✅ Arquivo enviado para o Google Drive:', driveFile);

      // 2. Salvar metadados no Supabase
      try {
        const documentData = await DocumentMetadataService.saveDocument(
          driveFile.id,
          file,
          metadata,
          user.id
        );

        console.log('✅ Metadados salvos no Supabase:', documentData);
        toast.success(`Documento "${metadata.name}" enviado com sucesso!`);
        return documentData;
      } catch (supabaseError) {
        console.error('❌ Erro ao salvar metadados no Supabase:', supabaseError);
        // Se falhar no Supabase, tentar deletar do Drive
        try {
          await driveService.deleteFile(driveFile.id);
          console.log('🗑️ Arquivo removido do Google Drive devido ao erro no Supabase');
        } catch (cleanupError) {
          console.error('❌ Erro ao limpar arquivo do Drive:', cleanupError);
        }
        throw supabaseError;
      }

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          toast.error('Erro: Pasta não encontrada no Google Drive. Tentando criar pasta automaticamente...');
        } else if (error.message.includes('403')) {
          toast.error('Erro: Permissão negada. Verifique se o token do Google Drive ainda é válido.');
        } else if (error.message.includes('401')) {
          toast.error('Erro: Token expirado. Reconecte ao Google Drive nas configurações.');
          setIsConnected(false);
          setDriveToken(null);
        } else {
          toast.error(`Erro ao enviar documento: ${error.message}`);
        }
      } else {
        toast.error('Erro inesperado ao enviar documento');
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (documentId: string, driveFileId: string): Promise<boolean> => {
    if (!driveToken || !isConnected) {
      toast.error('Token do Google Drive não encontrado');
      return false;
    }

    try {
      const driveService = new GoogleDriveApiService(driveToken);
      
      // 1. Deletar do Google Drive
      const driveDeleted = await driveService.deleteFile(driveFileId);
      
      if (!driveDeleted) {
        console.warn('⚠️ Erro ao deletar do Drive, mas continuando...');
      }

      // 2. Remover metadados do Supabase
      await DocumentMetadataService.deleteDocument(documentId);

      toast.success('Documento excluído com sucesso!');
      return true;

    } catch (error) {
      console.error('❌ Erro ao deletar documento:', error);
      toast.error('Erro ao excluir documento');
      return false;
    }
  };

  const getFileDownloadLink = async (driveFileId: string): Promise<string | null> => {
    if (!driveToken || !isConnected) {
      return null;
    }

    const driveService = new GoogleDriveApiService(driveToken);
    return await driveService.getFileDownloadLink(driveFileId);
  };

  // Função para forçar uma nova verificação (manual)
  const refreshConnection = useCallback(async () => {
    console.log('🔄 Forçando nova verificação de conexão...');
    await fetchDriveToken();
  }, [fetchDriveToken]);

  return {
    loading,
    driveToken,
    uploadFile,
    deleteFile,
    getFileDownloadLink,
    isConnected,
    refreshToken: refreshConnection,
    lastConnectionCheck,
  };
}

// Re-export types for backward compatibility
export type { DocumentMetadata, DriveFile } from '@/types/googleDrive';

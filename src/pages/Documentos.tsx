
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { GoogleDriveDocumentTable } from '@/components/documents/GoogleDriveDocumentTable';
import { DocumentStats } from '@/components/documents/DocumentStats';
import { GoogleDriveConnectionStatus } from '@/components/documents/GoogleDriveConnectionStatus';
import { DocumentToolbar } from '@/components/documents/DocumentToolbar';
import { DocumentModals } from '@/components/documents/DocumentModals';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { useGoogleDrive, type DocumentMetadata } from '@/hooks/useGoogleDrive';

export default function Documentos() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<DocumentMetadata | null>(null);
  
  const { documents, loading } = useDocuments();
  const { deleteFile, isConnected, refreshToken } = useGoogleDrive();

  // Verificar conexão quando o componente montar
  useEffect(() => {
    console.log('Página de documentos carregada, verificando conexão...');
    if (refreshToken) {
      refreshToken();
    }
  }, [refreshToken]);

  // Log do status de conexão
  useEffect(() => {
    console.log('Status de conexão do Google Drive:', isConnected);
  }, [isConnected]);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
  };

  const handleDeleteDocument = (document: DocumentMetadata) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      await deleteFile(documentToDelete.id, documentToDelete.drive_file_id);
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleRefreshConnection = () => {
    console.log('Atualizando conexão com Google Drive...');
    if (refreshToken) {
      refreshToken();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Documentos - Google Drive" 
          subtitle="Gestão de documentos integrada com Google Drive" 
        />
        
        {/* Estatísticas de Documentos */}
        <DocumentStats documents={documents} />

        {/* Status da conexão com Google Drive */}
        <GoogleDriveConnectionStatus 
          isConnected={isConnected}
          onRefreshConnection={handleRefreshConnection}
        />
        
        {/* Barra de Ferramentas */}
        <DocumentToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => setIsUploadModalOpen(true)}
          isConnected={isConnected}
        />
        
        {/* Área de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Biblioteca de Documentos (Google Drive)
              {isConnected && (
                <span className="text-sm text-green-600 font-normal">• Conectado</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleDriveDocumentTable 
              documents={filteredDocuments}
              onDelete={handleDeleteDocument}
            />
          </CardContent>
        </Card>
        
        {/* Modais */}
        <DocumentModals 
          isUploadModalOpen={isUploadModalOpen}
          setIsUploadModalOpen={setIsUploadModalOpen}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          documentToDelete={documentToDelete}
          onUploadSuccess={handleUploadSuccess}
          onConfirmDelete={confirmDelete}
        />
      </div>
    </MainLayout>
  );
}


import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { GoogleDriveDocumentTable } from '@/components/documents/GoogleDriveDocumentTable';
import { GoogleDriveUploadForm } from '@/components/documents/GoogleDriveUploadForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Upload, 
  Search, 
  FolderPlus,
  Filter,
  FileText,
  HardDrive,
  RefreshCw
} from 'lucide-react';
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

  const getCategoryCounts = () => {
    const counts = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: documents.length,
      contratos: counts.contrato || 0,
      peticoes: counts.peticao || 0,
      procuracoes: counts.procuracao || 0,
      outros: Object.values(counts).reduce((sum, count) => sum + count, 0) - (counts.contrato || 0) - (counts.peticao || 0) - (counts.procuracao || 0)
    };
  };

  const stats = getCategoryCounts();

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos</p>
                  <p className="text-2xl font-bold">{stats.contratos}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Petições</p>
                  <p className="text-2xl font-bold">{stats.peticoes}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Procurações</p>
                  <p className="text-2xl font-bold">{stats.procuracoes}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da conexão com Google Drive */}
        {!isConnected && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Google Drive não conectado</p>
                    <p className="text-sm text-orange-600">Vá para Configurações → Integrações para conectar sua conta do Google Drive.</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshConnection}
                  className="text-orange-600 border-orange-200"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Verificar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Barra de Ferramentas */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-lawblue-500 hover:bg-lawblue-600"
              disabled={!isConnected}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload para Drive
            </Button>
            
            <Button variant="outline" disabled>
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Pasta
            </Button>
          </div>
        </div>
        
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
        
        {/* Modal de Upload */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload de Documento para Google Drive</DialogTitle>
            </DialogHeader>
            <GoogleDriveUploadForm onSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>

        {/* Modal de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o documento "{documentToDelete?.name}"? 
                Esta ação é irreversível e o arquivo será removido do Google Drive.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}

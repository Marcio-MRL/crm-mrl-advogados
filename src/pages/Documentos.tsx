
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  FolderPlus,
  Filter
} from 'lucide-react';

export default function Documentos() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    // Aqui seria onde atualizaríamos a lista de documentos
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Documentos" 
          subtitle="Gestão de documentos do escritório" 
        />
        
        {/* Estatísticas de Documentos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">PDFs</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Upload className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documentos Word</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Planilhas</p>
                  <p className="text-2xl font-bold">25</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Upload className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
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
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-lawblue-500 hover:bg-lawblue-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            
            <Button variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Pasta
            </Button>
          </div>
        </div>
        
        {/* Área de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <DocumentGrid searchQuery={searchQuery} />
            ) : (
              <DocumentTable searchQuery={searchQuery} />
            )}
          </CardContent>
        </Card>
        
        {/* Modal de Upload */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload de Documento</DialogTitle>
            </DialogHeader>
            <DocumentUploadForm onSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

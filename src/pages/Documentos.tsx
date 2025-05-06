
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentGrid } from '@/components/documents/DocumentGrid';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Grid, 
  List,
  Upload,
  FileSpreadsheet,
  FileText,
  FileImage,
  FilePdf
} from 'lucide-react';

export default function Documentos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Documentos" subtitle="Gestão de documentos do escritório" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar documentos..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="glass-card rounded-lg p-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 px-3" 
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-8 px-3" 
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" /> Fazer Upload
          </Button>
          
          <Button className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600">
            <Plus className="h-4 w-4" /> Novo Documento
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2 text-lawblue-500" />
                    Todos os Documentos
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FilePdf className="h-4 w-4 mr-2 text-red-500" />
                    Petições
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                    Contratos
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-500" />
                    Planilhas
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileImage className="h-4 w-4 mr-2 text-purple-500" />
                    Imagens
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Google Drive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-4">
                Os documentos são sincronizados automaticamente com o Google Drive do escritório.
              </div>
              <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span>Conectado à: mraposo@mrladvogados.com.br</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-3/4">
          {viewMode === 'grid' ? (
            <DocumentGrid searchQuery={searchQuery} />
          ) : (
            <DocumentTable searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}

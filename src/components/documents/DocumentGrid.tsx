import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  File, 
  FileSpreadsheet, 
  FileImage, 
  MoreVertical, 
  Download, 
  Trash2, 
  Share2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentGridProps {
  searchQuery: string;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'other';
  size: string;
  modified: string;
  owner: string;
  client?: string;
  processo?: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Petição Inicial - Processo 123.pdf', type: 'pdf', size: '2.4 MB', modified: '2025-05-03', owner: 'Dr. Ana Silva', client: 'Empresa ABC', processo: 'PROC-001/2025' },
  { id: '2', name: 'Contrato de Prestação de Serviços.docx', type: 'doc', size: '1.8 MB', modified: '2025-04-28', owner: 'Dr. Carlos Mendes', client: 'João da Silva' },
  { id: '3', name: 'Relatório Financeiro 2025.xlsx', type: 'xls', size: '3.5 MB', modified: '2025-05-01', owner: 'Dra. Maria Oliveira' },
  { id: '4', name: 'Comprovante de Pagamento.pdf', type: 'pdf', size: '1.2 MB', modified: '2025-05-04', owner: 'Dr. Paulo Santos', client: 'Distribuidora Bons Negócios' },
  { id: '5', name: 'Procuração.pdf', type: 'pdf', size: '0.9 MB', modified: '2025-04-29', owner: 'Dra. Ana Silva', client: 'Ricardo Almeida', processo: 'PROC-005/2025' },
  { id: '6', name: 'Fotos do Local.jpg', type: 'img', size: '4.7 MB', modified: '2025-04-25', owner: 'Dr. Carlos Mendes', client: 'Construtora XYZ', processo: 'PROC-003/2025' },
  { id: '7', name: 'Parecer Jurídico.docx', type: 'doc', size: '2.1 MB', modified: '2025-05-02', owner: 'Dr. Fernando Costa', client: 'Empresa ABC' },
  { id: '8', name: 'Planilha de Custas.xlsx', type: 'xls', size: '1.5 MB', modified: '2025-04-30', owner: 'Dra. Maria Oliveira' },
];

const getDocumentIcon = (type: string) => {
  switch(type) {
    case 'pdf':
      return <File className="h-10 w-10 text-red-500" />;
    case 'doc':
      return <FileText className="h-10 w-10 text-blue-500" />;
    case 'xls':
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    case 'img':
      return <FileImage className="h-10 w-10 text-purple-500" />;
    default:
      return <FileText className="h-10 w-10 text-gray-500" />;
  }
};

export function DocumentGrid({ searchQuery }: DocumentGridProps) {
  const filteredDocuments = searchQuery.trim() !== '' 
    ? mockDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (doc.client && doc.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.processo && doc.processo.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : mockDocuments;
  
  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FileText className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
        <p className="text-gray-500 mt-2">
          Não foram encontrados documentos para sua pesquisa "{searchQuery}".
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {filteredDocuments.map(doc => (
        <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              {getDocumentIcon(doc.type)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Compartilhar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-2 mb-2">{doc.name}</h3>
              <div className="text-xs text-gray-500 space-y-1">
                {doc.client && <div>Cliente: {doc.client}</div>}
                {doc.processo && <div>Processo: {doc.processo}</div>}
                <div>Modificado em: {new Date(doc.modified).toLocaleDateString('pt-BR')}</div>
                <div>Tamanho: {doc.size}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

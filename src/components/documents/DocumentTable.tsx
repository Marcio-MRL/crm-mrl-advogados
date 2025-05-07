
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  MoreHorizontal, 
  Download, 
  Eye 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentTableProps {
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
      return <File className="h-4 w-4 text-red-500" />;
    case 'doc':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'xls':
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    case 'img':
      return <FileImage className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export function DocumentTable({ searchQuery }: DocumentTableProps) {
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
    <div className="rounded-lg border shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Nome</TableHead>
            <TableHead className="hidden md:table-cell">Cliente</TableHead>
            <TableHead className="hidden lg:table-cell">Processo</TableHead>
            <TableHead className="hidden md:table-cell">Modificado</TableHead>
            <TableHead className="hidden md:table-cell">Tamanho</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map(doc => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc.type)}
                  <span className="font-medium">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {doc.client || "-"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {doc.processo || "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(doc.modified).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {doc.size}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Renomear</DropdownMenuItem>
                      <DropdownMenuItem>Mover</DropdownMenuItem>
                      <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

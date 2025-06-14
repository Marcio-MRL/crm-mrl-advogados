
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import type { DocumentMetadata } from '@/hooks/useGoogleDrive';

interface GoogleDriveDocumentTableProps {
  documents: DocumentMetadata[];
  onEdit?: (document: DocumentMetadata) => void;
  onDelete?: (document: DocumentMetadata) => void;
}

export function GoogleDriveDocumentTable({ 
  documents, 
  onEdit, 
  onDelete 
}: GoogleDriveDocumentTableProps) {
  const { getFileDownloadLink } = useGoogleDrive();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'contrato': 'bg-blue-100 text-blue-800',
      'peticao': 'bg-green-100 text-green-800',
      'procuracao': 'bg-purple-100 text-purple-800',
      'parecer': 'bg-orange-100 text-orange-800',
      'comprovante': 'bg-yellow-100 text-yellow-800',
      'sentenca': 'bg-red-100 text-red-800',
      'recurso': 'bg-indigo-100 text-indigo-800',
      'certidao': 'bg-pink-100 text-pink-800',
      'outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.outros;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'contrato': 'Contrato',
      'peticao': 'Petição',
      'procuracao': 'Procuração',
      'parecer': 'Parecer',
      'comprovante': 'Comprovante',
      'sentenca': 'Sentença',
      'recurso': 'Recurso',
      'certidao': 'Certidão',
      'outros': 'Outros'
    };
    return labels[category] || 'Outros';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = async (document: DocumentMetadata) => {
    const downloadLink = await getFileDownloadLink(document.drive_file_id);
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };

  const handleViewInDrive = (document: DocumentMetadata) => {
    const driveUrl = `https://drive.google.com/file/d/${document.drive_file_id}/view`;
    window.open(driveUrl, '_blank');
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum documento encontrado.</p>
        <p className="text-sm mt-1">Faça upload do primeiro documento para começar.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{document.name}</p>
                  {document.description && (
                    <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(document.category)}>
                  {getCategoryLabel(document.category)}
                </Badge>
              </TableCell>
              <TableCell>{formatFileSize(document.file_size)}</TableCell>
              <TableCell>
                {new Date(document.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewInDrive(document)}
                    title="Ver no Google Drive"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(document)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(document)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(document)}
                      title="Excluir"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

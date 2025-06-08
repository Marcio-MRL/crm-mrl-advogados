
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, MoreVertical, Edit, Trash2, FolderOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentFolder {
  id: string;
  name: string;
  documentCount: number;
  lastModified: string;
}

interface DocumentFoldersProps {
  folders: DocumentFolder[];
  onFolderClick: (folderId: string) => void;
  onFolderEdit: (folderId: string) => void;
  onFolderDelete: (folderId: string) => void;
}

const mockFolders: DocumentFolder[] = [
  { id: '1', name: 'Contratos', documentCount: 45, lastModified: '2025-05-03' },
  { id: '2', name: 'Processos Trabalhistas', documentCount: 32, lastModified: '2025-05-02' },
  { id: '3', name: 'Documentos Fiscais', documentCount: 28, lastModified: '2025-05-01' },
  { id: '4', name: 'Petições', documentCount: 67, lastModified: '2025-04-30' },
  { id: '5', name: 'Pareceres Jurídicos', documentCount: 19, lastModified: '2025-04-29' },
  { id: '6', name: 'Procurações', documentCount: 15, lastModified: '2025-04-28' }
];

export function DocumentFolders({
  folders = mockFolders,
  onFolderClick,
  onFolderEdit,
  onFolderDelete
}: DocumentFoldersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {folders.map(folder => (
        <Card 
          key={folder.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onFolderClick(folder.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Folder className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">{folder.name}</h3>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFolderClick(folder.id);
                    }}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>Abrir</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFolderEdit(folder.id);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Renomear</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFolderDelete(folder.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div>{folder.documentCount} documentos</div>
              <div>Modificado em: {new Date(folder.lastModified).toLocaleDateString('pt-BR')}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

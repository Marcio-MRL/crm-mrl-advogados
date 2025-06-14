
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Folder, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { GoogleDriveApiService } from '@/services/googleDriveApi';

interface DriveFolder {
  id: string;
  name: string;
}

interface FolderSelectorProps {
  selectedFolderId?: string;
  onFolderChange: (folderId: string) => void;
  label?: string;
  placeholder?: string;
}

export function FolderSelector({ 
  selectedFolderId, 
  onFolderChange, 
  label = "Pasta de destino",
  placeholder = "Selecione uma pasta"
}: FolderSelectorProps) {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const { driveToken, isConnected } = useGoogleDrive();

  const loadFolders = async () => {
    if (!driveToken || !isConnected) {
      return;
    }

    setLoading(true);
    try {
      const driveService = new GoogleDriveApiService(driveToken);
      const folderList = await driveService.listFolders();
      
      // Adicionar a pasta raiz como opção
      const allFolders = [
        { id: 'root', name: '📁 Raiz do Google Drive' },
        ...folderList.map(folder => ({
          id: folder.id,
          name: `📁 ${folder.name}`
        }))
      ];
      
      setFolders(allFolders);
      console.log('📁 Pastas carregadas:', allFolders.length);
    } catch (error) {
      console.error('❌ Erro ao carregar pastas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && driveToken) {
      loadFolders();
    }
  }, [isConnected, driveToken]);

  if (!isConnected) {
    return (
      <div>
        <Label>{label}</Label>
        <div className="text-sm text-gray-500 mt-1">
          Google Drive não conectado
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={loadFolders}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <Select value={selectedFolderId} onValueChange={onFolderChange}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {folders.map(folder => (
            <SelectItem key={folder.id} value={folder.id}>
              {folder.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && (
        <div className="text-xs text-gray-500 mt-1">
          Carregando pastas...
        </div>
      )}
    </div>
  );
}

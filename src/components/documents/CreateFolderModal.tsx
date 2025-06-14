
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus } from 'lucide-react';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { toast } from 'sonner';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const { driveToken, isConnected } = useGoogleDrive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!folderName.trim()) {
      toast.error('Nome da pasta é obrigatório');
      return;
    }

    if (!driveToken || !isConnected) {
      toast.error('Google Drive não está conectado');
      return;
    }

    setLoading(true);

    try {
      // Usar a API do Google Drive diretamente aqui
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${driveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName.trim(),
          mimeType: 'application/vnd.google-apps.folder'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pasta');
      }

      const result = await response.json();
      console.log('✅ Pasta criada com sucesso:', result);
      
      toast.success(`Pasta "${folderName}" criada com sucesso!`);
      setFolderName('');
      onClose();

    } catch (error) {
      console.error('❌ Erro ao criar pasta:', error);
      toast.error('Erro ao criar pasta no Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Nova Pasta no Google Drive
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="folderName">Nome da pasta *</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Ex: Contratos 2024"
              required
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim() || loading || !isConnected}
              className="bg-lawblue-500 hover:bg-lawblue-600"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Criando... <span className="animate-spin">⟳</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FolderPlus className="h-4 w-4" /> Criar Pasta
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

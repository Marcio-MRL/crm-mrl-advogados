
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Download } from 'lucide-react';
import { ExportModal } from './ExportModal';

interface GoogleSheetsToolbarProps {
  sheetsCount: number;
  onAddSheet: () => void;
  onDisconnect: () => void;
}

export function GoogleSheetsToolbar({ sheetsCount, onAddSheet, onDisconnect }: GoogleSheetsToolbarProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Planilhas adicionais: {sheetsCount}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddSheet}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Planilha
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDisconnect}
          >
            Desconectar
          </Button>
        </div>
      </div>

      <ExportModal 
        open={isExportModalOpen} 
        onOpenChange={setIsExportModalOpen} 
      />
    </>
  );
}

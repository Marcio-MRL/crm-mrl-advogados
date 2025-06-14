
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface GoogleSheetsToolbarProps {
  sheetsCount: number;
  onAddSheet: () => void;
  onDisconnect: () => void;
}

export function GoogleSheetsToolbar({ sheetsCount, onAddSheet, onDisconnect }: GoogleSheetsToolbarProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600">
        Planilhas adicionais: {sheetsCount}
      </p>
      <div className="flex gap-2">
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
  );
}

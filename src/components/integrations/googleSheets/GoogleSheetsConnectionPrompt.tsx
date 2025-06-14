
import React from 'react';
import { Button } from "@/components/ui/button";
import { HardDrive } from 'lucide-react';

interface GoogleSheetsConnectionPromptProps {
  onConnect: () => void;
}

export function GoogleSheetsConnectionPrompt({ onConnect }: GoogleSheetsConnectionPromptProps) {
  return (
    <div className="text-center py-8">
      <HardDrive className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">Conectar ao Google Sheets</h3>
      <p className="text-gray-600 mb-4">
        Integre outras planilhas do Google Sheets para sincronização de dados adicionais
      </p>
      <Button onClick={onConnect} className="bg-green-600 hover:bg-green-700">
        <HardDrive className="h-4 w-4 mr-2" />
        Conectar com Google Sheets
      </Button>
    </div>
  );
}

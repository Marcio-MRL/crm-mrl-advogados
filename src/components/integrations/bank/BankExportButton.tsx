
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { ExportModal } from '../googleSheets/ExportModal';

export function BankExportButton() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsExportModalOpen(true)}
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar Dados Financeiros
      </Button>

      <ExportModal 
        open={isExportModalOpen} 
        onOpenChange={setIsExportModalOpen} 
      />
    </>
  );
}

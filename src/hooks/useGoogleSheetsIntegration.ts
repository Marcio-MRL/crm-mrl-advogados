
import { useState } from 'react';
import { toast } from 'sonner';
import { SheetMapping } from '@/types/googleSheets';

export function useGoogleSheetsIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [sheets, setSheets] = useState<SheetMapping[]>([]);

  const handleConnect = () => {
    setIsConnected(true);
    toast.success('Conectado com Google Sheets com sucesso!');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSheets([]);
    toast.info('Desconectado do Google Sheets');
  };

  const handleSync = (sheetId: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? { ...sheet, status: 'syncing' as const }
        : sheet
    ));
    
    setTimeout(() => {
      setSheets(prev => prev.map(sheet => 
        sheet.id === sheetId 
          ? { ...sheet, status: 'connected' as const, lastSync: new Date().toISOString() }
          : sheet
      ));
      toast.success('Planilha sincronizada com sucesso!');
    }, 2000);
  };

  const handleAddSheet = (newSheet: Omit<SheetMapping, 'id' | 'lastSync' | 'status'>) => {
    if (!newSheet.name || !newSheet.url) {
      toast.error('Nome e URL são obrigatórios');
      return false;
    }

    const sheet: SheetMapping = {
      id: Date.now().toString(),
      name: newSheet.name,
      url: newSheet.url,
      lastSync: new Date().toISOString(),
      status: 'connected',
      type: newSheet.type
    };

    setSheets(prev => [...prev, sheet]);
    toast.success('Planilha adicionada com sucesso!');
    return true;
  };

  return {
    isConnected,
    sheets,
    handleConnect,
    handleDisconnect,
    handleSync,
    handleAddSheet
  };
}

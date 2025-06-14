
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings, CheckCircle, XCircle } from 'lucide-react';
import { SheetMapping } from '@/types/googleSheets';

interface GoogleSheetsListProps {
  sheets: SheetMapping[];
  onSync: (sheetId: string) => void;
}

export function GoogleSheetsList({ sheets, onSync }: GoogleSheetsListProps) {
  const getStatusIcon = (status: SheetMapping['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getTypeLabel = (type: SheetMapping['type']) => {
    switch (type) {
      case 'financial': return 'Financeiro';
      case 'clients': return 'Clientes';
      case 'processes': return 'Processos';
    }
  };

  const getTypeColor = (type: SheetMapping['type']) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800';
      case 'clients': return 'bg-blue-100 text-blue-800';
      case 'processes': return 'bg-purple-100 text-purple-800';
    }
  };

  if (sheets.length === 0) return null;

  return (
    <div className="space-y-3">
      {sheets.map((sheet) => (
        <div key={sheet.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{sheet.name}</h4>
              <Badge className={getTypeColor(sheet.type)}>
                {getTypeLabel(sheet.type)}
              </Badge>
              {getStatusIcon(sheet.status)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSync(sheet.id)}
                disabled={sheet.status === 'syncing'}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${sheet.status === 'syncing' ? 'animate-spin' : ''}`} />
                {sheet.status === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Última sincronização: {new Date(sheet.lastSync).toLocaleString('pt-BR')}</p>
            <p className="truncate">URL: {sheet.url}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

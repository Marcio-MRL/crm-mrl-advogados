
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw, FileSpreadsheet } from 'lucide-react';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';

interface SheetInfo {
  id: string;
  name: string;
}

interface BankSheetSelectorProps {
  selectedSheetId: string | null;
  onSheetSelect: (sheetId: string) => void;
  onRefreshSheets: () => void;
  isLoading?: boolean;
}

export function BankSheetSelector({ 
  selectedSheetId, 
  onSheetSelect, 
  onRefreshSheets,
  isLoading = false 
}: BankSheetSelectorProps) {
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const { tokens } = useGoogleOAuth();

  const sheetsToken = tokens.find(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  const loadSheets = async () => {
    if (!sheetsToken?.access_token) return;

    setLoadingSheets(true);
    try {
      console.log('🔍 Carregando lista de planilhas...');
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"&fields=files(id,name)`,
        {
          headers: {
            'Authorization': `Bearer ${sheetsToken.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const sheetList = data.files?.map((file: any) => ({
          id: file.id,
          name: file.name
        })) || [];
        
        console.log('📊 Planilhas encontradas:', sheetList.length);
        setSheets(sheetList);
      } else {
        console.error('❌ Erro ao carregar planilhas:', response.status);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar planilhas:', error);
    } finally {
      setLoadingSheets(false);
    }
  };

  useEffect(() => {
    if (sheetsToken?.access_token) {
      loadSheets();
    }
  }, [sheetsToken?.access_token]);

  const handleRefresh = () => {
    loadSheets();
    onRefreshSheets();
  };

  if (!sheetsToken) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          Conecte-se ao Google Sheets primeiro nas configurações para selecionar uma planilha.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Selecionar Planilha Bancária</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loadingSheets || isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingSheets ? 'animate-spin' : ''}`} />
          Atualizar Lista
        </Button>
      </div>

      <div className="space-y-2">
        <Select value={selectedSheetId || ''} onValueChange={onSheetSelect} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha uma planilha..." />
          </SelectTrigger>
          <SelectContent>
            {sheets.map((sheet) => (
              <SelectItem key={sheet.id} value={sheet.id}>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>{sheet.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {sheets.length === 0 && !loadingSheets && (
          <p className="text-xs text-gray-500">
            Nenhuma planilha encontrada. Verifique se você tem planilhas no Google Drive.
          </p>
        )}

        {loadingSheets && (
          <p className="text-xs text-gray-500">Carregando planilhas...</p>
        )}
      </div>

      {selectedSheetId && (
        <div className="text-xs text-green-600">
          ✓ Planilha selecionada: {sheets.find(s => s.id === selectedSheetId)?.name || 'Carregando...'}
        </div>
      )}
    </div>
  );
}

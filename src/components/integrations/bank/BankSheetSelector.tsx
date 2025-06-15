
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { tokens } = useGoogleOAuth();

  const sheetsToken = tokens.find(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  const loadSheets = async () => {
    if (!sheetsToken?.access_token) return;

    setLoadingSheets(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      console.log('🔍 Carregando lista de planilhas...');
      console.log('🔑 Token info:', {
        hasToken: !!sheetsToken.access_token,
        scope: sheetsToken.scope,
        tokenLength: sheetsToken.access_token?.length || 0
      });

      // Primeiro, vamos testar se conseguimos acessar informações básicas do usuário
      console.log('🧪 Testando acesso básico ao Drive...');
      const testResponse = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=user',
        {
          headers: {
            'Authorization': `Bearer ${sheetsToken.access_token}`,
          },
        }
      );

      console.log('🧪 Teste de acesso:', {
        status: testResponse.status,
        statusText: testResponse.statusText,
        ok: testResponse.ok
      });

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('❌ Erro no teste de acesso:', errorText);
        throw new Error(`Erro de acesso ao Google Drive (${testResponse.status}): ${errorText}`);
      }

      const testData = await testResponse.json();
      console.log('✅ Acesso ao Drive OK. Usuário:', testData.user?.emailAddress);

      // Agora vamos listar as planilhas com informações detalhadas
      console.log('📊 Buscando planilhas do Google Sheets...');
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet" and trashed=false&fields=files(id,name,parents,createdTime,modifiedTime,size,owners)&orderBy=modifiedTime desc`,
        {
          headers: {
            'Authorization': `Bearer ${sheetsToken.access_token}`,
          },
        }
      );

      console.log('📊 Resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro ao buscar planilhas:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });

        // Vamos tentar entender melhor o erro
        if (response.status === 403) {
          setError('Erro de permissão (403): O token não tem permissão para acessar o Google Drive. Verifique se o escopo "drive" ou "drive.readonly" foi incluído na autenticação.');
        } else if (response.status === 401) {
          setError('Erro de autenticação (401): Token expirado ou inválido. Tente reconectar ao Google Sheets.');
        } else {
          setError(`Erro ${response.status}: ${errorText}`);
        }
        return;
      }

      const data = await response.json();
      console.log('📊 Dados recebidos:', data);

      const sheetList = data.files?.map((file: any) => ({
        id: file.id,
        name: file.name
      })) || [];
      
      console.log('📊 Planilhas encontradas:', sheetList.length);
      console.log('📊 Lista de planilhas:', sheetList);

      setSheets(sheetList);
      setDebugInfo({
        totalFiles: data.files?.length || 0,
        userEmail: testData.user?.emailAddress,
        tokenScope: sheetsToken.scope
      });

      if (sheetList.length === 0) {
        setError('Nenhuma planilha encontrada no Google Drive. Verifique se você tem planilhas Google Sheets (.gsheet) na sua conta.');
      }

    } catch (error) {
      console.error('❌ Erro ao buscar planilhas:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro desconhecido ao buscar planilhas');
      }
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

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <strong>Debug Info:</strong><br />
          • Usuário: {debugInfo.userEmail}<br />
          • Planilhas encontradas: {debugInfo.totalFiles}<br />
          • Escopo do token: {debugInfo.tokenScope}
        </div>
      )}

      <div className="space-y-2">
        <Select value={selectedSheetId || ''} onValueChange={onSheetSelect} disabled={isLoading || loadingSheets}>
          <SelectTrigger>
            <SelectValue placeholder={
              loadingSheets ? "Carregando planilhas..." : 
              error ? "Erro ao carregar planilhas" :
              sheets.length === 0 ? "Nenhuma planilha encontrada" :
              "Escolha uma planilha..."
            } />
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

        {loadingSheets && (
          <p className="text-xs text-gray-500">Carregando planilhas...</p>
        )}
      </div>

      {selectedSheetId && sheets.length > 0 && (
        <div className="text-xs text-green-600">
          ✓ Planilha selecionada: {sheets.find(s => s.id === selectedSheetId)?.name || 'Carregando...'}
        </div>
      )}
    </div>
  );
}

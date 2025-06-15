
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefreshCw, FileSpreadsheet, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [scopeError, setScopeError] = useState(false);
  const { tokens } = useGoogleOAuth();

  const sheetsToken = tokens.find(token => 
    token.scope?.includes('spreadsheets')
  );

  const loadSheets = async () => {
    if (!sheetsToken?.access_token) return;

    setLoadingSheets(true);
    setError(null);
    setScopeError(false);
    
    try {
      console.log('🔍 Buscando planilhas usando apenas Google Sheets API...');
      console.log('🔑 Token info:', {
        hasToken: !!sheetsToken.access_token,
        scope: sheetsToken.scope,
        tokenLength: sheetsToken.access_token?.length || 0
      });

      // Como não temos acesso ao Drive, vamos sugerir que o usuário insira o ID da planilha manualmente
      // ou tentar algumas planilhas conhecidas
      
      // Lista de planilhas para testar (pode ser expandida)
      const knownSheetNames = [
        'BTG - Entradas e Saídas Caixa',
        'Controle Financeiro',
        'Movimentações Bancárias',
        'Fluxo de Caixa'
      ];

      console.log('⚠️ Devido às limitações de escopo, não é possível listar todas as planilhas automaticamente.');
      console.log('💡 Para resolver isso, você pode:');
      console.log('1. Reconectar ao Google Sheets com permissões de Drive');
      console.log('2. Ou inserir o ID da planilha manualmente');

      // Por enquanto, retornar lista vazia e mostrar instruções
      setSheets([]);
      setError('Para listar planilhas automaticamente, é necessário reconectar com permissões do Google Drive. Por favor, insira o ID da planilha manualmente ou reconecte nas configurações.');

    } catch (error) {
      console.error('❌ Erro ao buscar planilhas:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient authentication scopes') || 
            error.message.includes('ACCESS_TOKEN_SCOPE_INSUFFICIENT')) {
          setScopeError(true);
          setError('O token atual não tem permissão para acessar o Google Drive. Para listar planilhas automaticamente, reconecte nas configurações e inclua permissões do Drive.');
        } else {
          setError(error.message);
        }
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

  const handleManualSheetId = () => {
    const sheetId = prompt('Cole aqui o ID da planilha do Google Sheets (encontrado na URL):');
    if (sheetId && sheetId.trim()) {
      const cleanId = sheetId.trim();
      console.log('📊 ID da planilha inserido manualmente:', cleanId);
      onSheetSelect(cleanId);
      
      // Adicionar à lista local para exibição
      const manualSheet = {
        id: cleanId,
        name: 'Planilha Selecionada Manualmente'
      };
      setSheets([manualSheet]);
    }
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loadingSheets || isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingSheets ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSheetId}
            disabled={isLoading}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            ID Manual
          </Button>
        </div>
      </div>

      {scopeError && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm text-orange-800">
            <strong>Limitação de Escopo:</strong> O token atual tem apenas permissão para Google Sheets, 
            não para o Google Drive. Para listar planilhas automaticamente, reconecte nas configurações 
            e inclua permissões do Drive, ou use o botão "ID Manual" para inserir o ID da planilha diretamente.
          </AlertDescription>
        </Alert>
      )}

      {error && !scopeError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Select value={selectedSheetId || ''} onValueChange={onSheetSelect} disabled={isLoading || loadingSheets}>
          <SelectTrigger>
            <SelectValue placeholder={
              loadingSheets ? "Carregando planilhas..." : 
              error ? "Use 'ID Manual' para selecionar" :
              sheets.length === 0 ? "Use 'ID Manual' para inserir ID da planilha" :
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
          <p className="text-xs text-gray-500">Verificando permissões...</p>
        )}
      </div>

      {selectedSheetId && (
        <div className="text-xs text-green-600">
          ✓ Planilha selecionada: {sheets.find(s => s.id === selectedSheetId)?.name || `ID: ${selectedSheetId.substring(0, 20)}...`}
        </div>
      )}

      <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
        <strong>💡 Dica:</strong> Para encontrar o ID da planilha, abra-a no Google Sheets e copie o ID da URL 
        (a parte entre /spreadsheets/d/ e /edit). Por exemplo: 
        <code className="bg-white px-1 rounded ml-1">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</code>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { BankIntegrationService } from '@/services/bankIntegrationService';
import { BankIntegrationStatus, BankSyncResult } from '@/types/bankIntegration';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';

export function BankIntegrationSection() {
  const [status, setStatus] = useState<BankIntegrationStatus>({
    connected: false,
    lastSync: null,
    totalTransactions: 0,
    lastTransaction: null,
    syncInProgress: false
  });
  const [syncProgress, setSyncProgress] = useState(0);
  const { tokens } = useGoogleOAuth();

  // Verificar se tem token do Google Sheets
  const sheetsToken = tokens.find(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const statusData = await BankIntegrationService.getBankIntegrationStatus();
      setStatus(prev => ({ ...prev, ...statusData }));
    } catch (error) {
      console.error('❌ Erro ao carregar status:', error);
    }
  };

  const handleSync = async () => {
    if (!sheetsToken) {
      toast.error('Conecte-se ao Google Sheets primeiro nas configurações');
      return;
    }

    setStatus(prev => ({ ...prev, syncInProgress: true }));
    setSyncProgress(0);

    try {
      toast.info('Iniciando sincronização com planilha bancária...');
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result: BankSyncResult = await BankIntegrationService.syncWithBankSheet(sheetsToken.access_token);
      
      clearInterval(progressInterval);
      setSyncProgress(100);

      if (result.success) {
        toast.success(
          `Sincronização concluída! ${result.newTransactions} novas transações importadas.`
        );
        
        // Atualizar status
        await loadStatus();
      } else {
        toast.error(`Erro na sincronização: ${result.errors.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      toast.error('Erro inesperado durante a sincronização');
    } finally {
      setStatus(prev => ({ ...prev, syncInProgress: false }));
      setSyncProgress(0);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <CardTitle>Integração Bancária BTG</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {status.connected ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="outline">
                <AlertCircle className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informações da Integração */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            Planilha: "BTG - Entradas e Saídas Caixa"
          </h3>
          <p className="text-sm text-blue-700">
            Sincronização automática com a planilha bancária do BTG. 
            As movimentações são importadas automaticamente conforme chegam da automação bancária.
          </p>
        </div>

        {/* Estatísticas */}
        {status.connected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total de Transações</span>
              </div>
              <span className="text-xl font-bold">{status.totalTransactions}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Última Sincronização</span>
              </div>
              <span className="text-sm">
                {status.lastSync ? formatDate(status.lastSync) : 'Nunca'}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Última Transação</span>
              </div>
              <span className="text-sm">
                {status.lastTransaction ? 
                  `${formatCurrency(status.lastTransaction.valor)} - ${status.lastTransaction.credito_debito}` :
                  'Nenhuma'
                }
              </span>
            </div>
          </div>
        )}

        {/* Progresso de Sincronização */}
        {status.syncInProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sincronizando...</span>
              <span className="text-sm text-gray-500">{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="w-full" />
          </div>
        )}

        {/* Última Transação */}
        {status.lastTransaction && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Última Movimentação</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Data:</span>
                <p className="font-medium">{formatDate(status.lastTransaction.data)}</p>
              </div>
              <div>
                <span className="text-gray-500">Tipo:</span>
                <p className={`font-medium ${
                  status.lastTransaction.credito_debito === 'Crédito' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status.lastTransaction.credito_debito}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Valor:</span>
                <p className="font-medium">{formatCurrency(status.lastTransaction.valor)}</p>
              </div>
              <div>
                <span className="text-gray-500">Descrição:</span>
                <p className="font-medium">{status.lastTransaction.descricao}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSync}
            disabled={!sheetsToken || status.syncInProgress}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${status.syncInProgress ? 'animate-spin' : ''}`} />
            {status.syncInProgress ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>
          
          {!sheetsToken && (
            <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Conecte-se ao Google Sheets nas configurações para habilitar a sincronização
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-1">Como funciona:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>A automação do BTG adiciona novas movimentações na planilha automaticamente</li>
            <li>Use o botão "Sincronizar Agora" para importar as novas transações</li>
            <li>As transações são categorizadas automaticamente no módulo financeiro</li>
            <li>Para dados históricos, faça upload manual da planilha completa</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

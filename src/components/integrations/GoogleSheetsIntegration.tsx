
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GoogleDrive, RefreshCw, Settings, CheckCircle, XCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface SheetMapping {
  id: string;
  name: string;
  url: string;
  lastSync: string;
  status: 'connected' | 'error' | 'syncing';
  type: 'financial' | 'clients' | 'processes';
}

export function GoogleSheetsIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetMapping[]>([
    {
      id: '1',
      name: 'Controle Financeiro 2024',
      url: 'https://docs.google.com/spreadsheets/d/abc123',
      lastSync: '2024-06-07T10:30:00Z',
      status: 'connected',
      type: 'financial'
    }
  ]);
  
  const [newSheet, setNewSheet] = useState({
    name: '',
    url: '',
    type: 'financial' as 'financial' | 'clients' | 'processes'
  });

  const handleConnect = () => {
    // Simulação da conexão com Google Sheets
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
    
    // Simular sincronização
    setTimeout(() => {
      setSheets(prev => prev.map(sheet => 
        sheet.id === sheetId 
          ? { ...sheet, status: 'connected' as const, lastSync: new Date().toISOString() }
          : sheet
      ));
      toast.success('Planilha sincronizada com sucesso!');
    }, 2000);
  };

  const handleAddSheet = () => {
    if (!newSheet.name || !newSheet.url) {
      toast.error('Nome e URL são obrigatórios');
      return;
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
    setNewSheet({ name: '', url: '', type: 'financial' });
    setIsConfigModalOpen(false);
    toast.success('Planilha adicionada com sucesso!');
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GoogleDrive className="h-6 w-6 text-green-600" />
              <CardTitle>Integração Google Sheets</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="outline">
                  <XCircle className="h-3 w-3 mr-1" />
                  Desconectado
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-8">
              <GoogleDrive className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Conectar ao Google Sheets</h3>
              <p className="text-gray-600 mb-4">
                Integre suas planilhas do Google Sheets para sincronização automática de dados
              </p>
              <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                <GoogleDrive className="h-4 w-4 mr-2" />
                Conectar com Google Sheets
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Planilhas conectadas: {sheets.length}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsConfigModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Planilha
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDisconnect}
                  >
                    Desconectar
                  </Button>
                </div>
              </div>

              {sheets.length > 0 && (
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
                            onClick={() => handleSync(sheet.id)}
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
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Configuração */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Planilha</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Planilha</label>
              <Input
                placeholder="Ex: Controle Financeiro 2024"
                value={newSheet.name}
                onChange={(e) => setNewSheet({...newSheet, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL da Planilha</label>
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={newSheet.url}
                onChange={(e) => setNewSheet({...newSheet, url: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Dados</label>
              <Select 
                value={newSheet.type} 
                onValueChange={(value: 'financial' | 'clients' | 'processes') => 
                  setNewSheet({...newSheet, type: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="processes">Processos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddSheet}>
                Adicionar Planilha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

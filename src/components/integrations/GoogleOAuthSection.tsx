
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export function GoogleOAuthSection() {
  const { isServiceConnected, initiateGoogleAuth, disconnectService, loading } = useGoogleAuth();

  const isConnected = isServiceConnected('calendar');

  const handleConnect = () => {
    initiateGoogleAuth('calendar');
  };

  const handleDisconnect = () => {
    disconnectService('calendar');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              🔐 Autenticação Google
            </CardTitle>
            <CardDescription>
              Gerencie sua conexão com os serviços do Google
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Conectado
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Desconectado
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Conexão ativa</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Sua conta Google está conectada e funcionando corretamente
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="flex-1"
                disabled={loading}
              >
                Desconectar
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                disabled
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700">
                <XCircle className="h-4 w-4" />
                <span className="font-medium">Conexão necessária</span>
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                Conecte sua conta Google para acessar todas as funcionalidades da agenda
              </p>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full flex items-center gap-2"
              disabled={loading}
            >
              <ExternalLink className="h-4 w-4" />
              {loading ? 'Conectando...' : 'Conectar com Google'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

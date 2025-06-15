
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink } from 'lucide-react';
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
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              🔐 Conexão Google
            </CardTitle>
            <CardDescription className="text-sm">
              Status da autenticação
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
            {isConnected ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {isConnected ? (
          <div className="space-y-3">
            <div className="text-sm text-green-600 font-medium">
              ✓ Conectado com sucesso
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDisconnect}
                className="flex-1"
                disabled={loading}
              >
                Desconectar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="px-3"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Conecte sua conta Google para acessar todas as funcionalidades
            </div>
            <Button 
              onClick={handleConnect} 
              className="w-full flex items-center gap-2"
              size="sm"
              disabled={loading}
            >
              <ExternalLink className="h-4 w-4" />
              {loading ? 'Conectando...' : 'Conectar Google'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

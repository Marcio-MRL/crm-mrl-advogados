
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sheet, HardDrive, Unlink, RefreshCw, Trash2 } from 'lucide-react';
import { useGoogleOAuthComplete } from '@/hooks/useGoogleOAuthComplete';
import { useAuth } from '@/contexts/AuthContext';

export function CompleteGoogleOAuthSection() {
  const { user } = useAuth();
  const { 
    tokens, 
    loading, 
    clientId,
    services,
    initiateOAuth, 
    revokeToken, 
    revokeAllUserTokens,
    isServiceConnected,
    refetch 
  } = useGoogleOAuthComplete();

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  console.log('CompleteGoogleOAuthSection Debug:', {
    clientId,
    isAuthorizedDomain,
    tokensCount: tokens.length,
    services: services.map(s => ({
      type: s.type,
      connected: isServiceConnected(s.type)
    }))
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integrações Google OAuth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Carregando integrações...</div>
        </CardContent>
      </Card>
    );
  }

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="h-8 w-8 text-blue-600" />;
      case 'Sheet':
        return <Sheet className="h-8 w-8 text-green-600" />;
      case 'HardDrive':
        return <HardDrive className="h-8 w-8 text-yellow-600" />;
      default:
        return <Calendar className="h-8 w-8 text-gray-600" />;
    }
  };

  const getServiceColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-600 hover:bg-gray-700';
  };

  const handleConnect = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    console.log('Tentando conectar serviço:', serviceType);
    await initiateOAuth(serviceType);
  };

  const handleDisconnect = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    const service = services.find(s => s.type === serviceType);
    if (!service) return;

    // Encontrar todos os tokens que correspondem ao escopo do serviço
    const serviceTokens = tokens.filter(t => 
      t.scope?.includes(service.scope)
    );
    
    console.log(`🗑️ Desconectando ${serviceType}:`, {
      scope: service.scope,
      tokensFound: serviceTokens.length,
      tokenIds: serviceTokens.map(t => t.id.substring(0, 8))
    });
    
    // Revogar todos os tokens relacionados ao serviço
    for (const token of serviceTokens) {
      await revokeToken(token.id);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Atualizando tokens...');
    refetch();
  };

  const handleRevokeAll = async () => {
    if (confirm('Tem certeza que deseja desconectar TODOS os serviços Google?')) {
      await revokeAllUserTokens();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Integrações Google OAuth
        </CardTitle>
        <CardDescription>
          Conecte-se aos serviços Google para expandir funcionalidades
        </CardDescription>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Status
          </Button>
          
          {tokens.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAll}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Desconectar Todos
            </Button>
          )}
        </div>
        
        {!isAuthorizedDomain && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              As integrações Google estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
            </p>
          </div>
        )}
        {!clientId && isAuthorizedDomain && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Configure as credenciais OAuth na seção de configurações para habilitar as integrações.
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {services.map((service) => {
          const isConnected = isServiceConnected(service.type);
          const canConnect = isAuthorizedDomain && clientId;
          
          return (
            <div key={service.type} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getServiceIcon(service.icon)}
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">
                    {service.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Escopo: {service.scope}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(service.type)}
                      disabled={!canConnect}
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleConnect(service.type)}
                    disabled={!canConnect}
                    className={canConnect ? getServiceColor(service.color) : ''}
                  >
                    {getServiceIcon(service.icon)}
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> As integrações OAuth estão restritas ao domínio @mrladvogados.com.br 
          e precisam ser configuradas com credenciais válidas do Google Cloud Console.
        </div>

        {tokens.length > 0 && (
          <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
            <strong>Debug:</strong> {tokens.length} token(s) encontrado(s). 
            Clique em "Atualizar Status" se a exibição não estiver correta.
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sheet, HardDrive, Unlink } from 'lucide-react';
import { useGoogleOAuthComplete } from '@/hooks/useGoogleOAuthComplete';
import { useAuth } from '@/contexts/AuthContext';

export function CompleteGoogleOAuthSection() {
  const { user } = useAuth();
  const { 
    tokens, 
    loading, 
    clientId,
    initiateOAuth, 
    revokeToken, 
    isServiceConnected,
    services 
  } = useGoogleOAuthComplete();

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  console.log('CompleteGoogleOAuthSection Debug:', {
    clientId,
    isAuthorizedDomain,
    tokens,
    loading
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
    console.log('Client ID disponível:', !!clientId);
    console.log('Usuário autorizado:', isAuthorizedDomain);
    
    try {
      await initiateOAuth(serviceType);
    } catch (error) {
      console.error('Erro ao conectar:', error);
    }
  };

  const handleDisconnect = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    const serviceConfig = services.find(s => s.type === serviceType);
    if (!serviceConfig) return;

    const token = tokens.find(t => 
      t.scope?.includes(serviceConfig.scope)
    );
    
    if (token) {
      await revokeToken(token.id);
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
      </CardContent>
    </Card>
  );
}

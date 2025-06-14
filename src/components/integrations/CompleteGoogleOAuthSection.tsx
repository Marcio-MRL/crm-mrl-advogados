
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, HardDrive, Check, ExternalLink, Unlink, AlertCircle } from 'lucide-react';
import { useGoogleOAuthComplete } from '@/hooks/useGoogleOAuthComplete';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'calendar': return Calendar;
      case 'sheets': return FileText;
      case 'drive': return HardDrive;
      default: return FileText;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'calendar': return 'text-blue-600';
      case 'sheets': return 'text-green-600';
      case 'drive': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleConnect = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    if (!isAuthorizedDomain) {
      toast.error('Integração disponível apenas para usuários do domínio @mrladvogados.com.br');
      return;
    }

    if (!clientId) {
      toast.error('Configure as credenciais OAuth do Google primeiro nas configurações do sistema.');
      return;
    }

    try {
      await initiateOAuth(serviceType);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast.error('Erro ao iniciar conexão com Google');
    }
  };

  const handleDisconnect = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    const serviceToken = tokens.find(token => 
      token.scope?.includes(services.find(s => s.type === serviceType)?.scope || '')
    );

    if (serviceToken) {
      await revokeToken(serviceToken.id);
    } else {
      toast.info(`${serviceType} não está conectado`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrações Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Carregando integrações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Integrações Google OAuth
          </CardTitle>
          <CardDescription>
            Configure integrações com serviços do Google para expandir funcionalidades
          </CardDescription>
          
          {!isAuthorizedDomain && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                As integrações Google estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
              </AlertDescription>
            </Alert>
          )}

          {!clientId && isAuthorizedDomain && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure as credenciais OAuth do Google nas configurações do sistema para ativar as integrações.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {services.map((service) => {
            const Icon = getServiceIcon(service.type);
            const isConnected = isServiceConnected(service.type);
            
            return (
              <div key={service.type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-8 w-8 ${getServiceColor(service.type)}`} />
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    {isConnected && (
                      <div className="flex items-center gap-2 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Conectado e ativo</span>
                      </div>
                    )}
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
                        disabled={!isAuthorizedDomain}
                      >
                        <Unlink className="h-4 w-4 mr-1" />
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(service.type)}
                      disabled={!isAuthorizedDomain || !clientId}
                      className={`${service.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                                  service.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 
                                  'bg-yellow-600 hover:bg-yellow-700'}`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Seção de ajuda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Como Configurar Integrações Google
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HardDrive className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">Configuração OAuth</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Para utilizar as integrações Google, configure as credenciais OAuth no Google Cloud Console:
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>1. Acesse o Google Cloud Console</p>
                  <p>2. Configure as credenciais OAuth 2.0</p>
                  <p>3. Adicione os tokens nas configurações do sistema</p>
                  <p>4. Ative as APIs necessárias (Drive, Calendar, Sheets)</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                className="text-blue-600 border-blue-200"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Console
              </Button>
            </div>
          </div>

          {isAuthorizedDomain && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Status do Sistema:</strong> {clientId ? 
                'Credenciais OAuth configuradas. Você pode conectar aos serviços Google.' : 
                'Credenciais OAuth não configuradas. Configure no Google Cloud Console primeiro.'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

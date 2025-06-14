
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Sheet, HardDrive, Unlink, ExternalLink, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { useGoogleOAuthComplete, OAUTH_SERVICES } from '@/hooks/useGoogleOAuthComplete';
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
  const isConfigured = clientId !== null;

  const getServiceIcon = (iconName: string, color: string) => {
    const iconProps = { className: `h-8 w-8 text-${color}-600` };
    
    switch (iconName) {
      case 'Calendar':
        return <Calendar {...iconProps} />;
      case 'Sheet':
        return <Sheet {...iconProps} />;
      case 'HardDrive':
        return <HardDrive {...iconProps} />;
      default:
        return <ExternalLink {...iconProps} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrações Google OAuth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integrações Google Workspace
          </CardTitle>
          
          {/* Status da configuração */}
          <div className="space-y-2">
            {!isConfigured && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800 font-medium">
                    OAuth não configurado
                  </p>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Configure as credenciais GOOGLE_OAUTH_CLIENT_ID e GOOGLE_OAUTH_CLIENT_SECRET no Supabase.
                </p>
              </div>
            )}
            
            {!isAuthorizedDomain && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    As integrações Google estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
                  </p>
                </div>
              </div>
            )}
            
            {isConfigured && isAuthorizedDomain && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">
                    OAuth configurado e pronto para uso
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Serviços Disponíveis */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Serviços Disponíveis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((service) => {
                const connected = isServiceConnected(service.type);
                const canConnect = isConfigured && isAuthorizedDomain;
                
                return (
                  <div key={service.type} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getServiceIcon(service.icon, service.color)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{service.name}</h4>
                          {connected && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conectado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </div>
                    
                    {connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const token = tokens.find(t => t.scope?.includes(service.scope));
                          if (token) {
                            revokeToken(token.id);
                          }
                        }}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    ) : (
                      <Button
                        onClick={() => initiateOAuth(service.type)}
                        disabled={!canConnect}
                        className={`w-full ${canConnect ? `bg-${service.color}-600 hover:bg-${service.color}-700` : 'bg-gray-400'}`}
                        size="sm"
                      >
                        {canConnect ? (
                          <>
                            {getServiceIcon(service.icon, 'white')}
                            <span className="ml-2">Conectar</span>
                          </>
                        ) : (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            <span>Configurar primeiro</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tokens Ativos */}
          {tokens.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Integrações Ativas</h3>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Escopo</TableHead>
                      <TableHead>Conectado em</TableHead>
                      <TableHead>Expira em</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokens.map((token) => {
                      const service = services.find(s => token.scope?.includes(s.scope));
                      const isExpired = token.expires_at ? new Date(token.expires_at) < new Date() : false;
                      
                      return (
                        <TableRow key={token.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {service && getServiceIcon(service.icon, service.color)}
                              {service?.name || 'Serviço Google'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {token.scope?.split(' ').pop()?.split('/').pop() || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(token.created_at)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {token.expires_at ? formatDate(token.expires_at) : 'Não expira'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={isExpired ? "destructive" : "default"}
                              className={isExpired ? "" : "bg-green-100 text-green-800"}
                            >
                              {isExpired ? 'Expirado' : 'Ativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeToken(token.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Unlink className="h-4 w-4 mr-1" />
                              Revogar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p><strong>Configuração necessária:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Configure as credenciais OAuth no Google Cloud Console</li>
              <li>Adicione as variáveis GOOGLE_OAUTH_CLIENT_ID e GOOGLE_OAUTH_CLIENT_SECRET nos secrets do Supabase</li>
              <li>Configure os domínios autorizados no Google Cloud Console</li>
              <li>URL de callback: <code className="bg-gray-200 px-1 rounded">{window.location.origin}/auth/google/callback</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

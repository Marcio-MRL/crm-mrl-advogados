
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Sheet, Drive, Unlink, ExternalLink } from 'lucide-react';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/integrations/supabase/client';

export function GoogleIntegrationsSettings() {
  const { user } = useAuth();
  const { tokens, loading, initiateGoogleAuth, revokeOAuthToken } = useGoogleOAuth();

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  const getServiceIcon = (scope?: string) => {
    if (!scope) return <ExternalLink className="h-4 w-4" />;
    
    if (scope.includes('calendar')) return <Calendar className="h-4 w-4 text-blue-600" />;
    if (scope.includes('spreadsheets')) return <Sheet className="h-4 w-4 text-green-600" />;
    if (scope.includes('drive')) return <Drive className="h-4 w-4 text-yellow-600" />;
    
    return <ExternalLink className="h-4 w-4" />;
  };

  const getServiceName = (scope?: string) => {
    if (!scope) return 'Serviço Google';
    
    if (scope.includes('calendar')) return 'Google Calendar';
    if (scope.includes('spreadsheets')) return 'Google Sheets';
    if (scope.includes('drive')) return 'Google Drive';
    
    return 'Serviço Google';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Integrações Google Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Carregando integrações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Integrações Google Workspace
        </CardTitle>
        <CardDescription>
          Gerencie suas integrações com os serviços do Google Workspace
        </CardDescription>
        {!isAuthorizedDomain && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              As integrações Google estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Serviços Disponíveis */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Serviços Disponíveis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500">Sincronize audiências e compromissos</p>
                </div>
              </div>
              <Button
                onClick={() => initiateGoogleAuth('calendar')}
                disabled={!isAuthorizedDomain}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Conectar Calendar
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Sheet className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-medium">Google Sheets</h4>
                  <p className="text-sm text-gray-500">Exporte relatórios e dados</p>
                </div>
              </div>
              <Button
                onClick={() => initiateGoogleAuth('sheets')}
                disabled={!isAuthorizedDomain}
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Sheet className="h-4 w-4 mr-2" />
                Conectar Sheets
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Drive className="h-8 w-8 text-yellow-600" />
                <div>
                  <h4 className="font-medium">Google Drive</h4>
                  <p className="text-sm text-gray-500">Armazene e compartilhe documentos</p>
                </div>
              </div>
              <Button
                onClick={() => initiateGoogleAuth('drive')}
                disabled={!isAuthorizedDomain}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                size="sm"
              >
                <Drive className="h-4 w-4 mr-2" />
                Conectar Drive
              </Button>
            </div>
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
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getServiceIcon(token.scope)}
                          {getServiceName(token.scope)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{token.scope}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(token.created_at)}</TableCell>
                      <TableCell>
                        {token.expires_at ? formatDate(token.expires_at) : 'Não expira'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeOAuthToken(token.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          Revogar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> As integrações OAuth com Google Workspace são exclusivas para o domínio 
          @mrladvogados.com.br e precisam ser liberadas pelo usuário master antes de serem ativadas.
          Entre em contato com o administrador para configurar as credenciais OAuth.
        </div>
      </CardContent>
    </Card>
  );
}

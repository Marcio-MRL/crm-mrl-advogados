
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sheet, Unlink } from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAuth } from '@/contexts/AuthContext';

export function GoogleOAuthSection() {
  const { user } = useAuth();
  const { 
    integrations, 
    loading, 
    initiateGoogleAuth, 
    disconnectService, 
    isServiceConnected 
  } = useGoogleAuth();

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integrações Google
          </CardTitle>
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
          Integrações Google OAuth
        </CardTitle>
        {!isAuthorizedDomain && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              As integrações Google estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Calendar Integration */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium">Google Calendar</h3>
              <p className="text-sm text-gray-500">
                Sincronize suas audiências e compromissos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isServiceConnected('calendar') ? (
              <>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Conectado
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectService('calendar')}
                  disabled={!isAuthorizedDomain}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Desconectar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => initiateGoogleAuth('calendar')}
                disabled={!isAuthorizedDomain}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Conectar
              </Button>
            )}
          </div>
        </div>

        {/* Google Sheets Integration */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Sheet className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium">Google Sheets</h3>
              <p className="text-sm text-gray-500">
                Exporte relatórios e dados para planilhas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isServiceConnected('sheets') ? (
              <>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Conectado
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnectService('sheets')}
                  disabled={!isAuthorizedDomain}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Desconectar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => initiateGoogleAuth('sheets')}
                disabled={!isAuthorizedDomain}
                className="bg-green-600 hover:bg-green-700"
              >
                <Sheet className="h-4 w-4 mr-1" />
                Conectar
              </Button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> As integrações OAuth estão restritas ao domínio @mrladvogados.com.br 
          e precisam ser liberadas pelo usuário master antes de serem ativadas.
        </div>
      </CardContent>
    </Card>
  );
}

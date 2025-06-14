
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Check, ExternalLink, Unlink } from 'lucide-react';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function GoogleDriveIntegrationSection() {
  const { user } = useAuth();
  const { isConnected, driveToken } = useGoogleDrive();

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  const handleConnectDrive = () => {
    if (!isAuthorizedDomain) {
      toast.error('Integração com Google Drive disponível apenas para usuários do domínio @mrladvogados.com.br');
      return;
    }

    // Por enquanto, mostrar uma mensagem informativa até a implementação completa do OAuth
    toast.info('Para conectar ao Google Drive, configure os tokens OAuth nas configurações avançadas do sistema.');
  };

  const handleDisconnectDrive = () => {
    toast.info('Para desconectar do Google Drive, remova os tokens OAuth das configurações avançadas.');
  };

  const openGoogleDriveHelp = () => {
    window.open('https://developers.google.com/drive/api/quickstart/nodejs', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Integração Google Drive
        </CardTitle>
        <CardDescription>
          Configure a integração com Google Drive para gerenciamento de documentos
        </CardDescription>
        {!isAuthorizedDomain && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              A integração Google Drive está disponível apenas para usuários do domínio @mrladvogados.com.br
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Drive Integration */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <HardDrive className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium">Google Drive API</h3>
              <p className="text-sm text-gray-500">
                Armazenamento e gestão de documentos jurídicos
              </p>
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
                  onClick={handleDisconnectDrive}
                  disabled={!isAuthorizedDomain}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Desconectar
                </Button>
              </>
            ) : (
              <Button
                onClick={handleConnectDrive}
                disabled={!isAuthorizedDomain}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <HardDrive className="h-4 w-4 mr-1" />
                Conectar
              </Button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HardDrive className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Como configurar o Google Drive</h4>
              <p className="text-sm text-blue-700 mb-3">
                Para utilizar a integração com Google Drive, você precisa configurar as credenciais OAuth do Google.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Acesse o Google Cloud Console</p>
                <p>• Configure as credenciais OAuth 2.0</p>
                <p>• Adicione os tokens nas configurações do sistema</p>
                <p>• Ative a Google Drive API</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openGoogleDriveHelp}
              className="text-blue-600 border-blue-200"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Guia
            </Button>
          </div>
        </div>

        {isAuthorizedDomain && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Status:</strong> {isConnected ? 
              'Google Drive conectado e pronto para uso. Você pode fazer upload e gerenciar documentos.' : 
              'Google Drive não conectado. Configure as credenciais OAuth para ativar a integração.'
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}

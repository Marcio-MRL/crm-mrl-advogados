
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, RefreshCw } from 'lucide-react';

interface GoogleDriveConnectionStatusProps {
  isConnected: boolean;
  onRefreshConnection: () => void;
}

export function GoogleDriveConnectionStatus({ 
  isConnected, 
  onRefreshConnection 
}: GoogleDriveConnectionStatusProps) {
  if (isConnected) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">Google Drive não conectado</p>
              <p className="text-sm text-orange-600">Vá para Configurações → Integrações para conectar sua conta do Google Drive.</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshConnection}
            className="text-orange-600 border-orange-200"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Verificar Conexão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

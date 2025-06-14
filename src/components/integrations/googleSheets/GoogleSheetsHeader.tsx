
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardDrive, CheckCircle, XCircle } from 'lucide-react';

interface GoogleSheetsHeaderProps {
  isConnected: boolean;
}

export function GoogleSheetsHeader({ isConnected }: GoogleSheetsHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="h-6 w-6 text-green-600" />
          <CardTitle>Outras Planilhas Google Sheets</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="outline">
              <XCircle className="h-3 w-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  );
}

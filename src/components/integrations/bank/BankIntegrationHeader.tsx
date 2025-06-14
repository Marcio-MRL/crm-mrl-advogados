
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, AlertCircle } from 'lucide-react';

interface BankIntegrationHeaderProps {
  isConnected: boolean;
}

export function BankIntegrationHeader({ isConnected }: BankIntegrationHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <CardTitle>Integração Bancária BTG</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="outline">
              <AlertCircle className="h-3 w-3 mr-1" />
              Desconectado
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  );
}

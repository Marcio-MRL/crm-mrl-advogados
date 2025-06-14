
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink } from 'lucide-react';

export function GoogleCloudConsoleGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 mb-2">Como configurar OAuth no Google Cloud Console</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <p>1. Acesse o Google Cloud Console</p>
            <p>2. Crie um novo projeto ou selecione um existente</p>
            <p>3. Vá para "APIs e Serviços" → "Credenciais"</p>
            <p>4. Clique em "Criar credenciais" → "ID do cliente OAuth 2.0"</p>
            <p>5. Configure o tipo de aplicativo como "Aplicativo da web"</p>
            <p>6. Adicione as URIs de redirecionamento conforme necessário</p>
            <p>7. Copie o Client ID e Client Secret para cada serviço</p>
            <p>8. Ative as APIs necessárias: Calendar API, Sheets API, Drive API</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            className="mt-3 text-blue-600 border-blue-200"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Abrir Google Cloud Console
          </Button>
        </div>
      </div>
    </div>
  );
}

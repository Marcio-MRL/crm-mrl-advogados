import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Mail, Settings, HardDrive } from 'lucide-react';
import { GoogleDriveIntegrationSection } from '@/components/integrations/GoogleDriveIntegrationSection';

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      {/* Google Drive Integration */}
      <GoogleDriveIntegrationSection />
      
      {/* Other Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Outras Integrações Disponíveis
          </CardTitle>
          <CardDescription>
            Configure integrações com serviços externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500">Sincronize eventos e compromissos</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium">Google Sheets</h4>
                  <p className="text-sm text-gray-500">Exporte dados para planilhas</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg opacity-50">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-yellow-600" />
                <div>
                  <h4 className="font-medium">WhatsApp Business</h4>
                  <p className="text-sm text-gray-500">Envio de notificações (Em breve)</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Em Desenvolvimento
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg opacity-50">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium">API Externa</h4>
                  <p className="text-sm text-gray-500">Integração personalizada (Em breve)</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Em Desenvolvimento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import { CompleteGoogleOAuthSection } from '@/components/integrations/CompleteGoogleOAuthSection';
import { GoogleOAuthConfigSection } from './GoogleOAuthConfigSection';

export function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      {/* Seção de configuração OAuth */}
      <GoogleOAuthConfigSection />
      
      {/* Seção completa de integrações Google OAuth */}
      <CompleteGoogleOAuthSection />
      
      {/* Outras integrações futuras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Outras Integrações Futuras
          </CardTitle>
          <CardDescription>
            Integrações com outros serviços serão adicionadas aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Novas integrações estarão disponíveis em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

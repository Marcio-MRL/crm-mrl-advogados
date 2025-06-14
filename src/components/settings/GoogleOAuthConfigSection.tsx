
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGoogleOAuthConfigs } from '@/hooks/useGoogleOAuthConfigs';
import { GoogleOAuthServiceCard } from './oauth/GoogleOAuthServiceCard';
import { GoogleCloudConsoleGuide } from './oauth/GoogleCloudConsoleGuide';

export function GoogleOAuthConfigSection() {
  const {
    configs,
    loading,
    saving,
    isAuthorizedDomain,
    saveConfig,
    deleteConfig,
    updateConfig,
    getServiceName
  } = useGoogleOAuthConfigs();

  if (!isAuthorizedDomain) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações OAuth Google
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              As configurações OAuth estão disponíveis apenas para usuários do domínio @mrladvogados.com.br
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações OAuth Google</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Carregando configurações...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações OAuth Google
        </CardTitle>
        <CardDescription>
          Configure as credenciais OAuth para cada serviço Google
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(configs).map(([serviceType, config]) => (
          <GoogleOAuthServiceCard
            key={serviceType}
            serviceType={serviceType}
            config={config}
            serviceName={getServiceName(serviceType)}
            saving={saving[serviceType] || false}
            onSave={() => saveConfig(serviceType)}
            onDelete={() => deleteConfig(serviceType)}
            onUpdate={(field, value) => updateConfig(serviceType, field, value)}
          />
        ))}

        <GoogleCloudConsoleGuide />
      </CardContent>
    </Card>
  );
}

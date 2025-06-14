
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, EyeOff, Save, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OAuthConfig {
  id?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  service_type: 'calendar' | 'sheets' | 'drive';
}

export function GoogleOAuthConfigSection() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<Record<string, OAuthConfig>>({
    calendar: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'calendar' },
    sheets: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'sheets' },
    drive: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'drive' }
  });
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({
    calendar: false,
    sheets: false,
    drive: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  useEffect(() => {
    if (user && isAuthorizedDomain) {
      loadConfigs();
    }
  }, [user, isAuthorizedDomain]);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('google_oauth_configs')
        .select('*')
        .eq('user_id', user?.id);

      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
        console.error('Error loading configs:', error);
        return;
      }

      if (data) {
        const configsMap: Record<string, OAuthConfig> = {
          calendar: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'calendar' },
          sheets: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'sheets' },
          drive: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'drive' }
        };

        data.forEach(config => {
          if (config.service_type && configsMap[config.service_type]) {
            configsMap[config.service_type] = {
              id: config.id,
              client_id: config.client_id || '',
              client_secret: config.client_secret || '',
              redirect_uri: config.redirect_uri || `${window.location.origin}/auth/google/callback`,
              service_type: config.service_type
            };
          }
        });

        setConfigs(configsMap);
      }
    } catch (error) {
      console.error('Error loading OAuth configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (serviceType: string) => {
    if (!user) return;

    setSaving(prev => ({ ...prev, [serviceType]: true }));
    
    try {
      const config = configs[serviceType];
      
      if (!config.client_id.trim()) {
        toast.error('Client ID é obrigatório');
        return;
      }

      const configData = {
        user_id: user.id,
        service_type: serviceType,
        client_id: config.client_id.trim(),
        client_secret: config.client_secret.trim(),
        redirect_uri: config.redirect_uri.trim() || `${window.location.origin}/auth/google/callback`,
        is_active: true
      };

      let result;
      if (config.id) {
        result = await supabase
          .from('google_oauth_configs')
          .update(configData)
          .eq('id', config.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('google_oauth_configs')
          .insert(configData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setConfigs(prev => ({
        ...prev,
        [serviceType]: { ...config, id: result.data.id }
      }));

      toast.success(`Configuração do ${getServiceName(serviceType)} salva com sucesso!`);
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setSaving(prev => ({ ...prev, [serviceType]: false }));
    }
  };

  const deleteConfig = async (serviceType: string) => {
    const config = configs[serviceType];
    if (!config.id) return;

    try {
      const { error } = await supabase
        .from('google_oauth_configs')
        .delete()
        .eq('id', config.id);

      if (error) throw error;

      setConfigs(prev => ({
        ...prev,
        [serviceType]: { 
          client_id: '', 
          client_secret: '', 
          redirect_uri: '', 
          service_type: serviceType as 'calendar' | 'sheets' | 'drive' 
        }
      }));

      toast.success(`Configuração do ${getServiceName(serviceType)} removida`);
    } catch (error) {
      console.error('Error deleting config:', error);
      toast.error('Erro ao remover configuração');
    }
  };

  const getServiceName = (serviceType: string) => {
    const names = {
      calendar: 'Google Calendar',
      sheets: 'Google Sheets',
      drive: 'Google Drive'
    };
    return names[serviceType as keyof typeof names] || serviceType;
  };

  const getServiceColor = (serviceType: string) => {
    const colors = {
      calendar: 'bg-blue-100 text-blue-800',
      sheets: 'bg-green-100 text-green-800',
      drive: 'bg-yellow-100 text-yellow-800'
    };
    return colors[serviceType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
          <div key={serviceType} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{getServiceName(serviceType)}</h3>
                <Badge className={getServiceColor(serviceType)}>
                  {config.id ? 'Configurado' : 'Não Configurado'}
                </Badge>
              </div>
              
              {config.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteConfig(serviceType)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`client_id_${serviceType}`}>Client ID</Label>
                <Input
                  id={`client_id_${serviceType}`}
                  value={config.client_id}
                  onChange={(e) => setConfigs(prev => ({
                    ...prev,
                    [serviceType]: { ...prev[serviceType], client_id: e.target.value }
                  }))}
                  placeholder="Seu Google Client ID"
                />
              </div>

              <div>
                <Label htmlFor={`client_secret_${serviceType}`}>Client Secret</Label>
                <div className="relative">
                  <Input
                    id={`client_secret_${serviceType}`}
                    type={showSecrets[serviceType] ? 'text' : 'password'}
                    value={config.client_secret}
                    onChange={(e) => setConfigs(prev => ({
                      ...prev,
                      [serviceType]: { ...prev[serviceType], client_secret: e.target.value }
                    }))}
                    placeholder="Seu Google Client Secret"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecrets(prev => ({ ...prev, [serviceType]: !prev[serviceType] }))}
                  >
                    {showSecrets[serviceType] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor={`redirect_uri_${serviceType}`}>Redirect URI</Label>
                <Input
                  id={`redirect_uri_${serviceType}`}
                  value={config.redirect_uri}
                  onChange={(e) => setConfigs(prev => ({
                    ...prev,
                    [serviceType]: { ...prev[serviceType], redirect_uri: e.target.value }
                  }))}
                  placeholder={`${window.location.origin}/auth/google/callback`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL para onde o Google redirecionará após a autenticação
                </p>
              </div>
            </div>

            <Button
              onClick={() => saveConfig(serviceType)}
              disabled={saving[serviceType] || !config.client_id.trim()}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving[serviceType] ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </div>
        ))}

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
      </CardContent>
    </Card>
  );
}

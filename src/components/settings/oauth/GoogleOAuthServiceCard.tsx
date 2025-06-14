
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Save, Trash2 } from 'lucide-react';

interface OAuthConfig {
  id?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  service_type: 'calendar' | 'sheets' | 'drive';
}

interface GoogleOAuthServiceCardProps {
  serviceType: string;
  config: OAuthConfig;
  serviceName: string;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
  onUpdate: (field: string, value: string) => void;
}

export function GoogleOAuthServiceCard({
  serviceType,
  config,
  serviceName,
  saving,
  onSave,
  onDelete,
  onUpdate
}: GoogleOAuthServiceCardProps) {
  const [showSecret, setShowSecret] = useState(false);

  const getServiceColor = (serviceType: string) => {
    const colors = {
      calendar: 'bg-blue-100 text-blue-800',
      sheets: 'bg-green-100 text-green-800',
      drive: 'bg-yellow-100 text-yellow-800'
    };
    return colors[serviceType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{serviceName}</h3>
          <Badge className={getServiceColor(serviceType)}>
            {config.id ? 'Configurado' : 'Não Configurado'}
          </Badge>
        </div>
        
        {config.id && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
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
            onChange={(e) => onUpdate('client_id', e.target.value)}
            placeholder="Seu Google Client ID"
          />
        </div>

        <div>
          <Label htmlFor={`client_secret_${serviceType}`}>Client Secret</Label>
          <div className="relative">
            <Input
              id={`client_secret_${serviceType}`}
              type={showSecret ? 'text' : 'password'}
              value={config.client_secret}
              onChange={(e) => onUpdate('client_secret', e.target.value)}
              placeholder="Seu Google Client Secret"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor={`redirect_uri_${serviceType}`}>Redirect URI</Label>
          <Input
            id={`redirect_uri_${serviceType}`}
            value={config.redirect_uri}
            onChange={(e) => onUpdate('redirect_uri', e.target.value)}
            placeholder={`${window.location.origin}/auth/google/callback`}
          />
          <p className="text-xs text-gray-500 mt-1">
            URL para onde o Google redirecionará após a autenticação
          </p>
        </div>
      </div>

      <Button
        onClick={onSave}
        disabled={saving || !config.client_id.trim()}
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Salvando...' : 'Salvar Configuração'}
      </Button>
    </div>
  );
}

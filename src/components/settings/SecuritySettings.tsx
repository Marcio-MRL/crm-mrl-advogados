
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Key, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserManagementSettings } from './UserManagementSettings';
import { GoogleIntegrationsSettings } from './GoogleIntegrationsSettings';

export function SecuritySettings() {
  const { userProfile } = useAuth();

  // Verificar se o usuário é master
  const isMaster = userProfile?.role === 'master';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className={`grid w-full ${isMaster ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sessões
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            2FA
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Google OAuth
          </TabsTrigger>
          {isMaster && (
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sessões de Segurança
              </CardTitle>
              <CardDescription>
                Gerencie suas sessões ativas e histórico de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade de gerenciamento de sessões em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Autenticação de Dois Fatores
              </CardTitle>
              <CardDescription>
                Configure autenticação adicional para maior segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidade de 2FA em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <GoogleIntegrationsSettings />
        </TabsContent>

        {isMaster && (
          <TabsContent value="users" className="space-y-6">
            <UserManagementSettings />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

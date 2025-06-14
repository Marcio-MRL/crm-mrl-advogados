
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { LGPDSettings } from '@/components/settings/LGPDSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { IntegrationsSettings } from '@/components/settings/IntegrationsSettings';
import { DataSettings } from '@/components/settings/DataSettings';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Settings,
  Scale
} from 'lucide-react';

export default function Configuracoes() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Configurações" subtitle="Gerencie suas preferências e configurações do sistema" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="lgpd" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              LGPD
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="lgpd" className="space-y-6">
            <LGPDSettings />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettings />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

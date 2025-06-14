
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Mail,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';

export default function Configuracoes() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leads: true,
    tasks: true,
    processes: false
  });

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: ''
  });

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleSaveNotifications = () => {
    toast.success("Configurações de notificação atualizadas!");
  };

  const handleSaveSecurity = () => {
    toast.success("Configurações de segurança atualizadas!");
  };

  const handleExportData = () => {
    toast.info("Exportação de dados iniciada. Você receberá um email quando estiver pronta.");
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Configurações" subtitle="Gerencie suas preferências e configurações do sistema" />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      placeholder="Seu sobrenome"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Cargo</Label>
                    <Select value={profile.position} onValueChange={(value) => setProfile({...profile, position: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="advogado">Advogado</SelectItem>
                        <SelectItem value="estagiario">Estagiário</SelectItem>
                        <SelectItem value="secretario">Secretário</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} className="bg-lawblue-500 hover:bg-lawblue-600">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Notificações por Email
                      </Label>
                      <p className="text-sm text-gray-500">Receba notificações importantes por email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-gray-500">Receba notificações push no navegador</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novos Leads</Label>
                      <p className="text-sm text-gray-500">Seja notificado quando novos leads chegarem</p>
                    </div>
                    <Switch
                      checked={notifications.leads}
                      onCheckedChange={(checked) => setNotifications({...notifications, leads: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tarefas Vencendo</Label>
                      <p className="text-sm text-gray-500">Lembrete de tarefas próximas do vencimento</p>
                    </div>
                    <Switch
                      checked={notifications.tasks}
                      onCheckedChange={(checked) => setNotifications({...notifications, tasks: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Atualizações de Processos</Label>
                      <p className="text-sm text-gray-500">Notificações sobre mudanças em processos</p>
                    </div>
                    <Switch
                      checked={notifications.processes}
                      onCheckedChange={(checked) => setNotifications({...notifications, processes: checked})}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveNotifications} className="bg-lawblue-500 hover:bg-lawblue-600">
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" placeholder="Digite sua senha atual" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" placeholder="Digite a nova senha" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirme a nova senha" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessões Ativas</Label>
                      <p className="text-sm text-gray-500">Gerencie dispositivos conectados</p>
                    </div>
                    <Button variant="outline">Ver Sessões</Button>
                  </div>
                </div>
                
                <Button onClick={handleSaveSecurity} className="bg-lawblue-500 hover:bg-lawblue-600">
                  Atualizar Senha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select defaultValue="pt-BR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fuso Horário</Label>
                    <Select defaultValue="America/Sao_Paulo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (UTC-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="bg-lawblue-500 hover:bg-lawblue-600">
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Dados</CardTitle>
                <CardDescription>
                  Exporte, importe ou limpe seus dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Exportar Dados
                      </Label>
                      <p className="text-sm text-gray-500">Baixe todos os seus dados em formato JSON</p>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Importar Dados</Label>
                      <p className="text-sm text-gray-500">Importe dados de outro sistema</p>
                    </div>
                    <Button variant="outline">
                      Importar
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                    <div className="space-y-0.5">
                      <Label className="text-red-600">Limpar Todos os Dados</Label>
                      <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
                    </div>
                    <Button variant="destructive">
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

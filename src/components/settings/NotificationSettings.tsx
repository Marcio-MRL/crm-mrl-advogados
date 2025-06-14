
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Bell, Mail } from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leads: true,
    tasks: true,
    processes: false
  });

  const handleSaveNotifications = () => {
    toast.success("Configurações de notificação atualizadas!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferências de Notificação
        </CardTitle>
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
  );
}

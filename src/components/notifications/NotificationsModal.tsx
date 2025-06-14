
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Calendar, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  timestamp: string;
  read: boolean;
  icon: any;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Nova tarefa vencendo',
      message: 'A tarefa "Revisar contrato XYZ" vence em 2 horas',
      type: 'urgent',
      timestamp: '10 min atrás',
      read: false,
      icon: AlertTriangle
    },
    {
      id: '2',
      title: 'Novo lead recebido',
      message: 'João Silva está interessado em consultoria jurídica',
      type: 'info',
      timestamp: '1 hora atrás',
      read: false,
      icon: Users
    },
    {
      id: '3',
      title: 'Reunião em 30 minutos',
      message: 'Reunião com cliente Maria Santos às 15:30',
      type: 'warning',
      timestamp: '2 horas atrás',
      read: true,
      icon: Calendar
    },
    {
      id: '4',
      title: 'Documento assinado',
      message: 'Contrato de prestação de serviços foi assinado',
      type: 'success',
      timestamp: '3 horas atrás',
      read: true,
      icon: CheckCircle
    },
    {
      id: '5',
      title: 'Processo atualizado',
      message: 'Novo andamento no processo 123456-78.2024',
      type: 'info',
      timestamp: '1 dia atrás',
      read: true,
      icon: FileText
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'Urgente';
      case 'warning':
        return 'Atenção';
      case 'success':
        return 'Sucesso';
      default:
        return 'Info';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm">
              Marcar todas como lidas
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'urgent' ? 'bg-red-100 text-red-600' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'success' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <notification.icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <Badge variant="outline" className={getTypeColor(notification.type)}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {notification.timestamp}
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
                
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4">
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
          <Button variant="outline" size="sm">
            Configurar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

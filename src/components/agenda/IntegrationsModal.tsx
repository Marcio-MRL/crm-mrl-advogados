
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AgendaIntegrationsSection } from './AgendaIntegrationsSection';
import { GoogleOAuthSection } from '@/components/integrations/GoogleOAuthSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export function IntegrationsModal({ isOpen, onClose, onSyncComplete }: IntegrationsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Integrações da Agenda</DialogTitle>
          <DialogDescription>
            Configure e gerencie suas integrações com serviços externos
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="google-calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google-calendar">Google Calendar</TabsTrigger>
            <TabsTrigger value="connection">Conexão Google</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google-calendar" className="space-y-4 mt-6">
            <AgendaIntegrationsSection onSyncComplete={onSyncComplete} />
          </TabsContent>
          
          <TabsContent value="connection" className="space-y-4 mt-6">
            <GoogleOAuthSection />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

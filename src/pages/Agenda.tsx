
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysView } from '@/components/calendar/CalendarDaysView';
import { CalendarEventList } from '@/components/calendar/CalendarEventList';
import { GoogleIntegrations } from '@/components/integrations/GoogleIntegrations';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Agenda() {
  const handleNovoEvento = () => {
    toast.info("Funcionalidade para adicionar novo evento será implementada em breve.");
  };

  return (
    <div className="w-full space-y-6">
      <Header 
        title="Agenda" 
        subtitle="Gerencie seus compromissos e integre com Google Calendar" 
      />
      
      <div className="flex justify-end mb-4">
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={handleNovoEvento}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>
      
      <div className="glass-card rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Integrações Google</h2>
        <GoogleIntegrations hideGoogleSheets={true} />
      </div>

      <Tabs defaultValue="calendar">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="bg-white/70 p-4 rounded-lg shadow-sm">
          <CalendarDaysView view="week" />
        </TabsContent>
        
        <TabsContent value="list">
          <CalendarEventList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

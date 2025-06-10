
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { AgendaTabs } from '@/components/agenda/AgendaTabs';
import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaIntegrationsSection } from '@/components/agenda/AgendaIntegrationsSection';
import { GoogleOAuthSection } from '@/components/integrations/GoogleOAuthSection';

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  const [events] = useState([]); // Por enquanto vazio, será implementado posteriormente

  const handleNovoEvento = () => {
    console.log('Criar novo evento');
  };

  const handleEventClick = (event: any) => {
    console.log('Evento clicado:', event);
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Excluir evento:', eventId);
  };

  const handleSyncComplete = () => {
    console.log('Sincronização concluída');
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Agenda" subtitle="Gerencie seus compromissos e eventos" />
        
        <AgendaHeader 
          currentView={currentView}
          onNovoEvento={handleNovoEvento}
          onViewChange={setCurrentView}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AgendaTabs 
              currentView={currentView}
              events={events}
              onEventClick={handleEventClick}
              onEventDelete={handleEventDelete}
            />
          </div>
          
          <div className="space-y-6">
            <AgendaIntegrationsSection onSyncComplete={handleSyncComplete} />
            <GoogleOAuthSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

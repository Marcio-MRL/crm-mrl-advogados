
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { AgendaTabs } from '@/components/agenda/AgendaTabs';
import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaIntegrationsSection } from '@/components/agenda/AgendaIntegrationsSection';
import { GoogleOAuthSection } from '@/components/integrations/GoogleOAuthSection';
import { useAgendaEvents } from '@/hooks/useAgendaEvents';
import { EventModal } from '@/components/calendar/EventModal';
import { Event } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';

export default function Agenda() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('month');
  
  const { events, loading, handleSaveEvent, handleDeleteEvent } = useAgendaEvents();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleNovoEvento = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSyncComplete = () => {
    console.log('Sincronização concluída');
  };
  
  const handleSave = async (eventData: Omit<Event, 'id'> & { id?: string }) => {
    await handleSaveEvent(eventData);
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <Header title="Agenda" subtitle="Gerencie seus compromissos e eventos" />
        
        <AgendaHeader 
          currentView={currentView}
          onNovoEvento={handleNovoEvento}
          onViewChange={setCurrentView}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Área principal do calendário - ocupa mais espaço */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className="bg-white/70 p-6 rounded-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-1/4" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <AgendaTabs 
                currentView={currentView}
                events={events}
                onEventClick={handleEventClick}
                onEventDelete={handleDeleteEvent}
              />
            )}
          </div>
          
          {/* Sidebar das integrações - menor e mais organizada */}
          <div className="xl:col-span-1 space-y-4">
            <AgendaIntegrationsSection onSyncComplete={handleSyncComplete} />
            <GoogleOAuthSection />
          </div>
        </div>
      </div>
      
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSave={handleSave}
      />
    </MainLayout>
  );
}

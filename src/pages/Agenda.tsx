
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { EventModal } from '@/components/calendar/EventModal';
import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaIntegrationsSection } from '@/components/agenda/AgendaIntegrationsSection';
import { AgendaTabs } from '@/components/agenda/AgendaTabs';
import { useAgendaEvents } from '@/hooks/useAgendaEvents';
import { Event } from '@/types/event';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Agenda() {
  const { user } = useAuth();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(false);

  const { events, handleSaveEvent, handleDeleteEvent } = useAgendaEvents();

  const handleNovoEvento = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEventWrapper = async (event: Event) => {
    await handleSaveEvent(event, selectedEvent);
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSyncComplete = () => {
    toast.success("Sincronização concluída!");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full space-y-6">
          <Header title="Agenda" subtitle="Carregando..." />
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lawblue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Agenda" 
          subtitle="Gerencie seus compromissos e integre com Google Calendar" 
        />
        
        <AgendaHeader
          currentView={currentView}
          onNovoEvento={handleNovoEvento}
          onViewChange={setCurrentView}
        />

        <AgendaIntegrationsSection onSyncComplete={handleSyncComplete} />

        <AgendaTabs
          currentView={currentView}
          events={events}
          onEventClick={handleEditEvent}
          onEventDelete={handleDeleteEvent}
        />

        <EventModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEventWrapper}
        />
      </div>
    </MainLayout>
  );
}

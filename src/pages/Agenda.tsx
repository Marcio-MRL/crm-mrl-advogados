
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysView } from '@/components/calendar/CalendarDaysView';
import { CalendarEventList } from '@/components/calendar/CalendarEventList';
import { GoogleIntegrations } from '@/components/integrations/GoogleIntegrations';
import { EventModal } from '@/components/calendar/EventModal';
import { GoogleCalendarSync } from '@/components/calendar/GoogleCalendarSync';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  client?: string;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'outro';
  participants: string[];
  syncWithGoogle: boolean;
}

export default function Agenda() {
  const { user } = useAuth();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error loading events:', error);
        toast.error('Erro ao carregar eventos');
        return;
      }

      const formattedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: new Date(event.event_date),
        startTime: event.start_time,
        endTime: event.end_time,
        location: event.location || '',
        client: event.client_name,
        type: event.event_type as 'audiencia' | 'reuniao' | 'prazo' | 'outro',
        participants: event.participants || [],
        syncWithGoogle: event.sync_with_google
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleNovoEvento = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (event: Event) => {
    try {
      const eventData = {
        user_id: user?.id,
        title: event.title,
        description: event.description,
        event_date: event.date.toISOString().split('T')[0],
        start_time: event.startTime,
        end_time: event.endTime,
        location: event.location,
        client_name: event.client,
        event_type: event.type,
        participants: event.participants,
        sync_with_google: event.syncWithGoogle
      };

      if (selectedEvent) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', event.id)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error updating event:', error);
          toast.error('Erro ao atualizar evento');
          return;
        }

        toast.success("Evento atualizado com sucesso!");
      } else {
        // Criar novo evento
        const { error } = await supabase
          .from('calendar_events')
          .insert([eventData]);

        if (error) {
          console.error('Error creating event:', error);
          toast.error('Erro ao criar evento');
          return;
        }

        toast.success("Evento criado com sucesso!");
      }

      await loadEvents();
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erro ao salvar evento');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        const { error } = await supabase
          .from('calendar_events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error deleting event:', error);
          toast.error('Erro ao excluir evento');
          return;
        }

        toast.success("Evento excluído com sucesso!");
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Erro ao excluir evento');
      }
    }
  };

  const handleSyncComplete = () => {
    toast.success("Sincronização concluída!");
    loadEvents();
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
        
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button 
              className="bg-lawblue-500 hover:bg-lawblue-600"
              onClick={handleNovoEvento}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Evento
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visualização: {currentView === 'day' ? 'Dia' : currentView === 'week' ? 'Semana' : 'Mês'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={currentView === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('day')}
            >
              Dia
            </Button>
            <Button
              variant={currentView === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('week')}
            >
              Semana
            </Button>
            <Button
              variant={currentView === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentView('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2">
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Integrações Google
              </h2>
              <GoogleIntegrations hideGoogleSheets={true} />
            </div>
          </div>
          
          <div>
            <GoogleCalendarSync onSyncComplete={handleSyncComplete} />
          </div>
        </div>

        <Tabs defaultValue="calendar">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="list">Lista de Eventos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="bg-white/70 p-6 rounded-lg shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {currentView === 'day' && 'Visualização Diária'}
                {currentView === 'week' && 'Visualização Semanal'}
                {currentView === 'month' && 'Visualização Mensal'}
              </h3>
              <div className="text-sm text-gray-500">
                {events.length} evento(s) encontrado(s)
              </div>
            </div>
            <CalendarDaysView 
              view={currentView} 
              events={events}
              onEventClick={handleEditEvent}
              onEventDelete={handleDeleteEvent}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <CalendarEventList 
              events={events}
              onEventClick={handleEditEvent}
              onEventDelete={handleDeleteEvent}
            />
          </TabsContent>
        </Tabs>

        <EventModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
        />
      </div>
    </MainLayout>
  );
}

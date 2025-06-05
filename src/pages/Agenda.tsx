
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

// Mock data temporário até que os tipos do Supabase sejam atualizados
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Audiência Inicial',
    description: 'Audiência de conciliação processo 123456',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: 'Fórum Central',
    client: 'João Silva',
    type: 'audiencia',
    participants: ['joao@email.com'],
    syncWithGoogle: true
  },
  {
    id: '2',
    title: 'Reunião com Cliente',
    description: 'Discussão sobre contrato',
    date: new Date(Date.now() + 86400000), // Amanhã
    startTime: '14:00',
    endTime: '15:30',
    location: 'Escritório',
    client: 'Maria Santos',
    type: 'reuniao',
    participants: ['maria@email.com'],
    syncWithGoogle: true
  }
];

export default function Agenda() {
  const { user } = useAuth();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(false);

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
      if (selectedEvent) {
        // Atualizar evento existente
        setEvents(prevEvents => 
          prevEvents.map(e => e.id === event.id ? event : e)
        );
        toast.success("Evento atualizado com sucesso!");
      } else {
        // Criar novo evento
        const newEvent = {
          ...event,
          id: Date.now().toString(),
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
        toast.success("Evento criado com sucesso!");
      }

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
        setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
        toast.success("Evento excluído com sucesso!");
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Erro ao excluir evento');
      }
    }
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


import { useState } from 'react';
import { Event } from '@/types/event';
import { mockEvents } from '@/data/mockEvents';
import { toast } from 'sonner';

export function useAgendaEvents() {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const handleSaveEvent = async (event: Event, selectedEvent: Event | null) => {
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

  return {
    events,
    handleSaveEvent,
    handleDeleteEvent
  };
}

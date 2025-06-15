
import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/event';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { createGoogleEvent, updateGoogleEvent, deleteGoogleEvent } from '@/services/googleCalendarApi';

export function useAgendaEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedEvents: Event[] = data.map(event => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);
        return {
          id: event.id,
          googleEventId: event.google_event_id,
          title: event.title,
          description: event.description,
          date: startDate,
          startTime: format(startDate, 'HH:mm'),
          endTime: format(endDate, 'HH:mm'),
          location: event.location,
          client: event.client,
          type: event.type,
          participants: event.participants,
          syncWithGoogle: event.sync_with_google,
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erro ao buscar eventos da agenda.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const syncEventWithGoogle = async (eventData: any, isUpdate: boolean = false) => {
    if (!eventData.sync_with_google) return null;

    try {
      const googleEvent = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.start_time,
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: eventData.end_time,
          timeZone: 'America/Sao_Paulo'
        },
        location: eventData.location || '',
        attendees: eventData.participants?.map((email: string) => ({ email })) || []
      };

      if (isUpdate && eventData.google_event_id) {
        await updateGoogleEvent(eventData.google_event_id, googleEvent);
        return eventData.google_event_id;
      } else {
        const createdEvent = await createGoogleEvent(googleEvent);
        return createdEvent.id;
      }
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      toast.error('Evento salvo localmente, mas erro ao sincronizar com Google Calendar');
      return null;
    }
  };

  const handleSaveEvent = async (eventData: Omit<Event, 'id'> & { id?: string }) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar um evento.');
      return;
    }

    try {
      const baseDate = new Date(eventData.date);
      const [startHour, startMinute] = eventData.startTime.split(':');
      const startTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), Number(startHour), Number(startMinute));

      const [endHour, endMinute] = eventData.endTime.split(':');
      const endTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), Number(endHour), Number(endMinute));
      
      const dataToUpsert = {
        title: eventData.title,
        description: eventData.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location: eventData.location,
        client: eventData.client,
        type: eventData.type,
        participants: eventData.participants,
        sync_with_google: eventData.syncWithGoogle,
        user_id: user.id,
        id: eventData.id,
        google_event_id: eventData.googleEventId,
      };

      // Salvar evento local primeiro
      const { data: savedEvent, error } = await supabase
        .from('calendar_events')
        .upsert(dataToUpsert)
        .select()
        .single();
      
      if (error) throw error;

      // Sincronizar com Google Calendar se necessário
      if (eventData.syncWithGoogle) {
        const googleEventId = await syncEventWithGoogle(savedEvent, !!eventData.id);
        
        if (googleEventId && googleEventId !== savedEvent.google_event_id) {
          // Atualizar com o ID do Google se necessário
          await supabase
            .from('calendar_events')
            .update({ google_event_id: googleEventId })
            .eq('id', savedEvent.id);
        }
      }

      toast.success(eventData.id ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!");
      await fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erro ao salvar evento.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      if (!user) {
        toast.error('Você precisa estar logado para excluir um evento.');
        return;
      }
      try {
        // Buscar o evento para verificar se tem google_event_id
        const { data: eventToDelete, error: fetchError } = await supabase
          .from('calendar_events')
          .select('google_event_id, sync_with_google')
          .eq('id', eventId)
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;

        // Deletar do Google Calendar se sincronizado
        if (eventToDelete.sync_with_google && eventToDelete.google_event_id) {
          try {
            await deleteGoogleEvent(eventToDelete.google_event_id);
          } catch (googleError) {
            console.error('Error deleting from Google Calendar:', googleError);
            toast.error('Evento deletado localmente, mas erro ao remover do Google Calendar');
          }
        }

        // Deletar do banco local
        const { error } = await supabase
          .from('calendar_events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        toast.success("Evento excluído com sucesso!");
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Erro ao excluir evento.');
      }
    }
  };

  return {
    events,
    loading,
    handleSaveEvent,
    handleDeleteEvent,
  };
}

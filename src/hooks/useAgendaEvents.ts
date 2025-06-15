
import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/event';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

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
        id: eventData.id, // for upsert
        google_event_id: eventData.googleEventId,
      };

      const { error } = await supabase.from('calendar_events').upsert(dataToUpsert).select();
      
      if (error) throw error;

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

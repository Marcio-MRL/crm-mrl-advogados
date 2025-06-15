
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Event } from '@/types/event';
import { EventFormFields } from './fields/EventFormFields';
import { TimeFields } from './fields/TimeFields';
import { ParticipantsField } from './fields/ParticipantsField';

interface EventFormProps {
  event?: Event | null;
  onSave: (event: Omit<Event, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

type EventFormData = Omit<Event, 'id' | 'date' | 'description' | 'location' | 'client' | 'participants'> & { 
  id?: string; 
  date: Date;
  description: string;
  location: string;
  client: string;
  participants: string[];
};

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const getInitialFormData = (): EventFormData => ({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    client: '',
    type: 'reuniao',
    participants: [],
    syncWithGoogle: true
  });

  const [formData, setFormData] = useState<EventFormData>(getInitialFormData());
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: new Date(event.date),
        description: event.description || '',
        location: event.location || '',
        client: event.client || '',
        participants: event.participants || [],
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [event]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("Horário de início deve ser anterior ao horário de fim");
      return;
    }

    const eventToSave = {
      ...formData,
      id: event?.id,
    };

    onSave(eventToSave);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <EventFormFields
          title={formData.title}
          description={formData.description}
          date={formData.date}
          location={formData.location}
          client={formData.client}
          type={formData.type}
          syncWithGoogle={formData.syncWithGoogle}
          isDatePickerOpen={isDatePickerOpen}
          onTitleChange={(title) => setFormData({ ...formData, title })}
          onDescriptionChange={(description) => setFormData({ ...formData, description })}
          onDateChange={(date) => date && setFormData({ ...formData, date })}
          onLocationChange={(location) => setFormData({ ...formData, location })}
          onClientChange={(client) => setFormData({ ...formData, client })}
          onTypeChange={(type) => setFormData({ ...formData, type })}
          onSyncWithGoogleChange={(syncWithGoogle) => setFormData({ ...formData, syncWithGoogle })}
          onDatePickerOpenChange={setIsDatePickerOpen}
        />

        <TimeFields
          startTime={formData.startTime}
          endTime={formData.endTime}
          onStartTimeChange={(startTime) => setFormData({ ...formData, startTime })}
          onEndTimeChange={(endTime) => setFormData({ ...formData, endTime })}
        />

        <ParticipantsField
          participants={formData.participants}
          onParticipantsChange={(participants) => setFormData({ ...formData, participants })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {event ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { FormModal } from '@/components/common/FormModal';
import { EventForm } from './form/EventForm';
import { Event } from '@/types/event';

interface EventModalProps {
  event?: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'> & { id?: string }) => void;
}

export function EventModal({ event, isOpen, onClose, onSave }: EventModalProps) {
  const handleSave = (eventData: Omit<Event, 'id'> & { id?: string }) => {
    onSave(eventData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Editar Evento' : 'Novo Evento'}
    >
      <EventForm
        event={event}
        onSave={handleSave}
        onCancel={onClose}
      />
    </FormModal>
  );
}

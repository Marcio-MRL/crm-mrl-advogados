
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Clock, User } from 'lucide-react';

interface CalendarEventListProps {
  date?: Date;
}

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  client?: string;
  location?: string;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'outro';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Audiência - Processo 123456',
    start: '2025-05-06T09:30:00',
    end: '2025-05-06T10:30:00',
    client: 'Empresa ABC Ltda.',
    location: 'Fórum Central',
    type: 'audiencia'
  },
  {
    id: '2',
    title: 'Reunião com cliente',
    start: '2025-05-06T11:00:00',
    end: '2025-05-06T12:00:00',
    client: 'João da Silva',
    location: 'Escritório',
    type: 'reuniao'
  },
  {
    id: '3',
    title: 'Prazo processual - Contestação',
    start: '2025-05-06T14:00:00',
    end: '2025-05-06T15:00:00',
    client: 'Construtora XYZ',
    type: 'prazo'
  },
  {
    id: '4',
    title: 'Call com parceiros',
    start: '2025-05-06T16:00:00',
    end: '2025-05-06T17:00:00',
    location: 'Online - Zoom',
    type: 'outro'
  }
];

const getEventClass = (type: string) => {
  switch(type) {
    case 'audiencia':
      return 'border-l-4 border-red-500';
    case 'reuniao':
      return 'border-l-4 border-blue-500';
    case 'prazo':
      return 'border-l-4 border-yellow-500';
    case 'outro':
    default:
      return 'border-l-4 border-purple-500';
  }
};

const getTypeLabel = (type: string) => {
  switch(type) {
    case 'audiencia':
      return 'Audiência';
    case 'reuniao':
      return 'Reunião';
    case 'prazo':
      return 'Prazo';
    case 'outro':
    default:
      return 'Outro';
  }
};

export function CalendarEventList({ date }: CalendarEventListProps) {
  const today = date || new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  
  // Filter events for the current day
  const todayEvents = mockEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getDate() === day && 
           eventDate.getMonth() === month && 
           eventDate.getFullYear() === year;
  });
  
  // Sort by start time
  todayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  if (todayEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Clock className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium">Nenhum evento para hoje</h3>
        <p className="text-gray-500 mt-2">
          Não há eventos agendados para o dia selecionado.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {todayEvents.map(event => {
        const startTime = new Date(event.start);
        const endTime = new Date(event.end);
        
        return (
          <div 
            key={event.id} 
            className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${getEventClass(event.type)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {getTypeLabel(event.type)}
                </div>
                <h3 className="font-medium text-lg">{event.title}</h3>
              </div>
              <Button variant="ghost" size="sm">Detalhes</Button>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                {endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {event.client && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {event.client}
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {event.location}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

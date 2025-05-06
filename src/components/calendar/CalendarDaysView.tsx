
import React from 'react';
import { useMediaQuery } from '@/hooks/use-mobile';

interface CalendarDaysViewProps {
  date?: Date;
  view: string;
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

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  return `${hour}:00`;
});

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
      return 'bg-red-100 border-red-300 text-red-800';
    case 'reuniao':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'prazo':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'outro':
    default:
      return 'bg-purple-100 border-purple-300 text-purple-800';
  }
};

const getFormattedTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export function CalendarDaysView({ date, view }: CalendarDaysViewProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
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

  if (view === 'day') {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map((timeSlot) => {
            const [hour] = timeSlot.split(':');
            const hourNumber = parseInt(hour, 10);
            
            const eventsInSlot = todayEvents.filter(event => {
              const eventStartHour = new Date(event.start).getHours();
              return eventStartHour === hourNumber;
            });
            
            return (
              <div key={timeSlot} className="flex py-2 border-t group hover:bg-gray-50">
                <div className="w-16 flex-shrink-0 text-gray-500 text-sm">
                  {timeSlot}
                </div>
                <div className="flex-grow">
                  {eventsInSlot.length > 0 ? (
                    eventsInSlot.map(event => (
                      <div 
                        key={event.id}
                        className={`p-2 rounded-md border mb-1 ${getEventClass(event.type)}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs flex justify-between mt-1">
                          <span>{getFormattedTime(event.start)} - {getFormattedTime(event.end)}</span>
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-10 rounded-md border border-dashed border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Placeholder for week view
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
      <h3 className="text-lg font-medium">Visualização {view === 'week' ? 'semanal' : 'mensal'}</h3>
      <p className="text-gray-500 mt-2">
        Este recurso será implementado em breve. Por favor, use a visualização diária ou de lista por enquanto.
      </p>
    </div>
  );
}

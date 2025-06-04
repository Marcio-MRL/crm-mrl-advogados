
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Edit, Trash2, Users } from 'lucide-react';

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

interface CalendarEventListProps {
  date?: Date;
  events?: Event[];
  onEventClick?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

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

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'audiencia': return '🏛️';
    case 'reuniao': return '👥';
    case 'prazo': return '⏰';
    case 'outro':
    default: return '📝';
  }
};

export function CalendarEventList({ date, events = [], onEventClick, onEventDelete }: CalendarEventListProps) {
  const today = date || new Date();
  
  // Se uma data específica foi passada, filtrar eventos para essa data
  // Caso contrário, mostrar todos os eventos futuros
  let filteredEvents = events;
  
  if (date) {
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  } else {
    // Mostrar eventos futuros (próximos 30 dias)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= thirtyDaysFromNow;
    });
  }
  
  // Sort by date and time
  filteredEvents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    return a.startTime.localeCompare(b.startTime);
  });
  
  if (filteredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg">
        <div className="text-gray-400 mb-4">
          <Clock className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
        <p className="text-gray-500 max-w-md">
          {date 
            ? "Não há eventos agendados para o dia selecionado."
            : "Não há eventos agendados para os próximos 30 dias."
          }
        </p>
        <Button 
          className="mt-4" 
          onClick={() => {/* Função para abrir modal seria chamada aqui */}}
        >
          Criar Primeiro Evento
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">
          {date ? `Eventos para ${today.toLocaleDateString('pt-BR')}` : 'Próximos Eventos'}
        </h3>
        <p className="text-sm text-gray-500">
          {filteredEvents.length} evento(s) encontrado(s)
        </p>
      </div>

      {filteredEvents.map(event => {
        const eventDate = new Date(event.date);
        
        return (
          <div 
            key={event.id} 
            className={`p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${getEventClass(event.type)} group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{getTypeIcon(event.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {getTypeLabel(event.type)}
                      </span>
                      {event.syncWithGoogle && (
                        <Badge variant="secondary" className="text-xs">
                          📅 Google Calendar
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mt-1">{event.title}</h3>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEventClick?.(event)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onEventDelete?.(event.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <div>{eventDate.toLocaleDateString('pt-BR')}</div>
                  <div className="text-xs">{event.startTime} - {event.endTime}</div>
                </div>
              </div>
              
              {event.client && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.client}</span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.participants.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{event.participants.length} participante(s)</span>
                </div>
              )}
            </div>
            
            {event.participants.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-sm text-gray-500 mb-2">Participantes:</div>
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

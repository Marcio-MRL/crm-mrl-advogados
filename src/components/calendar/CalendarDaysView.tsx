
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarMonthView } from './CalendarMonthView';

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

interface CalendarDaysViewProps {
  date?: Date;
  view: 'day' | 'week' | 'month';
  events?: Event[];
  onEventClick?: (event: Event) => void;
  onEventDelete?: (eventId: string) => void;
}

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  return `${hour}:00`;
});

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

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'audiencia': return '🏛️';
    case 'reuniao': return '👥';
    case 'prazo': return '⏰';
    case 'outro':
    default: return '📝';
  }
};

export function CalendarDaysView({ date, view, events = [], onEventClick, onEventDelete }: CalendarDaysViewProps) {
  const [currentDate, setCurrentDate] = useState(date || new Date());

  // Day view implementation (existing code)
  if (view === 'day') {
    const today = currentDate;
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });

    const handlePrevDay = () => {
      setCurrentDate(subDays(currentDate, 1));
    };

    const handleNextDay = () => {
      setCurrentDate(addDays(currentDate, 1));
    };

    return (
      <div className="w-full">
        <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h4 className="font-medium text-gray-700">
              {today.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {todayEvents.length} evento(s) agendado(s)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-1">
          {timeSlots.map((timeSlot) => {
            const [hour] = timeSlot.split(':');
            const hourNumber = parseInt(hour, 10);
            
            const eventsInSlot = todayEvents.filter(event => {
              const eventStartHour = parseInt(event.startTime.split(':')[0], 10);
              return eventStartHour === hourNumber;
            });
            
            return (
              <div key={timeSlot} className="flex py-3 border-t group hover:bg-gray-50">
                <div className="w-20 flex-shrink-0 text-gray-500 text-sm font-medium">
                  {timeSlot}
                </div>
                <div className="flex-grow">
                  {eventsInSlot.length > 0 ? (
                    eventsInSlot.map(event => (
                      <div 
                        key={event.id}
                        className={`p-3 rounded-md border mb-2 ${getEventClass(event.type)} relative group/event`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{getTypeIcon(event.type)}</span>
                              <div className="font-medium">{event.title}</div>
                              {event.syncWithGoogle && (
                                <Badge variant="secondary" className="text-xs">Google</Badge>
                              )}
                            </div>
                            
                            <div className="text-sm space-y-1">
                              <div>{event.startTime} - {event.endTime}</div>
                              {event.client && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event.client}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                              {event.description && (
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => onEventClick?.(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-600"
                              onClick={() => onEventDelete?.(event.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-12 rounded-md border border-dashed border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-gray-400">Horário disponível</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week view
  if (view === 'week') {
    return (
      <CalendarWeekView
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onEventDelete={onEventDelete}
        onDateChange={setCurrentDate}
      />
    );
  }

  // Month view
  if (view === 'month') {
    return (
      <CalendarMonthView
        currentDate={currentDate}
        events={events}
        onEventClick={onEventClick}
        onEventDelete={onEventDelete}
        onDateChange={setCurrentDate}
      />
    );
  }

  return null;
}

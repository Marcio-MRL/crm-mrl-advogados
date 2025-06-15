
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface CalendarWeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  onDateChange: (date: Date) => void;
}

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  return `${hour}:00`;
});

const getEventClass = (type: string) => {
  switch(type) {
    case 'audiencia': return 'bg-red-100 border-red-300 text-red-800';
    case 'reuniao': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'prazo': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'outro':
    default: return 'bg-purple-100 border-purple-300 text-purple-800';
  }
};

export function CalendarWeekView({ currentDate, events, onEventClick, onEventDelete, onDateChange }: CalendarWeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const getEventsForTimeSlot = (day: Date, timeSlot: string) => {
    const dayEvents = getEventsForDay(day);
    const [hour] = timeSlot.split(':');
    const hourNumber = parseInt(hour, 10);
    
    return dayEvents.filter(event => {
      const eventStartHour = parseInt(event.startTime.split(':')[0], 10);
      return eventStartHour === hourNumber;
    });
  };

  const handlePrevWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  return (
    <div className="w-full">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={handlePrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(weekStart, 'd MMM', { locale: ptBR })} - {format(weekEnd, 'd MMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2"></div> {/* Empty cell for time column */}
            {daysInWeek.map(day => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 text-center text-sm font-medium ${
                    isToday ? 'text-blue-600 bg-blue-50 rounded' : 'text-gray-600'
                  }`}
                >
                  <div>{format(day, 'EEE', { locale: ptBR })}</div>
                  <div className={`text-lg ${isToday ? 'font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots and events */}
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 gap-1 border-t">
              <div className="p-2 text-sm text-gray-500 font-medium text-right">
                {timeSlot}
              </div>
              {daysInWeek.map(day => {
                const eventsInSlot = getEventsForTimeSlot(day, timeSlot);
                return (
                  <div key={`${day.toISOString()}-${timeSlot}`} className="min-h-[60px] p-1">
                    {eventsInSlot.map(event => (
                      <div
                        key={event.id}
                        className={`p-2 rounded border text-xs cursor-pointer group mb-1 ${getEventClass(event.type)}`}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs">{event.startTime} - {event.endTime}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventDelete(event.id);
                            }}
                          >
                            <Trash2 className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDaysView } from '@/components/calendar/CalendarDaysView';
import { CalendarEventList } from '@/components/calendar/CalendarEventList';

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

interface AgendaTabsProps {
  currentView: 'day' | 'week' | 'month';
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
}

export function AgendaTabs({ currentView, events, onEventClick, onEventDelete }: AgendaTabsProps) {
  return (
    <Tabs defaultValue="calendar">
      <TabsList className="mb-4">
        <TabsTrigger value="calendar">Calendário</TabsTrigger>
        <TabsTrigger value="list">Lista de Eventos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar" className="bg-white/70 p-6 rounded-lg shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {currentView === 'day' && 'Visualização Diária'}
            {currentView === 'week' && 'Visualização Semanal'}
            {currentView === 'month' && 'Visualização Mensal'}
          </h3>
          <div className="text-sm text-gray-500">
            {events.length} evento(s) encontrado(s)
          </div>
        </div>
        <CalendarDaysView 
          view={currentView} 
          events={events}
          onEventClick={onEventClick}
          onEventDelete={onEventDelete}
        />
      </TabsContent>
      
      <TabsContent value="list">
        <CalendarEventList 
          events={events}
          onEventClick={onEventClick}
          onEventDelete={onEventDelete}
        />
      </TabsContent>
    </Tabs>
  );
}

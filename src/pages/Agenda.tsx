
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysView } from '@/components/calendar/CalendarDaysView';
import { CalendarEventList } from '@/components/calendar/CalendarEventList';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon, Users, Grid, List } from 'lucide-react';

export default function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<string>("day");
  
  return (
    <div className="w-full space-y-6">
      <Header title="Agenda" subtitle="Gerenciamento de eventos e compromissos" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue={view} 
            onValueChange={(value) => setView(value)}
            className="glass-card"
          >
            <TabsList>
              <TabsTrigger value="day">Dia</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="list">Lista</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Compartilhar
          </Button>
          <Button className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600">
            <Plus className="h-4 w-4" /> Novo Evento
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border w-full"
              />
              
              <div>
                <p className="text-sm font-medium mb-2">Integrações:</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Google Calendar</span>
                  <span className="text-xs text-gray-500">(mraposo@mrladvogados.com.br)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {date?.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const prevDay = new Date(date!);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setDate(prevDay);
                  }}>
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const nextDay = new Date(date!);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setDate(nextDay);
                  }}>
                    Próximo
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
                    Hoje
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'list' ? (
                <CalendarEventList date={date} />
              ) : (
                <CalendarDaysView date={date} view={view} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

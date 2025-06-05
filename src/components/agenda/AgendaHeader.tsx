
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';

interface AgendaHeaderProps {
  currentView: 'day' | 'week' | 'month';
  onNovoEvento: () => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export function AgendaHeader({ currentView, onNovoEvento, onViewChange }: AgendaHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
      <div className="flex gap-2">
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={onNovoEvento}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Visualização: {currentView === 'day' ? 'Dia' : currentView === 'week' ? 'Semana' : 'Mês'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={currentView === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('day')}
        >
          Dia
        </Button>
        <Button
          variant={currentView === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('week')}
        >
          Semana
        </Button>
        <Button
          variant={currentView === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewChange('month')}
        >
          Mês
        </Button>
      </div>
    </div>
  );
}

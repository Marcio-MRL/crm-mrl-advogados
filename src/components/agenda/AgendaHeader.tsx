
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AgendaHeaderProps {
  currentView: 'day' | 'week' | 'month';
  onNovoEvento: () => void;
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onOpenIntegrations: () => void;
}

export function AgendaHeader({ 
  currentView, 
  onNovoEvento, 
  onViewChange,
  onOpenIntegrations 
}: AgendaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">
          Visualização: {currentView === 'day' ? 'Dia' : currentView === 'week' ? 'Semana' : 'Mês'}
        </Badge>
        
        <div className="flex gap-1">
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
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenIntegrations}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Integrações
        </Button>
        
        <Button 
          onClick={onNovoEvento}
          className="flex items-center gap-2"
          size="sm"
        >
          <CalendarPlus className="h-4 w-4" />
          Novo Evento
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { Lead } from '@/types/lead';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, ArrowRight } from 'lucide-react';
import { useLeadActions } from './LeadActions';

interface KanbanCardProps {
  lead: Lead;
  onStageChange: (leadId: string, newStage: Lead['stage']) => void;
}

export function KanbanCard({ lead, onStageChange }: KanbanCardProps) {
  const { handleLeadAction } = useLeadActions();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
  };

  const getNextStage = (): Lead['stage'] | null => {
    const stages: Lead['stage'][] = ['new', 'qualified', 'meeting', 'proposal', 'hired'];
    const currentIndex = stages.indexOf(lead.stage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };

  const nextStage = getNextStage();

  return (
    <Card 
      className="cursor-move hover:shadow-md transition-shadow bg-white border-gray-200"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900">{lead.name}</h4>
            <p className="text-sm text-gray-500">{lead.document}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{lead.phone}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Origem: {lead.source}</span>
            <span>{lead.lastContact}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Resp.: {lead.responsibleLawyer}
          </div>
          
          {lead.daysSinceLastContact > 7 && (
            <Badge variant="destructive" className="text-xs">
              {lead.daysSinceLastContact} dias sem contato
            </Badge>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => handleLeadAction(lead, 'contatar')}
            >
              <Phone className="h-3 w-3 mr-1" />
              Contatar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => handleLeadAction(lead, 'agendar')}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          </div>
          
          {nextStage && (
            <Button 
              size="sm" 
              className="w-full text-xs bg-lawblue-500 hover:bg-lawblue-600"
              onClick={() => onStageChange(lead.id, nextStage)}
            >
              Avançar <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

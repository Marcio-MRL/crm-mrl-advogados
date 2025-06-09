
import React from 'react';
import { Lead } from '@/types/lead';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadStageChange: (leadId: string, newStage: Lead['stage']) => void;
}

const stageConfig = [
  { key: 'new', label: 'Novos', color: 'bg-blue-50 border-blue-200' },
  { key: 'qualified', label: 'Qualificados', color: 'bg-purple-50 border-purple-200' },
  { key: 'meeting', label: 'Reunião', color: 'bg-orange-50 border-orange-200' },
  { key: 'proposal', label: 'Proposta', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'hired', label: 'Contratados', color: 'bg-green-50 border-green-200' },
] as const;

export function KanbanBoard({ leads, onLeadStageChange }: KanbanBoardProps) {
  const getLeadsByStage = (stage: Lead['stage']) => {
    return leads.filter(lead => lead.stage === stage);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {stageConfig.map((stage) => (
        <KanbanColumn
          key={stage.key}
          stage={stage.key as Lead['stage']}
          title={stage.label}
          color={stage.color}
          leads={getLeadsByStage(stage.key as Lead['stage'])}
          onLeadStageChange={onLeadStageChange}
        />
      ))}
    </div>
  );
}


import React from 'react';
import { Lead } from '@/types/lead';
import { KanbanCard } from './KanbanCard';
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  stage: Lead['stage'];
  title: string;
  color: string;
  leads: Lead[];
  onLeadStageChange: (leadId: string, newStage: Lead['stage']) => void;
}

export function KanbanColumn({ stage, title, color, leads, onLeadStageChange }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onLeadStageChange(leadId, stage);
    }
  };

  return (
    <div 
      className={`min-w-80 rounded-lg border-2 border-dashed p-4 ${color}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <Badge variant="secondary" className="bg-white">
          {leads.length}
        </Badge>
      </div>
      
      <div className="space-y-3 min-h-96">
        {leads.map((lead) => (
          <KanbanCard
            key={lead.id}
            lead={lead}
            onStageChange={onLeadStageChange}
          />
        ))}
        
        {leads.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Arraste leads para esta coluna
          </div>
        )}
      </div>
    </div>
  );
}

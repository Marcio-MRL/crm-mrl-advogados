
import React from 'react';
import { Lead } from '@/types/lead';
import { useLeadActions } from './LeadActions';
import { LeadCard } from './LeadCard';

interface LeadGridProps {
  leads: Lead[];
}

export function LeadGrid({ leads }: LeadGridProps) {
  const { handleLeadAction } = useLeadActions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => (
        <LeadCard 
          key={lead.id} 
          lead={lead}
          className="h-full"
          onAction={(action) => handleLeadAction(lead, action)}
        />
      ))}
      
      {leads.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">Nenhum lead encontrado nesta categoria</p>
        </div>
      )}
    </div>
  );
}

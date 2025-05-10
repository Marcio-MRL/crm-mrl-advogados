
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Lead } from '@/types/lead';
import { useLeadActions } from './LeadActions';

interface LeadGridProps {
  leads: Lead[];
}

export function LeadGrid({ leads }: LeadGridProps) {
  const { handleLeadAction } = useLeadActions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => (
        <div key={lead.id} className="glass-card p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{lead.name}</h3>
              <p className="text-sm text-gray-500">{lead.document}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              lead.stage === 'new' ? 'bg-blue-100 text-blue-800' :
              lead.stage === 'qualified' ? 'bg-purple-100 text-purple-800' :
              lead.stage === 'meeting' ? 'bg-orange-100 text-orange-800' :
              lead.stage === 'proposal' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {lead.stage === 'new' ? 'Novo' : 
               lead.stage === 'qualified' ? 'Qualificado' :
               lead.stage === 'meeting' ? 'Reunião' :
               lead.stage === 'proposal' ? 'Proposta' : 'Contratado'}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-lg">•</span>
              <span className="text-sm">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-lg">•</span>
              <span className="text-sm">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-lg">•</span>
              <span className="text-sm">Origem: {lead.source}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            <div>Último contato: {lead.lastContact}</div>
            <div>Resp.: {lead.responsibleLawyer}</div>
            {lead.daysSinceLastContact > 0 && (
              <div className={`mt-1 ${lead.daysSinceLastContact > 7 ? 'text-red-500 font-bold' : ''}`}>
                {lead.daysSinceLastContact} dias sem contato
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleLeadAction(lead, 'agendar')}
            >
              <Calendar className="h-4 w-4 mr-1" /> Agendar
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleLeadAction(lead, 'contatar')}
            >
              <ArrowRight className="h-4 w-4 mr-1" /> Contatar
            </Button>
            {lead.stage === 'proposal' && (
              <Button 
                className="w-full col-span-2 bg-lawblue-500 hover:bg-lawblue-600"
                onClick={() => handleLeadAction(lead, 'converter')}
              >
                Converter
              </Button>
            )}
          </div>
        </div>
      ))}
      
      {leads.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">Nenhum lead encontrado nesta categoria</p>
        </div>
      )}
    </div>
  );
}

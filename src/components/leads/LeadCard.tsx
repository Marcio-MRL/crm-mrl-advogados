
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadCardProps {
  lead: Lead;
  className?: string;
  onAction?: (action: string) => void;
}

const stageColors: Record<Lead['stage'], string> = {
  new: 'bg-blue-100 text-blue-800',
  qualified: 'bg-purple-100 text-purple-800',
  meeting: 'bg-orange-100 text-orange-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  hired: 'bg-green-100 text-green-800',
};

const stageName: Record<Lead['stage'], string> = {
  new: 'Novo',
  qualified: 'Qualificado',
  meeting: 'Reunião',
  proposal: 'Proposta',
  hired: 'Contratado',
};

export function LeadCard({ lead, className, onAction }: LeadCardProps) {
  return (
    <Card className={cn("glass-card border-none hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{lead.name}</h3>
            <p className="text-sm text-gray-500">{lead.document}</p>
          </div>
          <Badge className={cn("font-normal", stageColors[lead.stage])}>
            {stageName[lead.stage]}
          </Badge>
        </div>
        
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">📧 {lead.email}</p>
          <p className="text-sm text-gray-600">📱 {lead.phone}</p>
          <p className="text-sm text-gray-600">📂 Origem: {lead.source}</p>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Último contato: {lead.lastContact}</p>
            <p className="text-xs text-gray-500">Resp.: {lead.responsibleLawyer}</p>
          </div>
          
          {lead.daysSinceLastContact > 7 && (
            <Badge variant="destructive" className="text-xs">
              {lead.daysSinceLastContact} dias sem contato
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction?.('agendar')}
          >
            Agendar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => onAction?.('contatar')}
          >
            Contatar
          </Button>
          {lead.stage === 'proposal' && (
            <Button 
              size="sm" 
              className="text-xs bg-lawblue-500 hover:bg-lawblue-600"
              onClick={() => onAction?.('converter')}
            >
              Converter <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

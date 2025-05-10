
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export type LeadStage = 'new' | 'qualified' | 'meeting' | 'proposal' | 'hired';

interface LeadStageTabsProps {
  activeTab: LeadStage | 'all';
  onTabChange: (value: LeadStage | 'all') => void;
}

export function LeadStageTabs({ activeTab, onTabChange }: LeadStageTabsProps) {
  return (
    <Tabs 
      defaultValue="all" 
      value={activeTab}
      onValueChange={(value) => onTabChange(value as LeadStage | 'all')}
      className="w-full md:w-auto"
    >
      <TabsList className="glass-card">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="new">Novos</TabsTrigger>
        <TabsTrigger value="qualified">Qualificados</TabsTrigger>
        <TabsTrigger value="meeting">Reunião</TabsTrigger>
        <TabsTrigger value="proposal">Proposta</TabsTrigger>
        <TabsTrigger value="hired">Contratados</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

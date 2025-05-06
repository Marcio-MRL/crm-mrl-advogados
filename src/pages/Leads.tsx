
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { LeadCard } from '@/components/leads/LeadCard';
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from 'lucide-react';

// Dados simulados para demonstração
const mockLeads = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    document: 'CPF: 123.456.789-00',
    source: 'Site',
    stage: 'new',
    lastContact: '12/04/2025',
    responsibleLawyer: 'Dr. Marcos',
    daysSinceLastContact: 3,
  },
  {
    id: '2',
    name: 'Empresa ABC Ltda',
    email: 'contato@abc.com',
    phone: '(11) 3456-7890',
    document: 'CNPJ: 12.345.678/0001-90',
    source: 'Indicação',
    stage: 'qualified',
    lastContact: '05/04/2025',
    responsibleLawyer: 'Dra. Ana',
    daysSinceLastContact: 10,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(21) 97654-3210',
    document: 'CPF: 987.654.321-00',
    source: 'LinkedIn',
    stage: 'meeting',
    lastContact: '10/04/2025',
    responsibleLawyer: 'Dr. Paulo',
    daysSinceLastContact: 5,
  },
  {
    id: '4',
    name: 'Comércio XYZ Eireli',
    email: 'contato@xyz.com',
    phone: '(11) 2345-6789',
    document: 'CNPJ: 98.765.432/0001-10',
    source: 'Google Ads',
    stage: 'proposal',
    lastContact: '02/04/2025',
    responsibleLawyer: 'Dra. Carla',
    daysSinceLastContact: 13,
  },
  {
    id: '5',
    name: 'Roberto Ferreira',
    email: 'roberto.ferreira@email.com',
    phone: '(31) 98765-1234',
    document: 'CPF: 456.789.123-00',
    source: 'Instagram',
    stage: 'hired',
    lastContact: '15/04/2025',
    responsibleLawyer: 'Dr. Marcos',
    daysSinceLastContact: 0,
  },
];

type LeadStage = 'new' | 'qualified' | 'meeting' | 'proposal' | 'hired';

export default function Leads() {
  const [activeTab, setActiveTab] = useState<LeadStage | 'all'>('all');
  
  const filteredLeads = activeTab === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.stage === activeTab);
  
  return (
    <div>
      <Header title="Gestão de Leads" subtitle="Acompanhe e converta seus potenciais clientes" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as LeadStage | 'all')}
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
        
        <Button className="bg-lawblue-500 hover:bg-lawblue-600">
          <Plus size={16} className="mr-1" /> Novo Lead
        </Button>
      </div>
      
      <div className="glass-card p-4 mb-6 rounded-lg flex flex-col md:flex-row gap-4">
        <Input placeholder="Buscar lead..." className="md:w-1/3" />
        
        <div className="flex flex-1 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              <SelectItem value="site">Site</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os responsáveis</SelectItem>
              <SelectItem value="dr-marcos">Dr. Marcos</SelectItem>
              <SelectItem value="dra-ana">Dra. Ana</SelectItem>
              <SelectItem value="dr-paulo">Dr. Paulo</SelectItem>
              <SelectItem value="dra-carla">Dra. Carla</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        
        {filteredLeads.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Nenhum lead encontrado nesta categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}

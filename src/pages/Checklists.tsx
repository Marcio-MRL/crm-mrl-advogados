
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChecklistCard } from '@/components/checklists/ChecklistCard';
import { ChecklistTemplateList } from '@/components/checklists/ChecklistTemplateList';
import { Search, Plus, Filter } from 'lucide-react';

interface Checklist {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  progress: number;
  items: { id: string; text: string; checked: boolean }[];
  assignedTo?: string;
  client?: string;
  processId?: string;
}

const mockChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Contrato de Prestação de Serviços',
    description: 'Verificação dos requisitos para contrato de serviços jurídicos',
    dueDate: '2025-05-10',
    progress: 75,
    items: [
      { id: '1-1', text: 'Verificar documentação do cliente', checked: true },
      { id: '1-2', text: 'Confirmar valor dos honorários', checked: true },
      { id: '1-3', text: 'Redigir minuta do contrato', checked: true },
      { id: '1-4', text: 'Revisar cláusulas específicas', checked: false },
    ],
    assignedTo: 'Dr. Carlos Mendes',
    client: 'João da Silva'
  },
  {
    id: '2',
    title: 'Audiência Trabalhista',
    description: 'Preparação para audiência trabalhista',
    dueDate: '2025-05-20',
    progress: 33,
    items: [
      { id: '2-1', text: 'Analisar documentação do processo', checked: true },
      { id: '2-2', text: 'Preparar contestação', checked: false },
      { id: '2-3', text: 'Revisar jurisprudência aplicável', checked: false },
    ],
    assignedTo: 'Dra. Maria Oliveira',
    client: 'Construtora XYZ',
    processId: 'PROC-003/2025'
  },
  {
    id: '3',
    title: 'Due Diligence',
    description: 'Análise de documentação para aquisição',
    dueDate: '2025-06-15',
    progress: 10,
    items: [
      { id: '3-1', text: 'Verificar situação fiscal', checked: true },
      { id: '3-2', text: 'Analisar contratos vigentes', checked: false },
      { id: '3-3', text: 'Verificar processos judiciais existentes', checked: false },
      { id: '3-4', text: 'Analisar estrutura societária', checked: false },
      { id: '3-5', text: 'Preparar relatório final', checked: false },
    ],
    assignedTo: 'Dr. Paulo Santos',
    client: 'Empresa ABC'
  },
  {
    id: '4',
    title: 'Conformidade LGPD',
    description: 'Adequação às normas de proteção de dados',
    progress: 50,
    items: [
      { id: '4-1', text: 'Mapear dados pessoais tratados', checked: true },
      { id: '4-2', text: 'Revisar política de privacidade', checked: true },
      { id: '4-3', text: 'Implementar medidas de segurança', checked: false },
      { id: '4-4', text: 'Treinar equipe sobre LGPD', checked: false },
    ],
    assignedTo: 'Dra. Ana Silva',
    client: 'Distribuidora Bons Negócios'
  },
];

export default function Checklists() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChecklists = searchQuery.trim() !== '' 
    ? mockChecklists.filter(checklist => 
        checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        checklist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (checklist.client && checklist.client.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : mockChecklists;

  return (
    <div className="w-full space-y-6">
      <Header title="Checklists" subtitle="Gerenciamento de checklists e procedimentos" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar checklists..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600">
            <Plus className="h-4 w-4" /> Novo Checklist
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ChecklistTemplateList />
        </div>
        
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChecklists.map(checklist => (
              <ChecklistCard key={checklist.id} checklist={checklist} />
            ))}
            
            {filteredChecklists.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-lg font-medium">Nenhum checklist encontrado</h3>
                <p className="text-gray-500 mt-2">
                  Não foram encontrados checklists para sua pesquisa "{searchQuery}".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from 'lucide-react';
import type { ProcessData } from '@/hooks/useProcesses';

interface ProcessosFiltersProps {
  data: ProcessData[];
  onFilterChange: (filteredData: ProcessData[]) => void;
}

export function ProcessosFilters({ data, onFilterChange }: ProcessosFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('');

  // Função para aplicar todos os filtros
  const applyFilters = () => {
    let filtered = [...data];

    // Filtro de busca (número do processo, título ou cliente)
    if (searchTerm) {
      filtered = filtered.filter(processo => 
        processo.process_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter(processo => processo.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter(processo => processo.process_type === typeFilter);
    }

    // Filtro por responsável
    if (responsibleFilter) {
      filtered = filtered.filter(processo => 
        processo.responsible?.toLowerCase().includes(responsibleFilter.toLowerCase())
      );
    }

    onFilterChange(filtered);
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setResponsibleFilter('');
    onFilterChange([]);
  };

  // Aplicar filtros quando qualquer filtro mudar
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, typeFilter, responsibleFilter, data]);

  // Obter valores únicos para os selects
  const uniqueTypes = [...new Set(data.map(p => p.process_type).filter(Boolean))];
  const uniqueResponsibles = [...new Set(data.map(p => p.responsible).filter(Boolean))];

  const hasActiveFilters = searchTerm || statusFilter || typeFilter || responsibleFilter;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtros</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca geral */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar processos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="em_andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="suspenso">Suspenso</SelectItem>
            <SelectItem value="arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Tipo */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por Responsável */}
        <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os responsáveis</SelectItem>
            {uniqueResponsibles.map((responsible) => (
              <SelectItem key={responsible} value={responsible}>
                {responsible}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

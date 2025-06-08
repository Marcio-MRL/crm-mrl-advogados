
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FilterX } from 'lucide-react';
import { mockProcessos } from '@/data/mockProcessos';
import type { Processo } from '@/data/mockProcessos';

interface ProcessosFiltersProps {
  onFilterChange: (filteredData: Processo[]) => void;
}

export function ProcessosFilters({ onFilterChange }: ProcessosFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Aplicar filtros sempre que houver mudança
  useEffect(() => {
    let filtered = mockProcessos;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(processo => 
        processo.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        processo.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(processo => processo.status === statusFilter);
    }

    // Filtro de tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(processo => processo.tipo === typeFilter);
    }

    // Filtro de data
    if (startDate) {
      filtered = filtered.filter(processo => new Date(processo.dataInicio) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(processo => new Date(processo.dataInicio) <= new Date(endDate));
    }

    onFilterChange(filtered);
  }, [searchTerm, statusFilter, typeFilter, startDate, endDate, onFilterChange]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Busca */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Filtro de Status */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Aguardando manifestação">Aguardando manifestação</SelectItem>
                <SelectItem value="Prazo em curso">Prazo em curso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Tipo */}
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Cível">Cível</SelectItem>
                <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                <SelectItem value="Tributário">Tributário</SelectItem>
                <SelectItem value="Empresarial">Empresarial</SelectItem>
                <SelectItem value="Criminal">Criminal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Início */}
          <div>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Data inicial"
            />
          </div>

          {/* Botão Limpar */}
          <div>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="w-full"
            >
              <FilterX className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

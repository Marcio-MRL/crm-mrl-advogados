
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from 'lucide-react';

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedClient: string;
  onClientChange: (client: string) => void;
  onClearFilters: () => void;
}

export function DocumentFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedClient,
  onClientChange,
  onClearFilters
}: DocumentFiltersProps) {
  const documentTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word' },
    { value: 'xls', label: 'Excel' },
    { value: 'img', label: 'Imagens' }
  ];

  const clients = [
    { value: 'all', label: 'Todos os clientes' },
    { value: 'empresa-abc', label: 'Empresa ABC' },
    { value: 'joao-silva', label: 'João da Silva' },
    { value: 'distribuidora', label: 'Distribuidora Bons Negócios' },
    { value: 'construtora', label: 'Construtora XYZ' }
  ];

  const hasActiveFilters = selectedType !== 'all' || selectedClient !== 'all' || searchQuery.trim() !== '';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, cliente ou processo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedClient} onValueChange={onClientChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.value} value={client.value}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClearFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

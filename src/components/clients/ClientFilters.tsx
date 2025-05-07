
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="glass-card p-4 mb-6 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nome, CPF/CNPJ..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="varejo">Varejo</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="comercio">Comércio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

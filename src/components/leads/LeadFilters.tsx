
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from 'lucide-react';

export function LeadFilters() {
  return (
    <div className="glass-card p-4 mb-6 rounded-lg flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow md:flex-grow-0 max-w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar lead..."
          className="pl-8 w-full md:w-1/3"
        />
      </div>
      
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
  );
}

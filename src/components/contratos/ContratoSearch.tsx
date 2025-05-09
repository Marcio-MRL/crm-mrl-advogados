
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';

interface ContratoSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

export const ContratoSearch: React.FC<ContratoSearchProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onAddClick 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar contratos..."
          className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <Button 
        className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
        onClick={onAddClick}
      >
        <Plus className="h-4 w-4" /> Novo Contrato
      </Button>
    </div>
  );
};

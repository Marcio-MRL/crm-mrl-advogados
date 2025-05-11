
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';

interface ContratoSearchProps {
  onSearch: (query: string) => void;
}

export const ContratoSearch: React.FC<ContratoSearchProps> = ({ 
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative w-full md:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Buscar contratos..."
        className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

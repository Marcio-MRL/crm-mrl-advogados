
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

interface ClientTypeTabsProps {
  onTypeChange: (type: string) => void;
}

export const ClientTypeTabs: React.FC<ClientTypeTabsProps> = ({ onTypeChange }) => {
  return (
    <Tabs defaultValue="all" className="w-full md:w-auto">
      <TabsList className="glass-card">
        <TabsTrigger value="all" onClick={() => onTypeChange('all')}>
          Todos
        </TabsTrigger>
        <TabsTrigger value="pessoa_fisica" onClick={() => onTypeChange('pessoa_fisica')}>
          Pessoa Física
        </TabsTrigger>
        <TabsTrigger value="pessoa_juridica" onClick={() => onTypeChange('pessoa_juridica')}>
          Pessoa Jurídica
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

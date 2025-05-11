
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface AddButtonsProps {
  openClientModal: () => void;
  openProcessModal: () => void;
  openLeadModal: () => void;
}

export function AddButtons({ 
  openClientModal, 
  openProcessModal, 
  openLeadModal 
}: AddButtonsProps) {
  return (
    <div className="flex flex-wrap justify-end mb-4 gap-2">
      <Button 
        className="bg-lawblue-500 hover:bg-lawblue-600"
        onClick={openClientModal}
      >
        <Plus size={16} className="mr-1" /> Novo Cliente
      </Button>
      <Button 
        className="bg-lawblue-500 hover:bg-lawblue-600"
        onClick={openProcessModal}
      >
        <Plus size={16} className="mr-1" /> Novo Processo
      </Button>
      <Button 
        className="bg-lawblue-500 hover:bg-lawblue-600"
        onClick={openLeadModal}
      >
        <Plus size={16} className="mr-1" /> Novo Lead
      </Button>
    </div>
  );
}


import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, FileText, CheckSquare } from 'lucide-react';

interface AddButtonsProps {
  openLeadModal: () => void;
  openClientModal: () => void;
  openProcessModal: () => void;
  openTaskModal?: () => void;
}

export function AddButtons({ 
  openLeadModal, 
  openClientModal, 
  openProcessModal,
  openTaskModal 
}: AddButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={openLeadModal}
        className="bg-lawblue-500 hover:bg-lawblue-600 text-white"
        size="sm"
      >
        <Plus size={16} className="mr-1" />
        Lead
      </Button>
      
      <Button 
        onClick={openClientModal}
        className="bg-green-500 hover:bg-green-600 text-white"
        size="sm"
      >
        <UserPlus size={16} className="mr-1" />
        Cliente
      </Button>
      
      <Button 
        onClick={openProcessModal}
        className="bg-purple-500 hover:bg-purple-600 text-white"
        size="sm"
      >
        <FileText size={16} className="mr-1" />
        Processo
      </Button>

      {openTaskModal && (
        <Button 
          onClick={openTaskModal}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          <CheckSquare size={16} className="mr-1" />
          Tarefa
        </Button>
      )}
    </div>
  );
}

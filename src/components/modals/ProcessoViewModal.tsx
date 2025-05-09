
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProcessoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  processo?: {
    numero: string;
    cliente: string;
    tipo: string;
    status: string;
    dataInicio: string;
    responsavel: string;
    descricao?: string;
  };
}

export function ProcessoViewModal({ isOpen, onClose, processo }: ProcessoViewModalProps) {
  if (!processo) return null;

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Aguardando manifestação': return 'bg-yellow-100 text-yellow-800';
      case 'Prazo em curso': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{processo.numero} - {processo.cliente}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{processo.cliente}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p className="font-medium">{processo.tipo}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge className={getStatusClass(processo.status)}>{processo.status}</Badge>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Data de Início</p>
            <p className="font-medium">{processo.dataInicio}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Responsável</p>
            <p className="font-medium">{processo.responsavel}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Descrição</p>
          <p>{processo.descricao || 'Sem descrição disponível.'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

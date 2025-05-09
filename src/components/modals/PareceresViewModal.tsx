
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PareceresViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  parecer?: {
    id: string;
    titulo: string;
    cliente: string;
    tipo: string;
    dataCriacao: string;
    autor: string;
    conteudo?: string;
  };
}

export function PareceresViewModal({ isOpen, onClose, parecer }: PareceresViewModalProps) {
  if (!parecer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{parecer.titulo}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{parecer.tipo}</Badge>
            <span className="text-sm text-gray-500">
              Criado em: {parecer.dataCriacao}
            </span>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{parecer.cliente}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Autor</p>
            <p className="font-medium">{parecer.autor}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="prose max-w-none">
          <p className="text-sm text-gray-500 mb-2">Conteúdo</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            {parecer.conteudo || 'Sem conteúdo disponível.'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Calendar, Tag } from 'lucide-react';

interface LegalOpinion {
  id: string;
  title: string;
  client_name: string;
  type: string;
  content?: string;
  author: string;
  created_at: string;
  updated_at: string;
}

interface PareceresViewModalProps {
  parecer: LegalOpinion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PareceresViewModal({ parecer, isOpen, onClose }: PareceresViewModalProps) {
  if (!parecer) return null;

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'jurídico':
        return 'bg-blue-100 text-blue-800';
      case 'tributário':
        return 'bg-green-100 text-green-800';
      case 'trabalhista':
        return 'bg-yellow-100 text-yellow-800';
      case 'civil':
        return 'bg-purple-100 text-purple-800';
      case 'penal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {parecer.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium">Cliente:</span>
                <span>{parecer.client_name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                <span className="font-medium">Tipo:</span>
                <Badge className={getTypeColor(parecer.type)}>
                  {parecer.type}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium">Autor:</span>
                <span>{parecer.author}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data de Criação:</span>
                <span>{new Date(parecer.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Conteúdo do parecer */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Conteúdo do Parecer</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {parecer.content || 'Conteúdo não disponível'}
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          {parecer.updated_at !== parecer.created_at && (
            <div className="text-xs text-gray-500 border-t pt-3">
              Última atualização: {new Date(parecer.updated_at).toLocaleDateString('pt-BR')} às {new Date(parecer.updated_at).toLocaleTimeString('pt-BR')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

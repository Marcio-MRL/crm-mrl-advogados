
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContratoViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContratoViewModal({ isOpen, onClose, contratoId, onEdit, onDelete }: ContratoViewModalProps) {
  const [contrato, setContrato] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [clientName, setClientName] = React.useState<string>('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchContrato = async () => {
      if (!contratoId) return;
      
      setLoading(true);
      try {
        const { data: contratoData, error: contratoError } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contratoId)
          .single();
        
        if (contratoError) throw contratoError;
        
        setContrato(contratoData);
        
        // Fetch client name if client_id exists
        if (contratoData.client_id) {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('name')
            .eq('id', contratoData.client_id)
            .single();
          
          if (!clientError && clientData) {
            setClientName(clientData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching contrato:', error);
        toast.error('Erro ao carregar dados do contrato');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && contratoId) {
      fetchContrato();
    }
  }, [contratoId, isOpen]);

  const handleEdit = () => {
    if (contrato?.id) {
      onEdit(contrato.id);
    }
  };

  const handleDelete = () => {
    if (contrato?.id) {
      onDelete(contrato.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Detalhes do Contrato</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : contrato ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Número</span>
                <span className="text-lg font-semibold">{contrato.number}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Tipo</span>
                <span>{contrato.type}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Cliente</span>
              <span>{clientName || 'Não especificado'}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Data Início</span>
                <span>{formatDate(contrato.start_date)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Data Fim</span>
                <span>{contrato.end_date ? formatDate(contrato.end_date) : 'Não especificado'}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                contrato.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {contrato.status}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Valor</span>
              <span className="text-lg font-semibold">
                {typeof contrato.value === 'number' 
                  ? contrato.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'Não especificado'
                }
              </span>
            </div>
            
            {contrato.description && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Descrição</span>
                <p className="text-sm mt-1">{contrato.description}</p>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" /> Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" /> Excluir
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">Contrato não encontrado</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

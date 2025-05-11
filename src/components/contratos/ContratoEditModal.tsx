
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { ContratoForm } from './ContratoForm';
import { toast } from 'sonner';

interface ContratoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratoId: string | null;
  onSuccess: () => void;
}

export function ContratoEditModal({ isOpen, onClose, contratoId, onSuccess }: ContratoEditModalProps) {
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContrato = async () => {
      if (!contratoId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contratoId)
          .single();
        
        if (error) throw error;
        setContrato(data);
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

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Contrato</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <ContratoForm 
            onSuccess={handleSuccess} 
            onCancel={onClose}
            initialData={contrato}
            isEditing={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

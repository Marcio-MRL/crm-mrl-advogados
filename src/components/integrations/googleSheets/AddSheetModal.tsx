
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SheetMapping } from '@/types/googleSheets';

interface AddSheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSheet: (sheet: Omit<SheetMapping, 'id' | 'lastSync' | 'status'>) => boolean;
}

export function AddSheetModal({ open, onOpenChange, onAddSheet }: AddSheetModalProps) {
  const [newSheet, setNewSheet] = useState({
    name: '',
    url: '',
    type: 'financial' as 'financial' | 'clients' | 'processes'
  });

  const handleAddSheet = () => {
    const success = onAddSheet(newSheet);
    if (success) {
      setNewSheet({ name: '', url: '', type: 'financial' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Planilha</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Planilha</label>
            <Input
              placeholder="Ex: Controle de Clientes"
              value={newSheet.name}
              onChange={(e) => setNewSheet({...newSheet, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">URL da Planilha</label>
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={newSheet.url}
              onChange={(e) => setNewSheet({...newSheet, url: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Dados</label>
            <Select 
              value={newSheet.type} 
              onValueChange={(value: 'financial' | 'clients' | 'processes') => 
                setNewSheet({...newSheet, type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="processes">Processos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSheet}>
              Adicionar Planilha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

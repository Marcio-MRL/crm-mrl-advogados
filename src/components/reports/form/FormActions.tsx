
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isCreating: boolean;
}

export function FormActions({ onCancel, isCreating }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      <Button 
        type="submit" 
        className="bg-lawblue-500 hover:bg-lawblue-600"
        disabled={isCreating}
      >
        {isCreating ? 'Gerando...' : 'Gerar Relatório'}
      </Button>
    </div>
  );
}

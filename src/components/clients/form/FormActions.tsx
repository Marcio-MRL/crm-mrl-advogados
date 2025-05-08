
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ onCancel, isSubmitting = false }) => {
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
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
      </Button>
    </div>
  );
};


import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
        className="bg-lawblue-500 hover:bg-lawblue-600"
      >
        {isSubmitting ? "Salvando..." : "Salvar Lead"}
      </Button>
    </div>
  );
}

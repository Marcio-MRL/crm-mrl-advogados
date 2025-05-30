
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContratoFormValues } from '@/utils/contract-form-utils';

interface ValueAndStatusFieldsProps {
  form: UseFormReturn<ContratoFormValues>;
}

export function ValueAndStatusFields({ form }: ValueAndStatusFieldsProps) {
  // Handle currency formatting
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove non-numeric characters except for comma and dot
    value = value.replace(/[^\d.,]/g, '');
    
    // Handle the input formatting
    if (value) {
      // First, standardize the input by replacing commas with dots for calculation
      const standardizedInput = value.replace(/\./g, '').replace(',', '.');
      
      // Parse value to get a number
      let number = parseFloat(standardizedInput);
      if (isNaN(number)) number = 0;
      
      // Format back to Brazilian format with comma as decimal separator
      // and dots as thousands separator
      value = number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    
    form.setValue('value', value);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor (R$)</FormLabel>
            <FormControl>
              <Input 
                placeholder="0,00" 
                {...field} 
                onChange={handleValueChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

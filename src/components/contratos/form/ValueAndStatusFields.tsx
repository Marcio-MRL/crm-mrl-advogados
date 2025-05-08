
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContratoFormValues } from '@/utils/contract-form-utils';

interface ValueAndStatusFieldsProps {
  form: UseFormReturn<ContratoFormValues>;
}

export const ValueAndStatusFields: React.FC<ValueAndStatusFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <Input 
                placeholder="R$ 0,00" 
                {...field} 
                onChange={(e) => {
                  // Simple currency formatting
                  let value = e.target.value.replace(/\D/g, '');
                  if (value) {
                    value = (parseInt(value) / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    });
                  } else {
                    value = '';
                  }
                  field.onChange(value);
                }}
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Em elaboração">Em elaboração</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

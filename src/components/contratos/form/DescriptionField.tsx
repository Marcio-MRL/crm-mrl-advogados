
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ContratoFormValues } from '@/utils/contract-form-utils';

interface DescriptionFieldProps {
  form: UseFormReturn<ContratoFormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormControl>
            <Textarea placeholder="Descreva o contrato" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

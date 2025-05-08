
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
import { ClientFormValues } from '@/utils/form-utils';

interface NotesFieldProps {
  form: UseFormReturn<ClientFormValues>;
}

export const NotesField: React.FC<NotesFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notas</FormLabel>
          <FormControl>
            <Textarea placeholder="Observações adicionais" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from 'react-hook-form';
import { LeadFormValues } from '../LeadFormSchema';

export function ClassificationFields() {
  const form = useFormContext<LeadFormValues>();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origem</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Site">Site</SelectItem>
                <SelectItem value="Indicação">Indicação</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
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
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Contatado">Contatado</SelectItem>
                <SelectItem value="Em Negociação">Em Negociação</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Não Qualificado">Não Qualificado</SelectItem>
                <SelectItem value="Convertido">Convertido</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from 'react-hook-form';
import { LeadFormValues } from '../LeadFormSchema';

export function ContactFields() {
  const form = useFormContext<LeadFormValues>();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="Telefone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <Input placeholder="Empresa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

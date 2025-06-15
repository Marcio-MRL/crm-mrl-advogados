
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function NameField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Relatório</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome do relatório" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TypeField() {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Relatório</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="processual">Processual</SelectItem>
                    <SelectItem value="clientes">Clientes</SelectItem>
                    <SelectItem value="contratos">Contratos</SelectItem>
                    <SelectItem value="desempenho">Desempenho</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
        />
    )
}

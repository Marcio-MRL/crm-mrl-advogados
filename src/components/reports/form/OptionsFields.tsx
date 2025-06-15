
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function OptionsFields() {
  const { control } = useFormContext();

  return (
    <div className="space-y-3">
        <FormLabel>Opções do Relatório</FormLabel>
        
        <FormField
            control={control}
            name="includeCharts"
            render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
                <div className="space-y-1 leading-none">
                <FormLabel>Incluir gráficos e visualizações</FormLabel>
                </div>
            </FormItem>
            )}
        />

        <FormField
            control={control}
            name="includeDetails"
            render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
                <div className="space-y-1 leading-none">
                <FormLabel>Incluir detalhes e análises</FormLabel>
                </div>
            </FormItem>
            )}
        />
    </div>
  );
}

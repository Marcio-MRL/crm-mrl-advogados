
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

export function DateRangeField() {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="dateRange"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Período</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                    <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                    <SelectItem value="last_year">Último ano</SelectItem>
                    <SelectItem value="custom">Período personalizado</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
    )
}

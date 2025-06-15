
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionField() {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Descrição (Opcional)</FormLabel>
                <FormControl>
                    <Textarea 
                    placeholder="Descreva o objetivo do relatório..."
                    {...field} 
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
    )
}

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { contratoFormSchema, ContratoFormValues } from '@/utils/contract-form-utils';
import { BasicInfoFields } from './form/BasicInfoFields';
import { ClientField } from './form/ClientField';
import { DateFields } from './form/DateFields';
import { ValueAndStatusFields } from './form/ValueAndStatusFields';
import { DescriptionField } from './form/DescriptionField';

interface ContratoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function ContratoForm({ 
  onSuccess, 
  onCancel, 
  initialData,
  isEditing = false 
}: ContratoFormProps) {
  const form = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoFormSchema),
    defaultValues: {
      number: '',
      client_id: '',
      type: '',
      status: 'Ativo',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      value: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData && isEditing) {
      // Format value as string for the form
      const valueString = initialData.value ? initialData.value.toString() : '';
      
      form.reset({
        number: initialData.number || '',
        client_id: initialData.client_id || '',
        type: initialData.type || '',
        status: initialData.status || 'Ativo',
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
        value: valueString,
        description: initialData.description || '',
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = async (data: ContratoFormValues) => {
    try {
      const userId = await getCurrentUserId();

      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um contrato');
        return;
      }
      
      // Format value as numeric for database
      const valueNumeric = data.value ? parseFloat(data.value.replace(/\./g, '').replace(',', '.')) : null;
      
      if (isEditing && initialData?.id) {
        // Update existing contract
        const { error } = await supabase
          .from('contracts')
          .update({
            number: data.number,
            client_id: data.client_id || null,
            type: data.type,
            status: data.status,
            start_date: data.start_date,
            end_date: data.end_date || null,
            value: valueNumeric,
            description: data.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Insert new contract
        const { error } = await supabase.from('contracts').insert({
          number: data.number,
          client_id: data.client_id || null,
          type: data.type,
          status: data.status,
          start_date: data.start_date,
          end_date: data.end_date || null,
          value: valueNumeric,
          description: data.description || null,
          user_id: userId,
        });
        
        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving contrato:', error);
      toast.error('Erro ao salvar contrato');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        
        <ClientField form={form} />
        
        <DateFields form={form} />
        
        <ValueAndStatusFields form={form} />
        
        <DescriptionField form={form} />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Salvar Alterações' : 'Adicionar Contrato'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

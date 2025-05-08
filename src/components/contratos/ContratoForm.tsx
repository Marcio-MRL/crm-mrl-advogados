
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { contratoFormSchema, ContratoFormValues } from '@/utils/contract-form-utils';
import { BasicInfoFields } from './form/BasicInfoFields';
import { ClientField } from './form/ClientField';
import { DateFields } from './form/DateFields';
import { ValueAndStatusFields } from './form/ValueAndStatusFields';
import { DescriptionField } from './form/DescriptionField';
import { FormActions } from '../clients/form/FormActions';

interface ContratoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ContratoFormValues>;
}

export function ContratoForm({ onSuccess, onCancel, initialData }: ContratoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoFormSchema),
    defaultValues: {
      number: initialData?.number || '',
      client_id: initialData?.client_id || '',
      type: initialData?.type || '',
      status: initialData?.status || 'Ativo',
      start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
      end_date: initialData?.end_date || '',
      value: initialData?.value || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (data: ContratoFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um contrato');
        return;
      }

      // Ensure required fields are provided
      if (!data.number || !data.type) {
        toast.error('Número e tipo do contrato são obrigatórios');
        return;
      }

      let valueAsNumber = null;
      if (data.value && data.value.trim() !== '') {
        // Convert currency format to number
        valueAsNumber = parseFloat(data.value.replace(/[^\d.,]/g, '').replace(',', '.'));
      }

      const { error } = await supabase.from('contracts').insert({
        number: data.number,
        type: data.type,
        client_id: data.client_id || null,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date || null,
        value: valueAsNumber,
        description: data.description || null,
        user_id: userId
      });

      if (error) {
        console.error('Error inserting contract:', error);
        toast.error('Erro ao adicionar contrato: ' + error.message);
        return;
      }

      toast.success('Contrato adicionado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error in contract form submission:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <ClientField form={form} />
        <DateFields form={form} />
        <ValueAndStatusFields form={form} />
        <DescriptionField form={form} />
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}

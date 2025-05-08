
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clientFormSchema, ClientFormValues } from '@/utils/form-utils';
import { BasicInfoFields } from './form/BasicInfoFields';
import { ContactFields } from './form/ContactFields';
import { AddressFields } from './form/AddressFields';
import { NotesField } from './form/NotesField';
import { FormActions } from './form/FormActions';

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ClientFormValues>;
}

export function ClientForm({ onSuccess, onCancel, initialData }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      document: initialData?.document || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postal_code: initialData?.postal_code || '',
      notes: initialData?.notes || '',
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um cliente');
        return;
      }

      // Ensure name and type are provided
      if (!data.name || !data.type) {
        toast.error('Nome e tipo são obrigatórios');
        return;
      }

      const { error } = await supabase.from('clients').insert({
        name: data.name,
        type: data.type,
        document: data.document || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        postal_code: data.postal_code || null,
        notes: data.notes || null,
        user_id: userId,
        status: 'ativo',
      });

      if (error) {
        console.error('Error inserting client:', error);
        toast.error('Erro ao adicionar cliente: ' + error.message);
        return;
      }

      toast.success('Cliente adicionado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error in client form submission:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <ContactFields form={form} />
        <AddressFields form={form} />
        <NotesField form={form} />
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}

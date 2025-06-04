
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadFormSchema, LeadFormValues } from './LeadFormSchema';
import { BasicInfoFields } from './form/BasicInfoFields';
import { ContactFields } from './form/ContactFields';
import { ClassificationFields } from './form/ClassificationFields';
import { NotesField } from './form/NotesField';
import { FormActions } from './form/FormActions';

interface LeadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function LeadForm({ onSuccess, onCancel }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      status: 'Novo',
      notes: '',
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um lead');
        return;
      }

      const { error } = await supabase.from('leads').insert({
        nome_lead: data.name,
        email: data.email || null,
        telefone: data.phone || null,
        origem_lead: data.source || null,
        status_lead: data.status,
        observacoes: data.notes || null,
        data_criacao: new Date().toISOString(),
        data_ultima_interacao: new Date().toISOString()
      });

      if (error) {
        console.error('Error inserting lead:', error);
        toast.error('Erro ao adicionar lead: ' + error.message);
        return;
      }

      toast.success('Lead adicionado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields />
        <ContactFields />
        <ClassificationFields />
        <NotesField />
        <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
}

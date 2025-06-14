
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProcesses, type ProcessData } from '@/hooks/useProcesses';

const processoFormSchema = z.object({
  process_number: z.string().min(1, { message: "Número do processo é obrigatório" }),
  title: z.string().min(1, { message: "Título é obrigatório" }),
  client_id: z.string().optional(),
  client_name: z.string().optional(),
  process_type: z.string().min(1, { message: "Tipo do processo é obrigatório" }),
  forum: z.string().optional(),
  status: z.string().min(1, { message: "Status é obrigatório" }),
  start_date: z.string().min(1, { message: "Data de início é obrigatória" }),
  responsible: z.string().optional(),
  description: z.string().optional(),
});

type ProcessoFormValues = z.infer<typeof processoFormSchema>;

interface ProcessoFormProps {
  initialData?: ProcessData | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProcessoForm({ initialData, onSuccess, onCancel }: ProcessoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProcess, updateProcess } = useProcesses();
  
  const form = useForm<ProcessoFormValues>({
    resolver: zodResolver(processoFormSchema),
    defaultValues: {
      process_number: initialData?.process_number || '',
      title: initialData?.title || '',
      client_id: initialData?.client_id || '',
      client_name: initialData?.client_name || '',
      process_type: initialData?.process_type || '',
      forum: initialData?.forum || '',
      status: initialData?.status || 'em_andamento',
      start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
      responsible: initialData?.responsible || '',
      description: initialData?.description || '',
    },
  });

  const onSubmit = async (data: ProcessoFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure all required fields are present with proper types
      const processData = {
        process_number: data.process_number,
        title: data.title,
        client_id: data.client_id,
        client_name: data.client_name,
        process_type: data.process_type,
        forum: data.forum,
        status: data.status,
        start_date: data.start_date,
        responsible: data.responsible,
        description: data.description,
      };
      
      if (initialData?.id) {
        await updateProcess(initialData.id, processData);
      } else {
        await createProcess(processData);
      }
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="process_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Processo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 0001234-56.2024.8.09.0001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Processo</FormLabel>
                <FormControl>
                  <Input placeholder="Título do processo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="process_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cível">Cível</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Tributário">Tributário</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                    <SelectItem value="Família">Família</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="forum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fórum</FormLabel>
                <FormControl>
                  <Input placeholder="Fórum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="responsible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Advogado responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os detalhes do processo" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-lawblue-500 hover:bg-lawblue-600"
          >
            {isSubmitting ? "Salvando..." : initialData?.id ? "Atualizar Processo" : "Salvar Processo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

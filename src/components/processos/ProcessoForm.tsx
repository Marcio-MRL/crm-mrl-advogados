
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const processoFormSchema = z.object({
  number: z.string().min(1, { message: "Número do processo é obrigatório" }),
  client_id: z.string().optional(),
  type: z.string().min(1, { message: "Tipo do processo é obrigatório" }),
  forum: z.string().optional(),
  status: z.string().min(1, { message: "Status é obrigatório" }),
  start_date: z.string().min(1, { message: "Data de início é obrigatória" }),
  description: z.string().optional(),
});

type ProcessoFormValues = z.infer<typeof processoFormSchema>;

interface ProcessoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProcessoForm({ onSuccess, onCancel }: ProcessoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<{ id: string, name: string }[]>([]);
  
  const form = useForm<ProcessoFormValues>({
    resolver: zodResolver(processoFormSchema),
    defaultValues: {
      number: '',
      client_id: '',
      type: '',
      forum: '',
      status: 'Ativo',
      start_date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });
  
  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setClients(data || []);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    
    fetchClients();
  }, []);

  const onSubmit = async (data: ProcessoFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um processo');
        return;
      }

      // Simulação de envio para o banco de dados
      toast.success('Processo adicionado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao adicionar processo:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação');
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
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Processo</FormLabel>
                <FormControl>
                  <Input placeholder="Número do processo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Arquivado">Arquivado</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
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
            {isSubmitting ? "Salvando..." : "Salvar Processo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

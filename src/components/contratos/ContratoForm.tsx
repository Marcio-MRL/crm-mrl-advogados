
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Form schema
const contratoFormSchema = z.object({
  number: z.string().min(1, 'Número do contrato é obrigatório'),
  client_id: z.string().optional(),
  type: z.string().min(1, 'Tipo do contrato é obrigatório'),
  status: z.string().default('Ativo'),
  start_date: z.string(),
  end_date: z.string().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
});

type ContratoFormValues = z.infer<typeof contratoFormSchema>;

interface ContratoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ContratoFormValues>;
}

interface Client {
  id: string;
  name: string;
}

export function ContratoForm({ onSuccess, onCancel, initialData }: ContratoFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setClients(data as Client[]);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Erro ao carregar lista de clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const onSubmit = async (data: ContratoFormValues) => {
    try {
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
                <FormLabel>Número do Contrato</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: CT-001/2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de contrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Prestação de Serviços">Prestação de Serviços</SelectItem>
                    <SelectItem value="Assessoria Jurídica">Assessoria Jurídica</SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                    <SelectItem value="Contencioso">Contencioso</SelectItem>
                    <SelectItem value="Representação">Representação</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Vencimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="R$ 0,00" 
                    {...field} 
                    onChange={(e) => {
                      // Simple currency formatting
                      let value = e.target.value.replace(/\D/g, '');
                      if (value) {
                        value = (parseInt(value) / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        });
                      } else {
                        value = '';
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Em elaboração">Em elaboração</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
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
                <Textarea placeholder="Descreva o contrato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" className="bg-lawblue-500 hover:bg-lawblue-600">
            Salvar Contrato
          </Button>
        </div>
      </form>
    </Form>
  );
}

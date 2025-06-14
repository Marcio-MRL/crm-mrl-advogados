
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

const pareceresFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  client_name: z.string().min(2, 'Nome do cliente é obrigatório'),
  type: z.string().min(1, 'Selecione um tipo de parecer'),
  author: z.string().min(2, 'Nome do autor é obrigatório'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
});

type PareceresFormValues = z.infer<typeof pareceresFormSchema>;

interface PareceresFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<PareceresFormValues>;
}

interface Client {
  id: string;
  name: string;
}

export function PareceresForm({ onSuccess, onCancel, initialData }: PareceresFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<PareceresFormValues>({
    resolver: zodResolver(pareceresFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      client_name: initialData?.client_name || '',
      type: initialData?.type || '',
      author: initialData?.author || '',
      content: initialData?.content || '',
    },
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
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

  const onSubmit = async (data: PareceresFormValues) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para criar um parecer');
        return;
      }

      const { error } = await supabase
        .from('legal_opinions')
        .insert({
          title: data.title,
          client_name: data.client_name,
          type: data.type,
          author: data.author,
          content: data.content,
          user_id: userId,
        });

      if (error) {
        console.error('Error inserting legal opinion:', error);
        toast.error('Erro ao criar parecer: ' + error.message);
        return;
      }

      toast.success('Parecer criado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error in parecer form submission:', error);
      toast.error('Ocorreu um erro ao processar sua solicitação');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Parecer</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título do parecer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Parecer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jurídico">Jurídico</SelectItem>
                    <SelectItem value="Tributário">Tributário</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Penal">Penal</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                    <SelectItem value="Ambiental">Ambiental</SelectItem>
                    <SelectItem value="Administrativo">Administrativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor do Parecer</FormLabel>
              <FormControl>
                <Input placeholder="Nome do advogado responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo do Parecer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite o conteúdo completo do parecer jurídico..."
                  className="min-h-[200px]"
                  {...field}
                />
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
            Salvar Parecer
          </Button>
        </div>
      </form>
    </Form>
  );
}

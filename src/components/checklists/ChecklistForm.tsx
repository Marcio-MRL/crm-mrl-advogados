
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
import { Trash2, Plus } from 'lucide-react';

// Form schema
const checklistFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  assigned_to: z.string().optional(),
  client_id: z.string().optional(),
  process_id: z.string().optional(),
  items: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(3, 'Item deve ter pelo menos 3 caracteres'),
  }))
});

type ChecklistFormValues = z.infer<typeof checklistFormSchema>;

interface ChecklistFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ChecklistFormValues>;
}

interface Client {
  id: string;
  name: string;
}

interface Process {
  id: string;
  title: string;
}

export function ChecklistForm({ onSuccess, onCancel, initialData }: ChecklistFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      due_date: initialData?.due_date || '',
      assigned_to: initialData?.assigned_to || '',
      client_id: initialData?.client_id || '',
      process_id: initialData?.process_id || '',
      items: initialData?.items || [{ text: '' }]
    },
  });

  const { fields, append, remove } = form.control._formValues.items;

  useEffect(() => {
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
      }
    };

    const fetchProcesses = async () => {
      try {
        const { data, error } = await supabase
          .from('processes')
          .select('id, title')
          .order('title');
          
        if (error) {
          throw error;
        }
        
        setProcesses(data as Process[]);
      } catch (error) {
        console.error('Error fetching processes:', error);
        toast.error('Erro ao carregar lista de processos');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    fetchProcesses();
  }, []);

  const onSubmit = async (data: ChecklistFormValues) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para adicionar um checklist');
        return;
      }

      // Filter out empty checklist items
      const items = data.items.filter(item => item.text.trim() !== '');
      
      if (items.length === 0) {
        toast.error('Adicione pelo menos um item ao checklist');
        return;
      }

      // Create the checklist
      const { data: checklist, error } = await supabase
        .from('checklists')
        .insert({
          title: data.title,
          description: data.description || null,
          due_date: data.due_date || null,
          assigned_to: data.assigned_to || null,
          client_id: data.client_id || null,
          process_id: data.process_id || null,
          progress: 0, // Initial progress is 0%
          user_id: userId,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error inserting checklist:', error);
        toast.error('Erro ao adicionar checklist: ' + error.message);
        return;
      }

      // Create the checklist items
      const checklistItems = items.map(item => ({
        checklist_id: checklist.id,
        text: item.text,
        checked: false
      }));

      const { error: itemsError } = await supabase
        .from('checklist_items')
        .insert(checklistItems);

      if (itemsError) {
        console.error('Error inserting checklist items:', itemsError);
        toast.error('Erro ao adicionar itens do checklist: ' + itemsError.message);
        return;
      }

      toast.success('Checklist adicionado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error in checklist form submission:', error);
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
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do checklist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição do checklist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="due_date"
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
          
          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_id"
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
          
          <FormField
            control={form.control}
            name="process_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o processo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {processes.map((process) => (
                      <SelectItem key={process.id} value={process.id}>
                        {process.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FormLabel>Itens do Checklist</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const items = form.getValues('items') || [];
                form.setValue('items', [...items, { text: '' }]);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Item
            </Button>
          </div>
          
          {form.getValues('items')?.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`items.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1 mb-1">
                    <FormControl>
                      <Input placeholder={`Item ${index + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const items = form.getValues('items');
                    form.setValue('items', items.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" className="bg-lawblue-500 hover:bg-lawblue-600">
            Salvar Checklist
          </Button>
        </div>
      </form>
    </Form>
  );
}

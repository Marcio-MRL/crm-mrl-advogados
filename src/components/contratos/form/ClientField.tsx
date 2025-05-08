
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContratoFormValues } from '@/utils/contract-form-utils';

interface Client {
  id: string;
  name: string;
}

interface ClientFieldProps {
  form: UseFormReturn<ContratoFormValues>;
}

export const ClientField: React.FC<ClientFieldProps> = ({ form }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
};

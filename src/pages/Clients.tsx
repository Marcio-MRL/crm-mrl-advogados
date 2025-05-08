
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientFilters } from '@/components/clients/ClientFilters';
import { ClientTypeTabs } from '@/components/clients/ClientTypeTabs';
import { FormModal } from '@/components/common/FormModal';
import { ClientForm } from '@/components/clients/ClientForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types/client';

export default function Clients() {
  const [clientType, setClientType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      setClients(data as Client[]);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientAdded = () => {
    closeModal();
    fetchClients();
  };

  const filteredClients = clients.filter(client => {
    const matchesType = clientType === 'all' || client.type === clientType;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (client.document && client.document.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <Header title="Clientes" subtitle="Gerenciamento de clientes e contratos" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <ClientTypeTabs onTypeChange={setClientType} />
        
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openModal}
        >
          <Plus size={16} className="mr-1" /> Novo Cliente
        </Button>
      </div>
      
      <ClientFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando clientes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client: Client) => (
            <ClientCard key={client.id} client={client} />
          ))}
          
          {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adicionar Novo Cliente"
      >
        <ClientForm onSuccess={handleClientAdded} onCancel={closeModal} />
      </FormModal>
    </div>
  );
}

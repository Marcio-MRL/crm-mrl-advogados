
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContratoTable, Contrato } from './ContratoTable';
import { ContratoSearch } from './ContratoSearch';
import { FormModal } from '@/components/common/FormModal';
import { ContratoForm } from '@/components/contratos/ContratoForm';

export const ContratosList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filteredContratos, setFilteredContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContratos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          number,
          type,
          status,
          start_date,
          end_date,
          value,
          client_id,
          clients (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      const formattedData = data.map(contract => ({
        id: contract.id,
        numero: contract.number,
        number: contract.number,
        cliente: contract.clients?.name || 'Cliente não especificado',
        cliente_nome: contract.clients?.name,
        tipo: contract.type,
        type: contract.type,
        status: contract.status,
        dataInicio: contract.start_date,
        start_date: contract.start_date,
        dataVencimento: contract.end_date,
        end_date: contract.end_date,
        valor: contract.value,
        value: contract.value,
        client_id: contract.client_id
      }));

      setContratos(formattedData);
      setFilteredContratos(formattedData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = contratos.filter(
      (contrato) =>
        contrato.number.toLowerCase().includes(query) ||
        contrato.cliente.toLowerCase().includes(query) ||
        contrato.type.toLowerCase().includes(query) ||
        contrato.status.toLowerCase().includes(query)
    );
    
    setFilteredContratos(filtered);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleContratoAdded = () => {
    closeModal();
    fetchContratos();
  };

  return (
    <>
      <ContratoSearch 
        searchQuery={searchQuery} 
        onSearchChange={handleSearch} 
        onAddClick={openModal} 
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Contratos em Vigor</CardTitle>
        </CardHeader>
        <CardContent>
          <ContratoTable contratos={filteredContratos} loading={loading} />
        </CardContent>
      </Card>
      
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adicionar Novo Contrato"
      >
        <ContratoForm onSuccess={handleContratoAdded} onCancel={closeModal} />
      </FormModal>
    </>
  );
};

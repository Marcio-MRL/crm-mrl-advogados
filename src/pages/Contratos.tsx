
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FormModal } from '@/components/common/FormModal';
import { ContratoForm } from '@/components/contratos/ContratoForm';
import { supabase, formatDate } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Contrato {
  id: string;
  numero: string;
  number: string;
  client_id: string;
  cliente: string;
  tipo: string;
  type: string;
  status: string;
  dataInicio: string;
  start_date: string;
  dataVencimento: string;
  end_date: string;
  valor: number;
  value: number;
  cliente_nome?: string;
}

export default function Contratos() {
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Ativo':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Vencido':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleContratoAdded = () => {
    closeModal();
    fetchContratos();
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Contratos" subtitle="Gestão de contratos e documentos jurídicos" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar contratos..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Button 
          className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Contratos em Vigor</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando contratos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                  <TableHead className="hidden md:table-cell">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContratos.length > 0 ? (
                  filteredContratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-medium">{contrato.number}</TableCell>
                      <TableCell>{contrato.cliente}</TableCell>
                      <TableCell className="hidden md:table-cell">{contrato.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(contrato.status)}
                          <span>{contrato.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(contrato.end_date)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatCurrency(contrato.value)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Visualizar</Button>
                          <Button variant="ghost" size="sm">Editar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum contrato encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adicionar Novo Contrato"
      >
        <ContratoForm onSuccess={handleContratoAdded} onCancel={closeModal} />
      </FormModal>
    </div>
  );
}

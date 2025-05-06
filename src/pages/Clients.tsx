
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados simulados para demonstração
const mockClients = [
  {
    id: '1',
    name: 'João Silva',
    document: 'CPF: 123.456.789-00',
    type: 'pessoa_fisica',
    phone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    sector: 'Varejo',
    status: 'ativo',
    processCount: 2,
    contractCount: 1,
  },
  {
    id: '2',
    name: 'Empresa ABC Ltda',
    document: 'CNPJ: 12.345.678/0001-90',
    type: 'pessoa_juridica',
    phone: '(11) 3456-7890',
    email: 'contato@abc.com',
    sector: 'Tecnologia',
    status: 'ativo',
    processCount: 3,
    contractCount: 2,
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    document: 'CPF: 987.654.321-00',
    type: 'pessoa_fisica',
    phone: '(21) 97654-3210',
    email: 'maria.oliveira@email.com',
    sector: 'Educação',
    status: 'inativo',
    processCount: 1,
    contractCount: 0,
  },
  {
    id: '4',
    name: 'Comércio XYZ Eireli',
    document: 'CNPJ: 98.765.432/0001-10',
    type: 'pessoa_juridica',
    phone: '(11) 2345-6789',
    email: 'contato@xyz.com',
    sector: 'Comércio',
    status: 'ativo',
    processCount: 5,
    contractCount: 2,
  },
];

type ClientType = 'pessoa_fisica' | 'pessoa_juridica';
type ClientStatus = 'ativo' | 'inativo';

interface Client {
  id: string;
  name: string;
  document: string;
  type: ClientType;
  phone: string;
  email: string;
  sector: string;
  status: ClientStatus;
  processCount: number;
  contractCount: number;
}

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
  return (
    <Card className="glass-card hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-lawblue-700">
            {client.name}
          </CardTitle>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            client.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {client.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <p className="text-sm text-gray-500">{client.document}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Contato:</p>
            <p>{client.phone}</p>
            <p>{client.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Setor:</p>
            <p>{client.sector}</p>
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-lawblue-600">{client.processCount} processos</span>
          <span className="text-lawblue-600">{client.contractCount} contratos</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">Ver detalhes</Button>
          <Button size="sm" className="flex-1 bg-lawblue-500 hover:bg-lawblue-600">Novo Processo</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Clients() {
  const [clientType, setClientType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredClients = mockClients.filter(client => {
    const matchesType = clientType === 'all' || client.type === clientType;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.document.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <Header title="Clientes" subtitle="Gerenciamento de clientes e contratos" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="glass-card">
            <TabsTrigger value="all" onClick={() => setClientType('all')}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="pessoa_fisica" onClick={() => setClientType('pessoa_fisica')}>
              Pessoa Física
            </TabsTrigger>
            <TabsTrigger value="pessoa_juridica" onClick={() => setClientType('pessoa_juridica')}>
              Pessoa Jurídica
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button className="bg-lawblue-500 hover:bg-lawblue-600">
          <Plus size={16} className="mr-1" /> Novo Cliente
        </Button>
      </div>
      
      <div className="glass-card p-4 mb-6 rounded-lg flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nome, CPF/CNPJ..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="varejo">Varejo</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="comercio">Comércio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        
        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

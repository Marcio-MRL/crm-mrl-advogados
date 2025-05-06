
import { Client } from '@/types/client';

// Mock client data with proper typing
export const mockClients: Client[] = [
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


import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpRight, ArrowDownRight, Plus, Filter, Settings } from 'lucide-react';
import { TransactionCategoryBadge } from './TransactionCategoryBadge';
import { CategoriesModal } from './CategoriesModal';
import { Transaction } from '@/types/financial';
import { toast } from 'sonner';

const mockTransactions: Transaction[] = [
  { id: 1, data: '2025-05-05', descricao: 'Pagamento Cliente XYZ', categoria: 'Honorários', tipo: 'entrada', valor: 12500.00 },
  { id: 2, data: '2025-05-03', descricao: 'Aluguel Escritório', categoria: 'Despesas Fixas', tipo: 'saida', valor: 8500.00 },
  { id: 3, data: '2025-05-02', descricao: 'Serviços de Consultoria', categoria: 'Honorários', tipo: 'entrada', valor: 5800.00 },
  { id: 4, data: '2025-04-30', descricao: 'Impostos e Tributos', categoria: 'Impostos', tipo: 'saida', valor: 4320.45 },
  { id: 5, data: '2025-04-28', descricao: 'Contrato Anual - Cliente ABC', categoria: 'Honorários', tipo: 'entrada', valor: 30000.00 },
  { id: 6, data: '2025-04-25', descricao: 'Folha de Pagamento', categoria: 'Pessoal', tipo: 'saida', valor: 18500.00 },
  { id: 7, data: '2025-04-20', descricao: 'Honorários Processuais', categoria: 'Honorários', tipo: 'entrada', valor: 2500.00 },
  { id: 8, data: '2025-04-15', descricao: 'Material de Escritório', categoria: 'Suprimentos', tipo: 'saida', valor: 850.00 },
  { id: 9, data: '2025-04-12', descricao: 'Licença de Software Jurídico', categoria: 'Software', tipo: 'saida', valor: 1200.00 },
  { id: 10, data: '2025-04-10', descricao: 'Curso de Atualização', categoria: 'Capacitação', tipo: 'saida', valor: 2800.00 },
];

export function FinancialTransactionsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      filterTransactions(categoryFilter);
      return;
    }
    
    const filtered = mockTransactions.filter(
      (transaction) =>
        transaction.descricao.toLowerCase().includes(query) ||
        transaction.categoria.toLowerCase().includes(query)
    );
    
    setTransactions(filtered);
  };

  const filterTransactions = (category: string | null) => {
    setCategoryFilter(category);
    
    if (!category) {
      setTransactions(mockTransactions);
      return;
    }
    
    const filtered = mockTransactions.filter(
      transaction => transaction.categoria === category
    );
    
    setTransactions(filtered);
  };

  const formatCurrency = (value: number, type: string) => {
    return `${type === 'saida' ? '-' : '+'} ${value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`;
  };

  const handleAddTransaction = () => {
    toast.info("Funcionalidade para adicionar transações será implementada em breve.");
  };

  const handleFilter = () => {
    toast.info("Funcionalidade de filtros avançados será implementada em breve.");
  };

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(mockTransactions.map(t => t.categoria)));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar transações..."
            className="pl-8 w-full bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setIsCategoriesModalOpen(true)}
          >
            <Settings className="h-4 w-4" /> Categorias
          </Button>
          
          <Button 
            className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
            onClick={handleAddTransaction}
          >
            <Plus className="h-4 w-4" /> Nova Transação
          </Button>
        </div>
      </div>
      
      {/* Category chips for quick filtering */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => filterTransactions(null)}
          className={`px-3 py-1 rounded-full text-xs ${
            !categoryFilter ? 'bg-lawblue-100 text-lawblue-800' : 'bg-gray-100 text-gray-800'
          } hover:bg-opacity-80 transition-colors`}
        >
          Todas
        </button>
        {uniqueCategories.map(category => (
          <button
            key={category}
            onClick={() => filterTransactions(category)}
            className={`px-3 py-1 rounded-full text-xs ${
              categoryFilter === category ? 'bg-lawblue-100 text-lawblue-800' : 'bg-gray-100 text-gray-800'
            } hover:bg-opacity-80 transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.data).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.tipo === 'entrada' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    {transaction.descricao}
                  </div>
                </TableCell>
                <TableCell>
                  <TransactionCategoryBadge category={transaction.categoria} />
                </TableCell>
                <TableCell className={`font-medium ${
                  transaction.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.valor, transaction.tipo)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline">Ver todas as transações</Button>
      </div>

      <CategoriesModal 
        isOpen={isCategoriesModalOpen} 
        onClose={() => setIsCategoriesModalOpen(false)} 
      />
    </div>
  );
}

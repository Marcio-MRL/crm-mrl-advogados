
import React, { useState, useMemo } from 'react';
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
import { Search, ArrowUpRight, ArrowDownRight, Plus, Settings, RefreshCw } from 'lucide-react';
import { TransactionCategoryBadge } from './TransactionCategoryBadge';
import { CategoriesModal } from './CategoriesModal';
import { TransactionFilters } from './TransactionFilters';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

export function FinancialTransactionsTable() {
  const { transactions, uniqueCategories, isLoading, refetch } = useFinancialTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.descricao.toLowerCase().includes(query) ||
          transaction.categoria?.toLowerCase().includes(query)
      );
    }

    // Filtro por categoria
    if (categoryFilter) {
      filtered = filtered.filter(transaction => transaction.categoria === categoryFilter);
    }

    // Filtro por tipo
    if (typeFilter) {
      filtered = filtered.filter(transaction => transaction.tipo === typeFilter);
    }

    // Filtro por período
    if (dateRange) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.data);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    return filtered;
  }, [transactions, searchQuery, categoryFilter, typeFilter, dateRange]);

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter(null);
    setTypeFilter(null);
    setDateRange(null);
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

  const handleRefresh = () => {
    refetch();
    toast.success("Transações atualizadas!");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TransactionFilters
        onDateRangeChange={handleDateRangeChange}
        onCategoryChange={setCategoryFilter}
        onTypeChange={setTypeFilter}
        onClearFilters={handleClearFilters}
        categories={uniqueCategories}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar transações..."
            className="pl-8 w-full bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" /> Atualizar
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
          onClick={() => setCategoryFilter(null)}
          className={`px-3 py-1 rounded-full text-xs ${
            !categoryFilter ? 'bg-lawblue-100 text-lawblue-800' : 'bg-gray-100 text-gray-800'
          } hover:bg-opacity-80 transition-colors`}
        >
          Todas
        </button>
        {uniqueCategories.map(category => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-3 py-1 rounded-full text-xs ${
              categoryFilter === category ? 'bg-lawblue-100 text-lawblue-800' : 'bg-gray-100 text-gray-800'
            } hover:bg-opacity-80 transition-colors`}
          >
            {category}
          </button>
        ))}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma transação encontrada</p>
          <p className="text-sm text-gray-400 mt-2">
            Sincronize suas transações bancárias na aba Integrações para ver seus dados financeiros
          </p>
        </div>
      ) : (
        <>
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
                {filteredTransactions.map((transaction) => (
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
                        <div>
                          <p className="font-medium">{transaction.descricao}</p>
                          {transaction.mensagem && (
                            <p className="text-xs text-gray-500">{transaction.mensagem}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TransactionCategoryBadge category={transaction.categoria || 'Sem categoria'} />
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

          {filteredTransactions.length === 0 && transactions.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma transação encontrada com os filtros aplicados.
            </div>
          )}

          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-500">
              Total: {filteredTransactions.length} de {transactions.length} transações
            </p>
          </div>
        </>
      )}

      <CategoriesModal 
        isOpen={isCategoriesModalOpen} 
        onClose={() => setIsCategoriesModalOpen(false)} 
      />
    </div>
  );
}

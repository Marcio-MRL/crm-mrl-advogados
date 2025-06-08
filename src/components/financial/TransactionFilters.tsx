
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays, FilterX } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface TransactionFiltersProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onCategoryChange: (category: string | null) => void;
  onTypeChange: (type: string | null) => void;
  onClearFilters: () => void;
  categories: string[];
}

export function TransactionFilters({ 
  onDateRangeChange, 
  onCategoryChange, 
  onTypeChange, 
  onClearFilters,
  categories 
}: TransactionFiltersProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const handleDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('');
    setSelectedType('');
    onClearFilters();
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm font-medium">Data Inicial</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value && endDate) {
                  onDateRangeChange(e.target.value, endDate);
                }
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Data Final</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (startDate && e.target.value) {
                  onDateRangeChange(startDate, e.target.value);
                }
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value);
                onCategoryChange(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <Select 
              value={selectedType} 
              onValueChange={(value) => {
                setSelectedType(value);
                onTypeChange(value === 'all' ? null : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <FilterX className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

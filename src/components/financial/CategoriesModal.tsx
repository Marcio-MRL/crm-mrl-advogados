
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus, Edit, X } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { Category } from '@/types/financial';
import { toast } from 'sonner';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock categories - would come from database in production
const initialCategories: Category[] = [
  { id: '1', name: 'Honorários', type: 'entrada' },
  { id: '2', name: 'Despesas Fixas', type: 'saida' },
  { id: '3', name: 'Impostos', type: 'saida' },
  { id: '4', name: 'Pessoal', type: 'saida' },
  { id: '5', name: 'Suprimentos', type: 'saida' },
  { id: '6', name: 'Software', type: 'saida' },
  { id: '7', name: 'Marketing', type: 'saida' },
  { id: '8', name: 'Capacitação', type: 'ambos' },
];

export function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = (data: Omit<Category, 'id'>) => {
    // Generate a simple ID (in production would be handled by the database)
    const newCategory: Category = {
      ...data,
      id: Date.now().toString()
    };
    
    setCategories([...categories, newCategory]);
    setIsAdding(false);
    toast.success('Categoria adicionada com sucesso!');
  };

  const handleEditCategory = (data: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    
    const updated = categories.map(category => 
      category.id === editingCategory.id 
        ? { ...data, id: category.id }
        : category
    );
    
    setCategories(updated);
    setEditingCategory(null);
    toast.success('Categoria atualizada com sucesso!');
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    toast.success('Categoria removida com sucesso!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Categorias de Transações</DialogTitle>
        </DialogHeader>

        {!isAdding && !editingCategory ? (
          <>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-gray-500">
                      {category.type === 'entrada' ? 'Entrada' : 
                       category.type === 'saida' ? 'Saída' : 'Ambos'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-2 bg-lawblue-500 hover:bg-lawblue-600"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar Nova Categoria
            </Button>
          </>
        ) : isAdding ? (
          <CategoryForm 
            onSubmit={handleAddCategory} 
            onCancel={() => setIsAdding(false)} 
          />
        ) : editingCategory ? (
          <CategoryForm 
            onSubmit={handleEditCategory} 
            onCancel={() => setEditingCategory(null)}
            initialData={editingCategory}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

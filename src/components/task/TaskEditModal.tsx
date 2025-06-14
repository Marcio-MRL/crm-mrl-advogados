
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}

export function TaskEditModal({ task, isOpen, onClose, onSave }: TaskEditModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    due_date: string;
    priority: 'high' | 'medium' | 'low';
    category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
    description: string;
  }>({
    title: '',
    due_date: '',
    priority: 'medium',
    category: 'geral',
    description: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        priority: task.priority,
        category: task.category,
        description: task.description || ''
      });
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    
    if (!formData.title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    const updates: Partial<Task> = {
      title: formData.title,
      priority: formData.priority,
      category: formData.category,
      description: formData.description
    };

    if (formData.due_date) {
      updates.due_date = formData.due_date;
    }

    onSave(updates);
    toast.success("Tarefa atualizada com sucesso!");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Prazo</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'high' | 'medium' | 'low') => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral') => 
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="processo">Processo</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="audiencia">Audiência</SelectItem>
                <SelectItem value="prazo">Prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da tarefa (opcional)"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-lawblue-500 hover:bg-lawblue-600">
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Calendar, Clipboard, Edit, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChecklistCardProps {
  checklist: {
    id: string;
    title: string;
    description: string;
    dueDate?: string;
    progress: number;
    items: { id: string; text: string; checked: boolean }[];
    assignedTo?: string;
    client?: string;
    processId?: string;
  };
}

export function ChecklistCard({ checklist }: ChecklistCardProps) {
  const [expandedItems, setExpandedItems] = useState(false);
  const [items, setItems] = useState(checklist.items);
  const [progress, setProgress] = useState(checklist.progress);

  const toggleItem = (itemId: string) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Calculate new progress
    const totalItems = updatedItems.length;
    const checkedItems = updatedItems.filter(item => item.checked).length;
    const newProgress = Math.round((checkedItems / totalItems) * 100);
    setProgress(newProgress);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{checklist.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Clipboard className="mr-2 h-4 w-4" />
                <span>Duplicar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{checklist.description}</p>
        
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-2 mb-4">
          {items.slice(0, expandedItems ? items.length : 3).map(item => (
            <div key={item.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`item-${item.id}`} 
                checked={item.checked} 
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <label 
                htmlFor={`item-${item.id}`} 
                className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : ''}`}
              >
                {item.text}
              </label>
            </div>
          ))}
          
          {items.length > 3 && (
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-sm text-gray-500 hover:text-gray-800" 
              onClick={() => setExpandedItems(!expandedItems)}
            >
              {expandedItems ? 'Ver menos' : `Ver mais ${items.length - 3} itens`}
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {checklist.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{checklist.assignedTo}</span>
            </div>
          )}
          
          {checklist.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(checklist.dueDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          
          {checklist.client && (
            <div className="flex items-center gap-1">
              <span>Cliente: {checklist.client}</span>
            </div>
          )}
          
          {checklist.processId && (
            <div className="flex items-center gap-1">
              <span>Processo: {checklist.processId}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

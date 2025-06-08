
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Andamento {
  id: string;
  data: string;
  tipo: string;
  descricao: string;
  responsavel: string;
  prazo?: string;
}

interface ProcessoAndamentosProps {
  processoNumero: string;
  andamentos: Andamento[];
  onAddAndamento: (andamento: Omit<Andamento, 'id'>) => void;
}

export function ProcessoAndamentos({ processoNumero, andamentos, onAddAndamento }: ProcessoAndamentosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoAndamento, setNovoAndamento] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    responsavel: '',
    prazo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoAndamento.tipo || !novoAndamento.descricao) {
      toast.error('Tipo e descrição são obrigatórios');
      return;
    }

    onAddAndamento(novoAndamento);
    setNovoAndamento({
      data: new Date().toISOString().split('T')[0],
      tipo: '',
      descricao: '',
      responsavel: '',
      prazo: ''
    });
    setIsModalOpen(false);
    toast.success('Andamento adicionado com sucesso!');
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'despacho': return 'bg-blue-100 text-blue-800';
      case 'sentença': return 'bg-green-100 text-green-800';
      case 'intimação': return 'bg-yellow-100 text-yellow-800';
      case 'petição': return 'bg-purple-100 text-purple-800';
      case 'audiência': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Andamentos Processuais</CardTitle>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="bg-lawblue-500 hover:bg-lawblue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Andamento
        </Button>
      </CardHeader>
      
      <CardContent>
        {andamentos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum andamento registrado</p>
            <p className="text-sm">Clique em "Novo Andamento" para adicionar o primeiro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {andamentos.map((andamento) => (
              <div key={andamento.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTipoColor(andamento.tipo)}>
                      {andamento.tipo}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(andamento.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  {andamento.prazo && (
                    <div className="flex items-center text-sm text-orange-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Prazo: {new Date(andamento.prazo).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-800 mb-2">{andamento.descricao}</p>
                
                {andamento.responsavel && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    {andamento.responsavel}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal para Novo Andamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Andamento - {processoNumero}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data *</label>
                <Input
                  type="date"
                  value={novoAndamento.data}
                  onChange={(e) => setNovoAndamento({...novoAndamento, data: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lawblue-500"
                  value={novoAndamento.tipo}
                  onChange={(e) => setNovoAndamento({...novoAndamento, tipo: e.target.value})}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Despacho">Despacho</option>
                  <option value="Sentença">Sentença</option>
                  <option value="Intimação">Intimação</option>
                  <option value="Petição">Petição</option>
                  <option value="Audiência">Audiência</option>
                  <option value="Recurso">Recurso</option>
                  <option value="Decisão">Decisão</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descrição *</label>
              <Textarea
                placeholder="Descreva o andamento processual..."
                value={novoAndamento.descricao}
                onChange={(e) => setNovoAndamento({...novoAndamento, descricao: e.target.value})}
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Responsável</label>
                <Input
                  placeholder="Nome do responsável"
                  value={novoAndamento.responsavel}
                  onChange={(e) => setNovoAndamento({...novoAndamento, responsavel: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prazo</label>
                <Input
                  type="date"
                  value={novoAndamento.prazo}
                  onChange={(e) => setNovoAndamento({...novoAndamento, prazo: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-lawblue-500 hover:bg-lawblue-600"
              >
                Salvar Andamento
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

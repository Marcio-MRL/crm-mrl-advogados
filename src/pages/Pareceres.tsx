
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, FileText, Calendar, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormModal } from '@/components/common/FormModal';
import { PareceresForm } from '@/components/pareceres/PareceresForm';
import { PareceresViewModal } from '@/components/modals/PareceresViewModal';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LegalOpinion {
  id: string;
  title: string;
  client_name: string;
  type: string;
  content?: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export default function Pareceres() {
  const [pareceres, setPareceres] = useState<LegalOpinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedParecer, setSelectedParecer] = useState<LegalOpinion | null>(null);

  useEffect(() => {
    fetchPareceres();
  }, []);

  const fetchPareceres = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast.error('Você precisa estar logado para ver os pareceres');
        return;
      }

      const { data, error } = await supabase
        .from('legal_opinions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching legal opinions:', error);
        toast.error('Erro ao carregar pareceres');
        return;
      }

      setPareceres(data || []);
    } catch (error) {
      console.error('Error in fetchPareceres:', error);
      toast.error('Erro ao carregar pareceres');
    } finally {
      setLoading(false);
    }
  };

  const filteredPareceres = pareceres.filter(parecer =>
    parecer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parecer.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parecer.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parecer.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParecerAdded = () => {
    setIsCreateModalOpen(false);
    fetchPareceres();
  };

  const handleViewParecer = (parecer: LegalOpinion) => {
    setSelectedParecer(parecer);
    setIsViewModalOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'jurídico':
        return 'bg-blue-100 text-blue-800';
      case 'tributário':
        return 'bg-green-100 text-green-800';
      case 'trabalhista':
        return 'bg-yellow-100 text-yellow-800';
      case 'civil':
        return 'bg-purple-100 text-purple-800';
      case 'penal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    {
      title: "Total de Pareceres",
      value: pareceres.length.toString(),
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Este Mês",
      value: pareceres.filter(p => {
        const createdDate = new Date(p.created_at);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Tipos Únicos",
      value: new Set(pareceres.map(p => p.type)).size.toString(),
      icon: User,
      color: "text-purple-600"
    }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full space-y-6">
          <Header title="Pareceres" subtitle="Gestão de pareceres e opiniões jurídicas" />
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando pareceres...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <Header title="Pareceres" subtitle="Gestão de pareceres e opiniões jurídicas" />
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-lawblue-500 hover:bg-lawblue-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Parecer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar pareceres..."
            className="pl-8 w-full md:w-[400px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Pareceres Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pareceres</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPareceres.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'Nenhum parecer encontrado' : 'Nenhum parecer criado'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? 'Tente ajustar os termos de busca'
                    : 'Comece criando seu primeiro parecer jurídico'
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-lawblue-500 hover:bg-lawblue-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Parecer
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPareceres.map((parecer) => (
                    <TableRow key={parecer.id}>
                      <TableCell className="font-medium">
                        {parecer.title}
                      </TableCell>
                      <TableCell>{parecer.client_name}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(parecer.type)}>
                          {parecer.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{parecer.author}</TableCell>
                      <TableCell>
                        {new Date(parecer.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewParecer(parecer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <FormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Novo Parecer Jurídico"
        >
          <PareceresForm 
            onSuccess={handleParecerAdded}
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </FormModal>

        <PareceresViewModal
          parecer={selectedParecer}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}

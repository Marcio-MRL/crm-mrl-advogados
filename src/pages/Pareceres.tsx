
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Book, ExternalLink } from 'lucide-react';
import { PareceresViewModal } from '@/components/modals/PareceresViewModal';
import { toast } from 'sonner';

const mockPareceres = [
  { 
    id: '1', 
    titulo: 'Análise de contrato societário', 
    cliente: 'Empresa ABC Ltda.', 
    tipo: 'Societário', 
    dataCriacao: '2025-01-15', 
    autor: 'Dra. Ana Silva',
    conteudo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget justo vel nisi efficitur luctus. Suspendisse potenti. Donec ultricies, libero at laoreet accumsan...'
  },
  { 
    id: '2', 
    titulo: 'Viabilidade de ação contra fornecedor', 
    cliente: 'João da Silva', 
    tipo: 'Consultivo', 
    dataCriacao: '2025-02-03', 
    autor: 'Dr. Carlos Mendes',
    conteudo: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident...'
  },
  { 
    id: '3', 
    titulo: 'Riscos de contratação terceirizada', 
    cliente: 'Construtora XYZ S/A', 
    tipo: 'Trabalhista', 
    dataCriacao: '2024-11-28', 
    autor: 'Dra. Maria Oliveira',
    conteudo: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo...'
  },
  { 
    id: '4', 
    titulo: 'Análise de procedimento tributário', 
    cliente: 'Distribuidora Bons Negócios', 
    tipo: 'Tributário', 
    dataCriacao: '2025-02-17', 
    autor: 'Dr. Paulo Santos',
    conteudo: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt...'
  },
  { 
    id: '5', 
    titulo: 'Possibilidade de recurso em processo', 
    cliente: 'Ricardo Almeida', 
    tipo: 'Judicial', 
    dataCriacao: '2025-03-01', 
    autor: 'Dr. Fernando Costa',
    conteudo: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident...'
  },
];

export default function Pareceres() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPareceres, setFilteredPareceres] = useState(mockPareceres);
  const [currentParecer, setCurrentParecer] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = mockPareceres.filter(
      (parecer) =>
        parecer.titulo.toLowerCase().includes(query) ||
        parecer.cliente.toLowerCase().includes(query) ||
        parecer.tipo.toLowerCase().includes(query) ||
        parecer.autor.toLowerCase().includes(query)
    );
    
    setFilteredPareceres(filtered);
  };

  const handleViewParecer = (parecer: any) => {
    setCurrentParecer(parecer);
    setIsViewModalOpen(true);
  };

  const handleNovoParecer = () => {
    toast.info("Funcionalidade de novo parecer será implementada em breve!");
  };

  const handleCompartilhar = (parecer: any) => {
    toast.info(`Link do parecer "${parecer.titulo}" copiado para a área de transferência.`);
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Pareceres" subtitle="Gestão de pareceres e opiniões jurídicas" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar pareceres..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Button 
          className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
          onClick={handleNovoParecer}
        >
          <Plus className="h-4 w-4" /> Novo Parecer
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {filteredPareceres.map((parecer) => (
          <Card key={parecer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-lawblue-50 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{parecer.titulo}</CardTitle>
                  <p className="text-sm text-gray-500">{parecer.cliente}</p>
                </div>
                <span className="bg-lawblue-100 text-lawblue-800 text-xs px-2 py-1 rounded-full">
                  {parecer.tipo}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  <span>Por: {parecer.autor}</span>
                </div>
                <span>{new Date(parecer.dataCriacao).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewParecer(parecer)}
                >
                  Visualizar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleCompartilhar(parecer)}
                >
                  <ExternalLink className="h-4 w-4" /> Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PareceresViewModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        parecer={currentParecer}
      />
    </div>
  );
}


export interface Transaction {
  id: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: 'entrada' | 'saida';
  valor: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'entrada' | 'saida' | 'ambos';
  color?: string;
}

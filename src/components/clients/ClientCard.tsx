
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Card className="glass-card hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-lawblue-700 truncate">
            {client.name}
          </CardTitle>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            client.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {client.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{client.document}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Contato:</p>
            <p className="truncate">{client.phone}</p>
            <p className="truncate">{client.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Setor:</p>
            <p className="truncate">{client.sector}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-4">
            <span className="text-lawblue-600">{client.processCount} processos</span>
            <span className="text-lawblue-600">{client.contractCount} contratos</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="flex-1">Ver detalhes</Button>
            <Button size="sm" className="flex-1 bg-lawblue-500 hover:bg-lawblue-600">Novo Processo</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

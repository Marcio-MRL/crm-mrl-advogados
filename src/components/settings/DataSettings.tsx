
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Database, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function DataSettings() {
  const handleExportData = () => {
    toast.info("Exportação de dados iniciada. Você receberá um email quando estiver pronta.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gerenciamento de Dados
        </CardTitle>
        <CardDescription>
          Exporte, importe ou limpe seus dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Exportar Dados
              </Label>
              <p className="text-sm text-gray-500">Baixe todos os seus dados em formato JSON</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Exportar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Importar Dados</Label>
              <p className="text-sm text-gray-500">Importe dados de outro sistema</p>
            </div>
            <Button variant="outline">
              Importar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div className="space-y-0.5">
              <Label className="text-red-600">Limpar Todos os Dados</Label>
              <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
            </div>
            <Button variant="destructive">
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

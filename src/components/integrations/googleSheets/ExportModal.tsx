
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useGoogleSheetsExport, ExportDataType } from '@/hooks/useGoogleSheetsExport';
import { Download, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { exportData, isExporting, getDataTypeLabel } = useGoogleSheetsExport();
  const [sheetId, setSheetId] = useState('');
  const [dataType, setDataType] = useState<ExportDataType>('clients');
  const [range, setRange] = useState('Sheet1!A1:Z1000');
  const [clearExisting, setClearExisting] = useState(true);

  const handleExport = async () => {
    if (!sheetId.trim()) {
      return;
    }

    const success = await exportData({
      sheetId: extractSheetId(sheetId),
      dataType,
      range: range || 'Sheet1!A1:Z1000',
      clearExisting
    });

    if (success) {
      onOpenChange(false);
      setSheetId('');
      setRange('Sheet1!A1:Z1000');
    }
  };

  const extractSheetId = (url: string): string => {
    // Extrair ID da planilha do URL do Google Sheets
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const dataTypeOptions: { value: ExportDataType; label: string; description: string }[] = [
    { value: 'clients', label: 'Clientes', description: 'Exportar dados dos clientes' },
    { value: 'processes', label: 'Processos', description: 'Exportar dados dos processos jurídicos' },
    { value: 'financial', label: 'Financeiro', description: 'Exportar transações bancárias' },
    { value: 'calendar', label: 'Agenda', description: 'Exportar eventos da agenda' },
    { value: 'tasks', label: 'Tarefas', description: 'Exportar lista de tarefas' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exportar para Google Sheets
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dataType">Tipo de Dados</Label>
            <Select value={dataType} onValueChange={(value: ExportDataType) => setDataType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sheetId">URL da Planilha Google Sheets</Label>
            <Input
              id="sheetId"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Cole o URL completo da planilha ou apenas o ID
            </p>
          </div>
          
          <div>
            <Label htmlFor="range">Intervalo (opcional)</Label>
            <Input
              id="range"
              placeholder="Sheet1!A1:Z1000"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para usar o padrão
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="clearExisting"
              checked={clearExisting}
              onCheckedChange={setClearExisting}
            />
            <Label htmlFor="clearExisting" className="text-sm">
              Limpar dados existentes antes da exportação
            </Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExport}
              disabled={!sheetId.trim() || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar {getDataTypeLabel(dataType)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

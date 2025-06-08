
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadFormData {
  file: File | null;
  name: string;
  description: string;
  client: string;
  process: string;
  category: string;
}

export function DocumentUploadForm({ onSuccess, onCancel }: DocumentUploadFormProps) {
  const [formData, setFormData] = useState<UploadFormData>({
    file: null,
    name: '',
    description: '',
    client: '',
    process: '',
    category: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const clients = [
    { value: 'empresa-abc', label: 'Empresa ABC Ltda' },
    { value: 'joao-silva', label: 'João da Silva' },
    { value: 'maria-santos', label: 'Maria Santos' },
    { value: 'distribuidora', label: 'Distribuidora Bons Negócios' },
    { value: 'construtora', label: 'Construtora XYZ' }
  ];

  const processes = [
    { value: 'proc-001', label: 'PROC-001/2025 - Ação Tributária' },
    { value: 'proc-002', label: 'PROC-002/2025 - Reclamação Trabalhista' },
    { value: 'proc-003', label: 'PROC-003/2025 - Ação de Cobrança' },
    { value: 'proc-004', label: 'PROC-004/2025 - Dissolução de Sociedade' },
    { value: 'proc-005', label: 'PROC-005/2025 - Mandado de Segurança' }
  ];

  const categories = [
    { value: 'contrato', label: 'Contrato' },
    { value: 'peticao', label: 'Petição' },
    { value: 'procuracao', label: 'Procuração' },
    { value: 'parecer', label: 'Parecer Jurídico' },
    { value: 'comprovante', label: 'Comprovante' },
    { value: 'outros', label: 'Outros' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file,
        name: prev.name || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleInputChange = (field: keyof UploadFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast.error('Selecione um arquivo para upload');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Digite um nome para o documento');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Documento enviado com sucesso!');
      
      // Reset form
      setFormData({
        file: null,
        name: '',
        description: '',
        client: '',
        process: '',
        category: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="document">Selecione um documento *</Label>
          <Input
            id="document"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          />
          {formData.file && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium">{formData.file.name}</p>
                  <p className="text-gray-500">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="name">Nome do documento *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ex: Contrato de Prestação de Serviços"
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descrição opcional do documento"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">Cliente</Label>
            <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.value} value={client.value}>
                    {client.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="process">Processo relacionado</Label>
          <Select value={formData.process} onValueChange={(value) => handleInputChange('process', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um processo (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {processes.map(process => (
                <SelectItem key={process.value} value={process.value}>
                  {process.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={!formData.file || !formData.name.trim() || isUploading}
          className="bg-lawblue-500 hover:bg-lawblue-600"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              Enviando... <span className="animate-spin">⟳</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Enviar Documento
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

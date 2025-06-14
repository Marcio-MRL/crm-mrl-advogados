
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useGoogleDrive } from '@/hooks/useGoogleDrive';
import { useDocuments } from '@/hooks/useDocuments';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderSelector } from './FolderSelector';

interface GoogleDriveUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  preselectedClient?: string;
  preselectedProcess?: string;
}

export function GoogleDriveUploadForm({ 
  onSuccess, 
  onCancel,
  preselectedClient,
  preselectedProcess
}: GoogleDriveUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [clientId, setClientId] = useState(preselectedClient || '');
  const [processId, setProcessId] = useState(preselectedProcess || '');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  const { uploadFile, loading, isConnected } = useGoogleDrive();
  const { fetchDocuments } = useDocuments();

  const categories = [
    { value: 'contrato', label: 'Contrato' },
    { value: 'peticao', label: 'Petição' },
    { value: 'procuracao', label: 'Procuração' },
    { value: 'parecer', label: 'Parecer Jurídico' },
    { value: 'comprovante', label: 'Comprovante' },
    { value: 'sentenca', label: 'Sentença' },
    { value: 'recurso', label: 'Recurso' },
    { value: 'certidao', label: 'Certidão' },
    { value: 'outros', label: 'Outros' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !name.trim() || !category) {
      return;
    }

    const result = await uploadFile(file, {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      client_id: clientId || undefined,
      process_id: processId || undefined,
      parent_folder_id: selectedFolderId || undefined,
    });

    if (result) {
      // Reset form
      setFile(null);
      setName('');
      setDescription('');
      setCategory('');
      setClientId('');
      setProcessId('');
      setSelectedFolderId('');
      
      // Refresh documents list
      await fetchDocuments();
      
      onSuccess?.();
    }
  };

  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você precisa conectar ao Google Drive primeiro para fazer upload de documentos.
          Vá para Configurações → Integrações para conectar sua conta.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="document">Selecione um documento *</Label>
        <Input
          id="document"
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
          required
        />
        {file && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <p className="font-medium">{file.name}</p>
                <p className="text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <FolderSelector
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
        label="Pasta de destino"
        placeholder="Selecione onde salvar o arquivo"
      />

      <div>
        <Label htmlFor="name">Nome do documento *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Contrato de Prestação de Serviços"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria *</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição opcional do documento"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client">Cliente (opcional)</Label>
          <Input
            id="client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="ID do cliente"
          />
        </div>

        <div>
          <Label htmlFor="process">Processo (opcional)</Label>
          <Input
            id="process"
            value={processId}
            onChange={(e) => setProcessId(e.target.value)}
            placeholder="ID do processo"
          />
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
          disabled={!file || !name.trim() || !category || loading}
          className="bg-lawblue-500 hover:bg-lawblue-600"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Enviando... <span className="animate-spin">⟳</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Enviar para Google Drive
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      // Here you would typically handle the upload to Google Drive
      alert('Documento enviado com sucesso!');
    }, 2000);
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="document">Selecione um documento</Label>
        <Input
          id="document"
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      
      {selectedFile && (
        <div className="text-sm">
          <p>Arquivo selecionado: {selectedFile.name}</p>
          <p>Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
      
      <Button
        type="submit"
        disabled={!selectedFile || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            Enviando... <span className="animate-spin">⊃∊</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Enviar Documento
          </span>
        )}
      </Button>
    </form>
  );
}

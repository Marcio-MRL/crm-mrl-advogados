
export class GoogleDriveApiService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  // Método para criar ou encontrar a pasta de documentos do MRL
  async ensureDocumentsFolder(): Promise<string> {
    try {
      // Primeiro, verificar se já existe uma pasta chamada "MRL Documentos"
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='MRL Documentos' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        }
      );

      if (!searchResponse.ok) {
        throw new Error('Erro ao buscar pasta de documentos');
      }

      const searchData = await searchResponse.json();
      
      if (searchData.files && searchData.files.length > 0) {
        console.log('📁 Pasta MRL Documentos encontrada:', searchData.files[0].id);
        return searchData.files[0].id;
      }

      // Se não existe, criar a pasta
      const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'MRL Documentos',
          mimeType: 'application/vnd.google-apps.folder'
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Erro ao criar pasta de documentos');
      }

      const createData = await createResponse.json();
      console.log('📁 Pasta MRL Documentos criada:', createData.id);
      return createData.id;

    } catch (error) {
      console.error('❌ Erro ao gerenciar pasta de documentos:', error);
      // Se falhar, retornar null para usar a raiz do Drive
      return 'root';
    }
  }

  async uploadFile(file: File): Promise<any> {
    try {
      // Garantir que temos uma pasta válida
      const folderId = await this.ensureDocumentsFolder();
      
      const formData = new FormData();
      const driveMetadata = {
        name: file.name,
        parents: [folderId]
      };

      formData.append('metadata', new Blob([JSON.stringify(driveMetadata)], { type: 'application/json' }));
      formData.append('file', file);

      console.log('📤 Iniciando upload para pasta:', folderId);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro no upload:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Erro no upload para Google Drive: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Upload realizado com sucesso:', result);
      return result;

    } catch (error) {
      console.error('❌ Erro detalhado no upload:', error);
      throw error;
    }
  }

  async deleteFile(driveFileId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error);
      return false;
    }
  }

  async getFileDownloadLink(driveFileId: string): Promise<string | null> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}?fields=webContentLink`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao obter link de download');
      }

      const data = await response.json();
      return data.webContentLink;
    } catch (error) {
      console.error('❌ Erro ao obter link de download:', error);
      return null;
    }
  }

  // Método para listar pastas (para implementação futura do botão "Nova Pasta")
  async listFolders(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name,modifiedTime)`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao listar pastas');
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('❌ Erro ao listar pastas:', error);
      return [];
    }
  }

  // Método para criar nova pasta
  async createFolder(name: string, parentId?: string): Promise<any> {
    try {
      const metadata: any = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentId) {
        metadata.parents = [parentId];
      }

      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pasta');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao criar pasta:', error);
      throw error;
    }
  }
}


export class GoogleDriveApiService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    const driveMetadata = {
      name: file.name,
      parents: ['1BVG6lFz8rQyBmGKv_document_folder_id'] // Pasta específica do MRL
    };

    formData.append('metadata', new Blob([JSON.stringify(driveMetadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erro no upload para Google Drive');
    }

    return await response.json();
  }

  async deleteFile(driveFileId: string): Promise<boolean> {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    return response.ok;
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
      console.error('Erro ao obter link de download:', error);
      return null;
    }
  }
}


export class BankSheetFetcher {
  private static BANK_SHEET_NAME = 'BTG - Entradas e Saídas Caixa';

  static async fetchSheetData(token: string): Promise<any[]> {
    try {
      console.log('🔍 Buscando planilha bancária:', this.BANK_SHEET_NAME);
      
      // Primeiro, listar todas as planilhas para encontrar a do BTG
      const listResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name="${this.BANK_SHEET_NAME}" and mimeType="application/vnd.google-apps.spreadsheet"`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!listResponse.ok) {
        const errorText = await listResponse.text();
        console.error('❌ Erro ao buscar planilha:', listResponse.status, errorText);
        throw new Error(`Erro ao acessar Google Drive (${listResponse.status}): ${errorText}`);
      }

      const listData = await listResponse.json();
      console.log('📋 Planilhas encontradas:', listData.files?.length || 0);
      
      if (!listData.files || listData.files.length === 0) {
        throw new Error(`Planilha "${this.BANK_SHEET_NAME}" não encontrada no Google Drive`);
      }

      const spreadsheetId = listData.files[0].id;
      console.log('📊 Planilha bancária encontrada:', spreadsheetId);

      // Buscar dados da primeira aba
      const dataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?majorDimension=ROWS`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!dataResponse.ok) {
        const errorText = await dataResponse.text();
        console.error('❌ Erro ao ler dados da planilha:', dataResponse.status, errorText);
        throw new Error(`Erro ao ler planilha (${dataResponse.status}): ${errorText}`);
      }

      const data = await dataResponse.json();
      console.log('📈 Dados da planilha carregados:', data.values?.length || 0, 'linhas');
      
      return data.values || [];
      
    } catch (error) {
      console.error('❌ Erro no BankSheetFetcher:', error);
      throw error;
    }
  }
}


export class BankSheetFetcher {
  private static BANK_SHEET_NAME = 'BTG - Entradas e Saídas Caixa';

  static async fetchSheetData(token: string): Promise<any[]> {
    // Primeiro, listar todas as planilhas para encontrar a do BTG
    const listResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=name="BTG - Entradas e Saídas Caixa" and mimeType="application/vnd.google-apps.spreadsheet"',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!listResponse.ok) {
      throw new Error('Erro ao buscar planilha bancária');
    }

    const listData = await listResponse.json();
    
    if (!listData.files || listData.files.length === 0) {
      throw new Error('Planilha "BTG - Entradas e Saídas Caixa" não encontrada');
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
      throw new Error('Erro ao ler dados da planilha bancária');
    }

    const data = await dataResponse.json();
    return data.values || [];
  }
}

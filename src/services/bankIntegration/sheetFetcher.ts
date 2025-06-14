
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
      console.log('📋 Resultado da busca:', listData);
      console.log('📋 Planilhas encontradas:', listData.files?.length || 0);
      
      // Log todas as planilhas encontradas para debug
      if (listData.files && listData.files.length > 0) {
        console.log('📊 Planilhas no Drive:');
        listData.files.forEach((file: any, index: number) => {
          console.log(`${index + 1}. Nome: "${file.name}", ID: ${file.id}`);
        });
      }
      
      if (!listData.files || listData.files.length === 0) {
        // Vamos buscar todas as planilhas para ver o que existe
        console.log('🔍 Planilha específica não encontrada. Buscando todas as planilhas...');
        
        const allSheetsResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (allSheetsResponse.ok) {
          const allSheets = await allSheetsResponse.json();
          console.log('📄 Todas as planilhas disponíveis:');
          allSheets.files?.forEach((file: any, index: number) => {
            console.log(`${index + 1}. "${file.name}" (ID: ${file.id})`);
          });
        }
        
        throw new Error(`Planilha "${this.BANK_SHEET_NAME}" não encontrada no Google Drive. Verifique se o nome está exato e se você tem acesso à planilha.`);
      }

      const spreadsheetId = listData.files[0].id;
      console.log('📊 Planilha bancária encontrada:', spreadsheetId);

      // Primeiro, vamos ver quais abas existem na planilha
      const sheetInfoResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (sheetInfoResponse.ok) {
        const sheetInfo = await sheetInfoResponse.json();
        console.log('📋 Abas disponíveis na planilha:');
        sheetInfo.sheets?.forEach((sheet: any, index: number) => {
          console.log(`${index + 1}. "${sheet.properties.title}" (${sheet.properties.gridProperties.rowCount} linhas, ${sheet.properties.gridProperties.columnCount} colunas)`);
        });
      }

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
        
        // Tentar com nome de aba diferente se Sheet1 não funcionar
        const dataResponse2 = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z1000?majorDimension=ROWS`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!dataResponse2.ok) {
          throw new Error(`Erro ao ler planilha (${dataResponse.status}): ${errorText}`);
        }
        
        const data2 = await dataResponse2.json();
        console.log('📈 Dados da planilha carregados (método alternativo):', data2.values?.length || 0, 'linhas');
        return data2.values || [];
      }

      const data = await dataResponse.json();
      console.log('📈 Dados da planilha carregados:', data.values?.length || 0, 'linhas');
      
      if (!data.values || data.values.length === 0) {
        console.log('⚠️ Planilha encontrada mas não contém dados');
        throw new Error('Planilha encontrada mas está vazia. Adicione dados à planilha antes de sincronizar.');
      }
      
      // Log dos primeiros dados para debug
      if (data.values.length > 0) {
        console.log('📊 Primeira linha (cabeçalhos):', data.values[0]);
        if (data.values.length > 1) {
          console.log('📊 Segunda linha (exemplo de dados):', data.values[1]);
        }
      }
      
      return data.values || [];
      
    } catch (error) {
      console.error('❌ Erro no BankSheetFetcher:', error);
      throw error;
    }
  }
}

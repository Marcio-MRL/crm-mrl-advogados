
export class BankSheetFetcher {
  static async fetchSheetData(token: string, spreadsheetId?: string): Promise<any[]> {
    try {
      let targetSpreadsheetId = spreadsheetId;

      // Se não foi fornecido um ID específico, buscar pela planilha padrão
      if (!targetSpreadsheetId) {
        console.log('🔍 Buscando planilha bancária padrão: BTG - Entradas e Saídas Caixa');
        
        const listResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name="BTG - Entradas e Saídas Caixa" and mimeType="application/vnd.google-apps.spreadsheet"`,
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
        
        if (!listData.files || listData.files.length === 0) {
          throw new Error('Planilha "BTG - Entradas e Saídas Caixa" não encontrada. Selecione manualmente uma planilha.');
        }
        
        targetSpreadsheetId = listData.files[0].id;
      }

      console.log('📊 Usando planilha ID:', targetSpreadsheetId);

      // Buscar informações da planilha para obter o nome da primeira aba
      const sheetInfoResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!sheetInfoResponse.ok) {
        const errorText = await sheetInfoResponse.text();
        console.error('❌ Erro ao buscar informações da planilha:', sheetInfoResponse.status, errorText);
        throw new Error(`Erro ao acessar informações da planilha (${sheetInfoResponse.status}): ${errorText}`);
      }
      
      const sheetInfo = await sheetInfoResponse.json();
      
      if (!sheetInfo.sheets || sheetInfo.sheets.length === 0) {
        throw new Error('A planilha não contém nenhuma aba.');
      }
      
      const firstSheetName = sheetInfo.sheets[0].properties.title;
      console.log('📋 Planilha:', sheetInfo.properties?.title);
      console.log('👉 Usando a primeira aba:', `"${firstSheetName}"`);
      sheetInfo.sheets?.forEach((sheet: any, index: number) => {
        console.log(`${index + 1}. "${sheet.properties.title}" (${sheet.properties.gridProperties.rowCount} linhas, ${sheet.properties.gridProperties.columnCount} colunas)`);
      });

      const encodedSheetName = encodeURIComponent(firstSheetName);

      // Buscar dados da primeira aba usando seu nome
      const dataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/${encodedSheetName}?majorDimension=ROWS`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!dataResponse.ok) {
        const errorText = await dataResponse.text();
        console.error('❌ Erro ao ler dados da planilha (método principal):', dataResponse.status, errorText);
        
        // Tentar com método alternativo
        const range = `'${firstSheetName}'!A1:Z1000`;
        console.log('🛠️ Tentando método alternativo com range:', range);
        const dataResponse2 = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/${encodeURIComponent(range)}?majorDimension=ROWS`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        if (!dataResponse2.ok) {
          const errorText2 = await dataResponse2.text();
          console.error('❌ Erro ao ler dados da planilha (método alternativo):', dataResponse2.status, errorText2);
          throw new Error(`Erro ao ler planilha. O servidor respondeu com status ${dataResponse.status} e ${dataResponse2.status}.`);
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

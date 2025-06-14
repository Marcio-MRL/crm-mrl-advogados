
import { useState, useEffect } from 'react';

const SELECTED_SHEET_KEY = 'selected_bank_sheet_id';

export function useBankSheetSelection() {
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);

  useEffect(() => {
    // Carregar planilha selecionada do localStorage
    const saved = localStorage.getItem(SELECTED_SHEET_KEY);
    if (saved) {
      setSelectedSheetId(saved);
    }
  }, []);

  const selectSheet = (sheetId: string) => {
    setSelectedSheetId(sheetId);
    localStorage.setItem(SELECTED_SHEET_KEY, sheetId);
    console.log('📊 Planilha selecionada:', sheetId);
  };

  const clearSelection = () => {
    setSelectedSheetId(null);
    localStorage.removeItem(SELECTED_SHEET_KEY);
  };

  return {
    selectedSheetId,
    selectSheet,
    clearSelection
  };
}

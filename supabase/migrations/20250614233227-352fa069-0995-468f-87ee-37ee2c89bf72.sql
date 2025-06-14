
-- Criar tabela para armazenar transações bancárias importadas
CREATE TABLE bank_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  credito_debito TEXT CHECK (credito_debito IN ('Crédito', 'Débito')) NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT NOT NULL,
  mensagem TEXT,
  documento TEXT,
  pagador_recebedor TEXT,
  nome_pagador_recebedor TEXT,
  banco_pagador_recebedor TEXT,
  agencia_pagador_recebedor TEXT,
  conta_pagador_recebedor TEXT,
  identificador TEXT,
  raw_data JSONB,
  categoria TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_bank_transactions_data ON bank_transactions(data);
CREATE INDEX idx_bank_transactions_user_id ON bank_transactions(user_id);
CREATE INDEX idx_bank_transactions_credito_debito ON bank_transactions(credito_debito);
CREATE INDEX idx_bank_transactions_valor ON bank_transactions(valor);

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_bank_transactions_updated_at
  BEFORE UPDATE ON bank_transactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- RLS policies
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bank transactions" ON bank_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank transactions" ON bank_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank transactions" ON bank_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank transactions" ON bank_transactions
  FOR DELETE USING (auth.uid() = user_id);


-- Função para verificar se transação já existe
CREATE OR REPLACE FUNCTION check_existing_transaction(
  transaction_date DATE,
  transaction_value DECIMAL,
  transaction_description TEXT
)
RETURNS TABLE(id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT bt.id
  FROM bank_transactions bt
  WHERE bt.data = transaction_date
    AND bt.valor = transaction_value
    AND bt.descricao = transaction_description
    AND bt.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para inserir transação bancária
CREATE OR REPLACE FUNCTION insert_bank_transaction(
  transaction_data DATE,
  credito_debito TEXT,
  valor DECIMAL,
  descricao TEXT,
  mensagem TEXT DEFAULT NULL,
  documento TEXT DEFAULT NULL,
  pagador_recebedor TEXT DEFAULT NULL,
  nome_pagador_recebedor TEXT DEFAULT NULL,
  banco_pagador_recebedor TEXT DEFAULT NULL,
  agencia_pagador_recebedor TEXT DEFAULT NULL,
  conta_pagador_recebedor TEXT DEFAULT NULL,
  identificador TEXT DEFAULT NULL,
  raw_data JSONB DEFAULT NULL
)
RETURNS TABLE(id UUID) AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO bank_transactions (
    data, credito_debito, valor, descricao, mensagem, documento,
    pagador_recebedor, nome_pagador_recebedor, banco_pagador_recebedor,
    agencia_pagador_recebedor, conta_pagador_recebedor, identificador,
    raw_data, user_id
  )
  VALUES (
    transaction_data, credito_debito, valor, descricao, mensagem, documento,
    pagador_recebedor, nome_pagador_recebedor, banco_pagador_recebedor,
    agencia_pagador_recebedor, conta_pagador_recebedor, identificador,
    raw_data, auth.uid()
  )
  RETURNING bank_transactions.id INTO new_id;
  
  RETURN QUERY SELECT new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar última transação
CREATE OR REPLACE FUNCTION get_last_bank_transaction()
RETURNS TABLE(
  id UUID,
  data DATE,
  credito_debito TEXT,
  valor DECIMAL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT bt.id, bt.data, bt.credito_debito, bt.valor, bt.descricao, bt.created_at
  FROM bank_transactions bt
  WHERE bt.user_id = auth.uid()
  ORDER BY bt.data DESC, bt.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para contar transações
CREATE OR REPLACE FUNCTION get_bank_transactions_count()
RETURNS TABLE(count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*)::BIGINT
  FROM bank_transactions bt
  WHERE bt.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

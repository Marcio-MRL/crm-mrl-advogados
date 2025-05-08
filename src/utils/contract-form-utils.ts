
import { z } from 'zod';

// Contract form schema
export const contratoFormSchema = z.object({
  number: z.string().min(1, 'Número do contrato é obrigatório'),
  client_id: z.string().optional(),
  type: z.string().min(1, 'Tipo do contrato é obrigatório'),
  status: z.string().default('Ativo'),
  start_date: z.string(),
  end_date: z.string().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
});

export type ContratoFormValues = z.infer<typeof contratoFormSchema>;

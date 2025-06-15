
import { z } from 'zod';

export const reportFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  type: z.enum(['financeiro', 'processual', 'clientes', 'contratos', 'desempenho', 'personalizado']),
  format: z.enum(['pdf', 'xlsx', 'docx', 'csv']),
  dateRange: z.string().min(1, 'Selecione um período'),
  includeCharts: z.boolean().default(false),
  includeDetails: z.boolean().default(true),
  description: z.string().optional(),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;


import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.string().min(1, { message: "Status é obrigatório" }),
  notes: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

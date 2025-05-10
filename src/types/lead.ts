
export type LeadStage = 'new' | 'qualified' | 'meeting' | 'proposal' | 'hired';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  source: string;
  stage: LeadStage;
  lastContact: string;
  responsibleLawyer: string;
  daysSinceLastContact: number;
}

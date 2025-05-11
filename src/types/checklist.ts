
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  progress: number;
  items: ChecklistItem[];
  assignedTo?: string;
  client?: string;
  processId?: string;
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  itemCount: number;
  category: string;
  items?: { text: string; checked: boolean }[];
}

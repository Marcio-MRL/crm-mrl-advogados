export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          email: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          email: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          email?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          agencia_pagador_recebedor: string | null
          banco_pagador_recebedor: string | null
          categoria: string | null
          conta_pagador_recebedor: string | null
          created_at: string | null
          credito_debito: string
          data: string
          descricao: string
          documento: string | null
          id: string
          identificador: string | null
          mensagem: string | null
          nome_pagador_recebedor: string | null
          pagador_recebedor: string | null
          raw_data: Json | null
          updated_at: string | null
          user_id: string | null
          valor: number
        }
        Insert: {
          agencia_pagador_recebedor?: string | null
          banco_pagador_recebedor?: string | null
          categoria?: string | null
          conta_pagador_recebedor?: string | null
          created_at?: string | null
          credito_debito: string
          data: string
          descricao: string
          documento?: string | null
          id?: string
          identificador?: string | null
          mensagem?: string | null
          nome_pagador_recebedor?: string | null
          pagador_recebedor?: string | null
          raw_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valor: number
        }
        Update: {
          agencia_pagador_recebedor?: string | null
          banco_pagador_recebedor?: string | null
          categoria?: string | null
          conta_pagador_recebedor?: string | null
          created_at?: string | null
          credito_debito?: string
          data?: string
          descricao?: string
          documento?: string | null
          id?: string
          identificador?: string | null
          mensagem?: string | null
          nome_pagador_recebedor?: string | null
          pagador_recebedor?: string | null
          raw_data?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          client: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          participants: string[] | null
          start_time: string
          sync_with_google: boolean
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          client?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          participants?: string[] | null
          start_time: string
          sync_with_google?: boolean
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          client?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          participants?: string[] | null
          start_time?: string
          sync_with_google?: boolean
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      checklist_items: {
        Row: {
          checked: boolean | null
          checklist_id: string | null
          created_at: string
          id: string
          text: string
          updated_at: string
        }
        Insert: {
          checked?: boolean | null
          checklist_id?: string | null
          created_at?: string
          id?: string
          text: string
          updated_at?: string
        }
        Update: {
          checked?: boolean | null
          checklist_id?: string | null
          created_at?: string
          id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          process_id: string | null
          progress: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          process_id?: string | null
          progress?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          process_id?: string | null
          progress?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklists_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cpf_cnpj: string | null
          created_at: string
          id: string
          nome_razao_social: string | null
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string
          id?: string
          nome_razao_social?: string | null
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string
          id?: string
          nome_razao_social?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          number: string
          start_date: string
          status: string
          type: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          number: string
          start_date?: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          number?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          client_id: string | null
          created_at: string | null
          description: string | null
          drive_file_id: string
          file_size: number
          id: string
          mime_type: string
          name: string
          process_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          drive_file_id: string
          file_size?: number
          id?: string
          mime_type: string
          name: string
          process_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          drive_file_id?: string
          file_size?: number
          id?: string
          mime_type?: string
          name?: string
          process_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_end_time: string | null
          event_start_time: string
          id: string
          processo_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_end_time?: string | null
          event_start_time: string
          id?: string
          processo_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_end_time?: string | null
          event_start_time?: string
          id?: string
          processo_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      google_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_active: boolean
          refresh_token: string | null
          scope: string | null
          service_type: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          refresh_token?: string | null
          scope?: string | null
          service_type: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          refresh_token?: string | null
          scope?: string | null
          service_type?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_oauth_configs: {
        Row: {
          client_id: string
          client_secret: string | null
          created_at: string
          id: string
          is_active: boolean
          redirect_uri: string
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          client_secret?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          redirect_uri: string
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          client_secret?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          redirect_uri?: string
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_oauth_tokens: {
        Row: {
          access_token: string | null
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          scope: string | null
          token_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string | null
          token_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          auth_token: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_synced: string | null
          refresh_token: string | null
          service_name: string
          settings: Json | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth_token?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_synced?: string | null
          refresh_token?: string | null
          service_name: string
          settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth_token?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_synced?: string | null
          refresh_token?: string | null
          service_name?: string
          settings?: Json | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lead_updates: {
        Row: {
          created_at: string
          data_update: string
          lead_id: number
          texto_update: string
          update_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_update?: string
          lead_id: number
          texto_update: string
          update_id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_update?: string
          lead_id?: number
          texto_update?: string
          update_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lead_updates_lead_id"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          data_criacao: string
          data_ultima_interacao: string | null
          email: string | null
          lead_id: number
          nome_lead: string
          observacoes: string | null
          origem_lead: string | null
          status_lead: string
          telefone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_criacao?: string
          data_ultima_interacao?: string | null
          email?: string | null
          lead_id?: number
          nome_lead: string
          observacoes?: string | null
          origem_lead?: string | null
          status_lead?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_criacao?: string
          data_ultima_interacao?: string | null
          email?: string | null
          lead_id?: number
          nome_lead?: string
          observacoes?: string | null
          origem_lead?: string | null
          status_lead?: string
          telefone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      legal_opinions: {
        Row: {
          author: string
          client_id: string | null
          client_name: string
          content: string | null
          created_at: string
          id: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author: string
          client_id?: string | null
          client_name: string
          content?: string | null
          created_at?: string
          id?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string
          client_id?: string | null
          client_name?: string
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legal_opinions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      process_movements: {
        Row: {
          created_at: string | null
          date: string
          deadline: string | null
          description: string
          id: string
          process_id: string
          responsible: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          deadline?: string | null
          description: string
          id?: string
          process_id: string
          responsible?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          deadline?: string | null
          description?: string
          id?: string
          process_id?: string
          responsible?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_movements_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          client_id: string | null
          client_name: string | null
          created_at: string
          description: string | null
          forum: string | null
          id: string
          process_number: string | null
          process_type: string
          responsible: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          forum?: string | null
          id?: string
          process_number?: string | null
          process_type: string
          responsible?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string | null
          created_at?: string
          description?: string | null
          forum?: string | null
          id?: string
          process_number?: string | null
          process_type?: string
          responsible?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      processos: {
        Row: {
          cliente_id: string | null
          created_at: string
          id: string
          numero_processo: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          numero_processo?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          numero_processo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          date_range: string
          description: string | null
          format: Database["public"]["Enums"]["report_format"]
          id: string
          include_charts: boolean
          include_details: boolean
          name: string
          status: Database["public"]["Enums"]["report_status"]
          type: Database["public"]["Enums"]["report_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date_range: string
          description?: string | null
          format: Database["public"]["Enums"]["report_format"]
          id?: string
          include_charts?: boolean
          include_details?: boolean
          name: string
          status?: Database["public"]["Enums"]["report_status"]
          type: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date_range?: string
          description?: string | null
          format?: Database["public"]["Enums"]["report_format"]
          id?: string
          include_charts?: boolean
          include_details?: boolean
          name?: string
          status?: Database["public"]["Enums"]["report_status"]
          type?: Database["public"]["Enums"]["report_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      event_type: "audiencia" | "reuniao" | "prazo" | "outro"
      report_format: "pdf" | "xlsx" | "docx" | "csv"
      report_status: "gerando" | "concluido" | "falhou"
      report_type:
        | "financeiro"
        | "processual"
        | "clientes"
        | "contratos"
        | "desempenho"
        | "personalizado"
      user_role: "admin" | "editor" | "leitor"
      user_status: "pending_approval" | "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: ["audiencia", "reuniao", "prazo", "outro"],
      report_format: ["pdf", "xlsx", "docx", "csv"],
      report_status: ["gerando", "concluido", "falhou"],
      report_type: [
        "financeiro",
        "processual",
        "clientes",
        "contratos",
        "desempenho",
        "personalizado",
      ],
      user_role: ["admin", "editor", "leitor"],
      user_status: ["pending_approval", "active", "inactive"],
    },
  },
} as const

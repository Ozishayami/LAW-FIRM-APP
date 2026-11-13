export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changed_fields: string[]
          firm_id: string
          id: number
          occurred_at: string
          record_id: string | null
          request_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_fields?: string[]
          firm_id: string
          id?: never
          occurred_at?: string
          record_id?: string | null
          request_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_fields?: string[]
          firm_id?: string
          id?: never
          occurred_at?: string
          record_id?: string | null
          request_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean
          assigned_to: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          event_type: string
          external_calendar_id: string | null
          firm_id: string
          id: string
          location: string | null
          matter_id: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          external_calendar_id?: string | null
          firm_id: string
          id?: string
          location?: string | null
          matter_id?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          external_calendar_id?: string | null
          firm_id?: string
          id?: string
          location?: string | null
          matter_id?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "calendar_events_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      checklist_template_items: {
        Row: {
          created_at: string
          default_due_days: number | null
          description: string | null
          firm_id: string
          id: string
          sort_order: number
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          default_due_days?: number | null
          description?: string | null
          firm_id: string
          id?: string
          sort_order?: number
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          default_due_days?: number | null
          description?: string | null
          firm_id?: string
          id?: string
          sort_order?: number
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_template_items_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_template_items_firm_id_template_id_fkey"
            columns: ["firm_id", "template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          firm_id: string
          id: string
          is_active: boolean
          name: string
          practice_area: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          firm_id: string
          id?: string
          is_active?: boolean
          name: string
          practice_area?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          firm_id?: string
          id?: string
          is_active?: boolean
          name?: string
          practice_area?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string
          email: string | null
          firm_id: string
          full_name: string
          id: string
          is_primary: boolean
          notes: string | null
          phone: string | null
          role_title: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          email?: string | null
          firm_id: string
          full_name: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          phone?: string | null
          role_title?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          email?: string | null
          firm_id?: string
          full_name?: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          phone?: string | null
          role_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "client_contacts_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          alternate_phone: string | null
          city: string | null
          client_ref: string
          client_type: string
          conflict_check_status: string
          conflict_checked_at: string | null
          conflict_checked_by: string | null
          country_code: string
          created_at: string
          created_by: string | null
          display_name: string
          email: string | null
          firm_id: string
          id: string
          industry: string | null
          legal_name: string | null
          notes: string | null
          phone: string | null
          relationship_partner: string | null
          state_region: string | null
          status: string
          tax_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          alternate_phone?: string | null
          city?: string | null
          client_ref: string
          client_type: string
          conflict_check_status?: string
          conflict_checked_at?: string | null
          conflict_checked_by?: string | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          display_name: string
          email?: string | null
          firm_id: string
          id?: string
          industry?: string | null
          legal_name?: string | null
          notes?: string | null
          phone?: string | null
          relationship_partner?: string | null
          state_region?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          alternate_phone?: string | null
          city?: string | null
          client_ref?: string
          client_type?: string
          conflict_check_status?: string
          conflict_checked_at?: string | null
          conflict_checked_by?: string | null
          country_code?: string
          created_at?: string
          created_by?: string | null
          display_name?: string
          email?: string | null
          firm_id?: string
          id?: string
          industry?: string | null
          legal_name?: string | null
          notes?: string | null
          phone?: string | null
          relationship_partner?: string | null
          state_region?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_conflict_checked_by_fkey"
            columns: ["conflict_checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_relationship_partner_fkey"
            columns: ["relationship_partner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          body_text: string | null
          client_id: string | null
          created_at: string
          direction: string
          firm_id: string
          from_address: string | null
          id: string
          logged_by: string | null
          matter_id: string | null
          provider: string
          provider_message_id: string | null
          sent_at: string | null
          snippet: string | null
          subject: string | null
          thread_id: string | null
          to_addresses: string[]
        }
        Insert: {
          body_text?: string | null
          client_id?: string | null
          created_at?: string
          direction: string
          firm_id: string
          from_address?: string | null
          id?: string
          logged_by?: string | null
          matter_id?: string | null
          provider?: string
          provider_message_id?: string | null
          sent_at?: string | null
          snippet?: string | null
          subject?: string | null
          thread_id?: string | null
          to_addresses?: string[]
        }
        Update: {
          body_text?: string | null
          client_id?: string | null
          created_at?: string
          direction?: string
          firm_id?: string
          from_address?: string | null
          id?: string
          logged_by?: string | null
          matter_id?: string | null
          provider?: string
          provider_message_id?: string | null
          sent_at?: string | null
          snippet?: string | null
          subject?: string | null
          thread_id?: string | null
          to_addresses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "communications_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "communications_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      disbursements: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          firm_id: string
          id: string
          incurred_on: string
          matter_id: string
          paid_by: string | null
          recovered_from_client: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          firm_id: string
          id?: string
          incurred_on?: string
          matter_id: string
          paid_by?: string | null
          recovered_from_client?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          firm_id?: string
          id?: string
          incurred_on?: string
          matter_id?: string
          paid_by?: string | null
          recovered_from_client?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disbursements_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disbursements_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "disbursements_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          client_id: string | null
          confidentiality: string
          created_at: string
          file_name: string
          file_size_bytes: number | null
          firm_id: string
          id: string
          matter_id: string | null
          mime_type: string | null
          storage_path: string
          uploaded_by: string | null
          version_number: number
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          confidentiality?: string
          created_at?: string
          file_name: string
          file_size_bytes?: number | null
          firm_id: string
          id?: string
          matter_id?: string | null
          mime_type?: string | null
          storage_path: string
          uploaded_by?: string | null
          version_number?: number
        }
        Update: {
          category?: string | null
          client_id?: string | null
          confidentiality?: string
          created_at?: string
          file_name?: string
          file_size_bytes?: number | null
          firm_id?: string
          id?: string
          matter_id?: string | null
          mime_type?: string | null
          storage_path?: string
          uploaded_by?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "documents_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          billable_to_client: boolean
          category: string | null
          created_at: string
          currency: string
          description: string
          expense_ref: string
          firm_id: string
          id: string
          incurred_on: string
          matter_id: string | null
          paid_to: string | null
          receipt_document_id: string | null
          recorded_by: string | null
          reimbursed: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          billable_to_client?: boolean
          category?: string | null
          created_at?: string
          currency?: string
          description: string
          expense_ref: string
          firm_id: string
          id?: string
          incurred_on?: string
          matter_id?: string | null
          paid_to?: string | null
          receipt_document_id?: string | null
          recorded_by?: string | null
          reimbursed?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          billable_to_client?: boolean
          category?: string | null
          created_at?: string
          currency?: string
          description?: string
          expense_ref?: string
          firm_id?: string
          id?: string
          incurred_on?: string
          matter_id?: string | null
          paid_to?: string | null
          receipt_document_id?: string | null
          recorded_by?: string | null
          reimbursed?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "expenses_firm_id_receipt_document_id_fkey"
            columns: ["firm_id", "receipt_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      firm_memberships: {
        Row: {
          created_at: string
          firm_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          firm_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          firm_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "firm_memberships_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firm_number_sequences: {
        Row: {
          firm_id: string
          id: string
          next_value: number
          padding: number
          prefix: string
          sequence_key: string
          updated_at: string
        }
        Insert: {
          firm_id: string
          id?: string
          next_value?: number
          padding?: number
          prefix: string
          sequence_key: string
          updated_at?: string
        }
        Update: {
          firm_id?: string
          id?: string
          next_value?: number
          padding?: number
          prefix?: string
          sequence_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "firm_number_sequences_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      firms: {
        Row: {
          address: string | null
          country_code: string
          created_at: string
          default_currency: string
          email: string | null
          id: string
          legal_name: string | null
          name: string
          owner_user_id: string
          phone: string | null
          settings: Json
          slug: string
          timezone: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          country_code?: string
          created_at?: string
          default_currency?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name: string
          owner_user_id: string
          phone?: string | null
          settings?: Json
          slug: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          country_code?: string
          created_at?: string
          default_currency?: string
          email?: string | null
          id?: string
          legal_name?: string | null
          name?: string
          owner_user_id?: string
          phone?: string | null
          settings?: Json
          slug?: string
          timezone?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          firm_id: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          tax_rate: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          firm_id: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          firm_id?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          tax_rate?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_firm_id_invoice_id_fkey"
            columns: ["firm_id", "invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          client_id: string
          created_at: string
          created_by: string | null
          currency: string
          discount_amount: number
          due_date: string | null
          firm_id: string
          id: string
          invoice_number: string
          issue_date: string
          issued_at: string | null
          matter_id: string | null
          notes: string | null
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          total_amount: number
          updated_at: string
          updated_by: string | null
          void_reason: string | null
          voided_at: string | null
        }
        Insert: {
          amount_paid?: number
          client_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          discount_amount?: number
          due_date?: string | null
          firm_id: string
          id?: string
          invoice_number: string
          issue_date?: string
          issued_at?: string | null
          matter_id?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
          void_reason?: string | null
          voided_at?: string | null
        }
        Update: {
          amount_paid?: number
          client_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          discount_amount?: number
          due_date?: string | null
          firm_id?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          issued_at?: string | null
          matter_id?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string
          updated_by?: string | null
          void_reason?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "invoices_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      matter_parties: {
        Row: {
          contact_details: Json
          created_at: string
          firm_id: string
          id: string
          matter_id: string
          notes: string | null
          party_name: string
          party_type: string
          represented_by: string | null
          updated_at: string
        }
        Insert: {
          contact_details?: Json
          created_at?: string
          firm_id: string
          id?: string
          matter_id: string
          notes?: string | null
          party_name: string
          party_type?: string
          represented_by?: string | null
          updated_at?: string
        }
        Update: {
          contact_details?: Json
          created_at?: string
          firm_id?: string
          id?: string
          matter_id?: string
          notes?: string | null
          party_name?: string
          party_type?: string
          represented_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matter_parties_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matter_parties_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      matter_team_members: {
        Row: {
          assignment_role: string
          created_at: string
          firm_id: string
          id: string
          matter_id: string
          user_id: string
        }
        Insert: {
          assignment_role?: string
          created_at?: string
          firm_id: string
          id?: string
          matter_id: string
          user_id: string
        }
        Update: {
          assignment_role?: string
          created_at?: string
          firm_id?: string
          id?: string
          matter_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matter_team_members_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matter_team_members_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "matter_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matters: {
        Row: {
          agreed_fee: number | null
          billing_type: string
          client_id: string
          closed_on: string | null
          confidentiality: string
          court_or_tribunal: string | null
          court_reference: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          firm_id: string
          id: string
          limitation_date: string | null
          matter_ref: string
          matter_type: string | null
          opened_on: string
          originating_lawyer: string | null
          practice_area: string | null
          priority: string
          responsible_lawyer: string | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          agreed_fee?: number | null
          billing_type?: string
          client_id: string
          closed_on?: string | null
          confidentiality?: string
          court_or_tribunal?: string | null
          court_reference?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          firm_id: string
          id?: string
          limitation_date?: string | null
          matter_ref: string
          matter_type?: string | null
          opened_on?: string
          originating_lawyer?: string | null
          practice_area?: string | null
          priority?: string
          responsible_lawyer?: string | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          agreed_fee?: number | null
          billing_type?: string
          client_id?: string
          closed_on?: string | null
          confidentiality?: string
          court_or_tribunal?: string | null
          court_reference?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          firm_id?: string
          id?: string
          limitation_date?: string | null
          matter_ref?: string
          matter_type?: string | null
          opened_on?: string
          originating_lawyer?: string | null
          practice_area?: string | null
          priority?: string
          responsible_lawyer?: string | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matters_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "matters_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matters_originating_lawyer_fkey"
            columns: ["originating_lawyer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matters_responsible_lawyer_fkey"
            columns: ["responsible_lawyer"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_allocations: {
        Row: {
          amount: number
          created_at: string
          firm_id: string
          id: string
          invoice_id: string
          payment_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          firm_id: string
          id?: string
          invoice_id: string
          payment_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          firm_id?: string
          id?: string
          invoice_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_firm_id_invoice_id_fkey"
            columns: ["firm_id", "invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "payment_allocations_firm_id_payment_id_fkey"
            columns: ["firm_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      payment_reversals: {
        Row: {
          amount: number
          firm_id: string
          id: string
          payment_id: string
          reason: string
          reversed_at: string
          reversed_by: string | null
        }
        Insert: {
          amount: number
          firm_id: string
          id?: string
          payment_id: string
          reason: string
          reversed_at?: string
          reversed_by?: string | null
        }
        Update: {
          amount?: number
          firm_id?: string
          id?: string
          payment_id?: string
          reason?: string
          reversed_at?: string
          reversed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reversals_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reversals_firm_id_payment_id_fkey"
            columns: ["firm_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          external_reference: string | null
          firm_id: string
          id: string
          notes: string | null
          payment_method: string
          payment_reference: string
          received_at: string
          recorded_by: string | null
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          external_reference?: string | null
          firm_id: string
          id?: string
          notes?: string | null
          payment_method: string
          payment_reference: string
          received_at?: string
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          external_reference?: string | null
          firm_id?: string
          id?: string
          notes?: string | null
          payment_method?: string
          payment_reference?: string
          received_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "payments_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          calendar_event_id: string | null
          channel: string
          created_at: string
          firm_id: string
          id: string
          recipient_id: string
          remind_at: string
          sent_at: string | null
          status: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          calendar_event_id?: string | null
          channel?: string
          created_at?: string
          firm_id: string
          id?: string
          recipient_id: string
          remind_at: string
          sent_at?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          calendar_event_id?: string | null
          channel?: string
          created_at?: string
          firm_id?: string
          id?: string
          recipient_id?: string
          remind_at?: string
          sent_at?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_firm_id_calendar_event_id_fkey"
            columns: ["firm_id", "calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "reminders_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_firm_id_task_id_fkey"
            columns: ["firm_id", "task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "reminders_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          estimated_minutes: number | null
          firm_id: string
          id: string
          matter_id: string | null
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          estimated_minutes?: number | null
          firm_id: string
          id?: string
          matter_id?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          estimated_minutes?: number | null
          firm_id?: string
          id?: string
          matter_id?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "tasks_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
      time_entries: {
        Row: {
          billable: boolean
          billed_invoice_id: string | null
          created_at: string
          currency: string
          description: string
          duration_minutes: number
          ended_at: string | null
          firm_id: string
          hourly_rate: number | null
          id: string
          matter_id: string
          started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billable?: boolean
          billed_invoice_id?: string | null
          created_at?: string
          currency?: string
          description: string
          duration_minutes: number
          ended_at?: string | null
          firm_id: string
          hourly_rate?: number | null
          id?: string
          matter_id: string
          started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billable?: boolean
          billed_invoice_id?: string | null
          created_at?: string
          currency?: string
          description?: string
          duration_minutes?: number
          ended_at?: string | null
          firm_id?: string
          hourly_rate?: number | null
          id?: string
          matter_id?: string
          started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_firm_id_billed_invoice_id_fkey"
            columns: ["firm_id", "billed_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "time_entries_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_firm_id_matter_id_fkey"
            columns: ["firm_id", "matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_accounts: {
        Row: {
          account_name: string
          account_reference_last4: string | null
          bank_name: string | null
          client_id: string
          created_at: string
          currency: string
          firm_id: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          account_name: string
          account_reference_last4?: string | null
          bank_name?: string | null
          client_id: string
          created_at?: string
          currency?: string
          firm_id: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_reference_last4?: string | null
          bank_name?: string | null
          client_id?: string
          created_at?: string
          currency?: string
          firm_id?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_accounts_firm_id_client_id_fkey"
            columns: ["firm_id", "client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "trust_accounts_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          firm_id: string
          id: string
          occurred_at: string
          recorded_by: string | null
          reference: string | null
          reversal_of_id: string | null
          transaction_type: string
          trust_account_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description: string
          firm_id: string
          id?: string
          occurred_at?: string
          recorded_by?: string | null
          reference?: string | null
          reversal_of_id?: string | null
          transaction_type: string
          trust_account_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          firm_id?: string
          id?: string
          occurred_at?: string
          recorded_by?: string | null
          reference?: string | null
          reversal_of_id?: string | null
          transaction_type?: string
          trust_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_transactions_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "firms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trust_transactions_firm_id_reversal_of_id_fkey"
            columns: ["firm_id", "reversal_of_id"]
            isOneToOne: false
            referencedRelation: "trust_transactions"
            referencedColumns: ["firm_id", "id"]
          },
          {
            foreignKeyName: "trust_transactions_firm_id_trust_account_id_fkey"
            columns: ["firm_id", "trust_account_id"]
            isOneToOne: false
            referencedRelation: "trust_accounts"
            referencedColumns: ["firm_id", "id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_firm_workspace: {
        Args: {
          p_email?: string
          p_legal_name?: string
          p_name: string
          p_slug: string
        }
        Returns: string
      }
      next_firm_reference: {
        Args: { p_firm_id: string; p_sequence_key: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

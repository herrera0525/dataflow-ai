import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          plan: 'free' | 'pro' | 'enterprise';
          max_automations: number;
          max_employees: number;
          settings: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan?: 'free' | 'pro' | 'enterprise';
          max_automations?: number;
          max_employees?: number;
          settings?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          full_name: string;
          role: 'admin' | 'supervisor' | 'worker';
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          full_name?: string;
          role?: 'admin' | 'supervisor' | 'worker';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          uploaded_by: string | null;
          filename: string;
          file_type: 'pdf' | 'image' | 'excel' | 'csv' | 'other';
          file_size: number;
          file_url: string;
          status: 'pending' | 'processing' | 'completed' | 'error';
          extracted_data: Record<string, unknown>;
          ai_summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          uploaded_by?: string | null;
          filename: string;
          file_type?: 'pdf' | 'image' | 'excel' | 'csv' | 'other';
          file_size?: number;
          file_url?: string;
          status?: 'pending' | 'processing' | 'completed' | 'error';
          extracted_data?: Record<string, unknown>;
          ai_summary?: string;
          created_at?: string;
        };
      };
      automations: {
        Row: {
          id: string;
          company_id: string;
          created_by: string | null;
          type: 'ocr_extract' | 'form_fill' | 'invoice_process' | 'email_organize' | 'document_classify' | 'data_convert' | 'report_generate';
          name: string;
          description: string;
          status: 'pending' | 'running' | 'completed' | 'failed';
          input_data: Record<string, unknown>;
          output_data: Record<string, unknown>;
          documents_processed: number;
          time_saved_seconds: number;
          error_message: string;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by?: string | null;
          type: 'ocr_extract' | 'form_fill' | 'invoice_process' | 'email_organize' | 'document_classify' | 'data_convert' | 'report_generate';
          name: string;
          description?: string;
          status?: 'pending' | 'running' | 'completed' | 'failed';
          input_data?: Record<string, unknown>;
          output_data?: Record<string, unknown>;
          documents_processed?: number;
          time_saved_seconds?: number;
          error_message?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          company_id: string;
          user_id: string | null;
          type: string;
          description: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id?: string | null;
          type: string;
          description: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
  };
};
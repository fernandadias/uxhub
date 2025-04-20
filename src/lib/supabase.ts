import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o Supabase
export type Database = {
  public: {
    Tables: {
      heuristic_analysis: {
        Row: {
          id: string;
          user_id: string;
          context: {
            productType: string;
            device: string;
            interactionType: string;
            flowType: string;
          };
          violations: any[];
          status: 'processing' | 'completed' | 'failed';
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          context: {
            productType: string;
            device: string;
            interactionType: string;
            flowType: string;
          };
          violations?: any[];
          status?: 'processing' | 'completed' | 'failed';
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          context?: {
            productType: string;
            device: string;
            interactionType: string;
            flowType: string;
          };
          violations?: any[];
          status?: 'processing' | 'completed' | 'failed';
          created_at?: string;
          completed_at?: string | null;
        };
      };
      screenshots: {
        Row: {
          id: string;
          analysis_id: string;
          url: string;
          screenshot_order: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          url: string;
          screenshot_order: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          url?: string;
          screenshot_order?: number;
          description?: string | null;
          created_at?: string;
        };
      };
    };
  };
}; 
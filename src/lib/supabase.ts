import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas:', {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

console.log('Configuração do Supabase:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Teste de conexão
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Erro ao testar conexão com Supabase:', error);
  } else {
    console.log('Conexão com Supabase estabelecida:', {
      hasSession: !!session,
      user: session?.user?.id,
    });
  }
});

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
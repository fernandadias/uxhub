'use client';

import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SupabaseContextType {
  supabase: typeof supabase;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
});

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
} 
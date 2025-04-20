import { supabase } from './supabase'
import { Database } from '../types/supabase'

type Heuristic = Database['public']['Tables']['heuristics']['Row']
type HeuristicInsert = Database['public']['Tables']['heuristics']['Insert']
type HeuristicUpdate = Database['public']['Tables']['heuristics']['Update']

export const heuristics = {
  async create(heuristic: HeuristicInsert): Promise<Heuristic> {
    const { data, error } = await supabase
      .from('heuristics')
      .insert(heuristic)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, heuristic: HeuristicUpdate): Promise<Heuristic> {
    const { data, error } = await supabase
      .from('heuristics')
      .update(heuristic)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('heuristics')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getById(id: string): Promise<Heuristic> {
    const { data, error } = await supabase
      .from('heuristics')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getAll(): Promise<Heuristic[]> {
    const { data, error } = await supabase
      .from('heuristics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByUserId(userId: string): Promise<Heuristic[]> {
    const { data, error } = await supabase
      .from('heuristics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async search(query: string): Promise<Heuristic[]> {
    const { data, error } = await supabase
      .from('heuristics')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
} 
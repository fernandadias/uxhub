import { NextApiRequest, NextApiResponse } from 'next';
import { createAnalysis } from '@/lib/services/heuristic-analysis';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar autenticação
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar se o usuário da requisição é o mesmo do token
    if (user.id !== req.body.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Criar análise
    const analysis = await createAnalysis(req.body);

    return res.status(200).json({ data: analysis });
  } catch (error) {
    console.error('Erro na análise:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar análise',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
} 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analyzeHeuristics } from '@/services/heuristicAnalysis';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { context, screenshots } = await request.json();

    // Validar os dados recebidos
    if (!context || !screenshots || !Array.isArray(screenshots)) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Realizar a análise heurística
    const violations = await analyzeHeuristics(context, screenshots);

    // Salvar os resultados no Supabase
    const { data, error } = await supabase
      .from('analysis')
      .insert({
        user_id: context.userId,
        product_type: context.productType,
        device: context.device,
        interaction_type: context.interactionType,
        flow_type: context.flowType,
        violations: violations,
        screenshots: screenshots.map(s => s.url),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar análise:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar análise' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro na análise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
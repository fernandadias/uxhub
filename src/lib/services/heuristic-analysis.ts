import { supabase } from '../supabase';
import { analyzeHeuristics } from '../ai/providers/openai';
import { Database } from '../supabase';

type HeuristicAnalysis = Database['public']['Tables']['heuristic_analysis']['Row'];
type Screenshot = Database['public']['Tables']['screenshots']['Row'];

interface CreateAnalysisInput {
  userId: string;
  screenshots: {
    file: File;
    order: number;
    description?: string;
  }[];
  context: {
    productType: 'marketplace' | 'audio' | 'video' | 'saas' | 'social';
    device: 'web' | 'tablet' | 'mobile';
    interactionType: string;
    flowType: string;
  };
}

export async function createAnalysis(input: CreateAnalysisInput) {
  // 1. Criar a análise no banco
  const { data: analysis, error: analysisError } = await supabase
    .from('heuristic_analysis')
    .insert({
      user_id: input.userId,
      context: input.context,
      status: 'processing',
    })
    .select()
    .single();

  if (analysisError) throw analysisError;

  // 2. Upload das screenshots
  const screenshots: Screenshot[] = [];
  
  for (let i = 0; i < input.screenshots.length; i++) {
    const screenshot = input.screenshots[i];
    const fileExt = screenshot.file.name.split('.').pop();
    const fileName = `${analysis.id}-${i}.${fileExt}`;
    
    // Upload para o storage do Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, screenshot.file);

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    // Salvar referência no banco
    const { data: screenshotData, error: screenshotError } = await supabase
      .from('screenshots')
      .insert({
        analysis_id: analysis.id,
        url: publicUrl,
        screenshot_order: screenshot.order,
        description: screenshot.description,
      })
      .select()
      .single();

    if (screenshotError) throw screenshotError;
    screenshots.push(screenshotData);
  }

  // 3. Iniciar processamento assíncrono
  processAnalysis(analysis.id).catch(console.error);

  return { ...analysis, screenshots };
}

async function processAnalysis(analysisId: string) {
  try {
    // 1. Buscar análise e screenshots
    const { data: analysis, error: analysisError } = await supabase
      .from('heuristic_analysis')
      .select(`
        *,
        screenshots (*)
      `)
      .eq('id', analysisId)
      .single();

    if (analysisError) throw analysisError;

    const violations = [];
    const suggestions = [];

    // 2. Processar cada screenshot
    for (const screenshot of analysis.screenshots) {
      // Baixar imagem
      const response = await fetch(screenshot.url);
      const imageBuffer = await response.arrayBuffer();

      // Analisar heurísticas
      const result = await analyzeHeuristics(
        Buffer.from(imageBuffer),
        analysis.context as any
      );

      violations.push(...result.violations.map(v => ({
        ...v,
        screenshotId: screenshot.id,
      })));
      suggestions.push(...result.suggestions);
    }

    // 3. Atualizar análise com resultados
    const { error: updateError } = await supabase
      .from('heuristic_analysis')
      .update({
        violations,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Erro no processamento da análise:', error);
    
    await supabase
      .from('heuristic_analysis')
      .update({
        status: 'failed',
      })
      .eq('id', analysisId);
  }
}

export async function getAnalysis(analysisId: string) {
  const { data, error } = await supabase
    .from('heuristic_analysis')
    .select(`
      *,
      screenshots (*)
    `)
    .eq('id', analysisId)
    .single();

  if (error) throw error;
  return data;
} 
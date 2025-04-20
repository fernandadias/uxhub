import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisContext {
  productType: 'marketplace' | 'audio' | 'video' | 'saas' | 'social';
  device: 'web' | 'tablet' | 'mobile';
  interactionType: string;
  flowType: string;
}

interface Violation {
  heuristic: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  reason: string;
  priority: 'high' | 'medium' | 'low';
  suggestions: string[];
}

export async function analyzeHeuristics(
  imageBuffer: Buffer,
  context: AnalysisContext
): Promise<{
  violations: Violation[];
  suggestions: string[];
}> {
  const PROMPT_TEMPLATE = `
  Analise esta interface de usuário considerando as 10 heurísticas de Nielsen:
  - Visibilidade do status do sistema
  - Correspondência entre o sistema e o mundo real
  - Controle e liberdade para o usuário
  - Consistência e padrões
  - Prevenção de erros
  - Reconhecimento em vez de recordação
  - Flexibilidade e eficiência de uso
  - Estética e design minimalista
  - Ajuda aos usuários a reconhecer, diagnosticar e recuperar erros
  - Ajuda e documentação

  Contexto:
  - Tipo de produto: ${context.productType}
  - Dispositivo: ${context.device}
  - Tipo de interação: ${context.interactionType}
  - Tipo de fluxo: ${context.flowType}

  Para cada violação encontrada, forneça:
  1. Qual heurística foi violada
  2. Localização exata na tela (coordenadas x, y, largura, altura)
  3. Motivo da violação
  4. Nível de prioridade (alta, média, baixa)
  5. Sugestões de correção

  Retorne a resposta em formato JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT_TEMPLATE },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      violations: result.violations || [],
      suggestions: result.suggestions || [],
    };
  } catch (error) {
    console.error('Erro na análise de heurísticas:', error);
    throw new Error('Falha na análise de heurísticas');
  }
} 
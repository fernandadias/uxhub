import OpenAI from 'openai';
import { AnalysisContext, Screenshot, Violation } from '../types/heuristicAnalysis';
import { createClient } from '@supabase/supabase-js';

const NIELSEN_HEURISTICS = [
  'Visibilidade do status do sistema',
  'Correspondência entre o sistema e o mundo real',
  'Controle e liberdade para o usuário',
  'Consistência e padrões',
  'Prevenção de erros',
  'Reconhecimento em vez de recordação',
  'Flexibilidade e eficiência de uso',
  'Estética e design minimalista',
  'Ajuda aos usuários a reconhecer, diagnosticar e se recuperar de erros',
  'Ajuda e documentação'
];

export async function analyzeHeuristics(
  context: AnalysisContext,
  screenshots: { url: string; type: string }[],
  supabaseToken: string
): Promise<Violation[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Chave da OpenAI não configurada');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, // 30 segundos
    maxRetries: 3,
  });

  console.log('Iniciando análise das imagens...');
  console.log('Número de imagens:', screenshots.length);

  const messages = [
    {
      role: 'system' as const,
      content: `Você é um especialista em UX que analisa produtos digitais baseado nas heurísticas de Nielsen. Sua resposta deve ser sempre em formato JSON.

      As 10 heurísticas de Nielsen são:
      1. Visibilidade do status do sistema
      2. Correspondência entre o sistema e o mundo real
      3. Controle e liberdade para o usuário
      4. Consistência e padrões
      5. Prevenção de erros
      6. Reconhecimento em vez de recordação
      7. Flexibilidade e eficiência de uso
      8. Estética e design minimalista
      9. Ajuda aos usuários a reconhecer, diagnosticar e se recuperar de erros
      10. Ajuda e documentação`,
      name: 'system'
    },
    {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: `Analise este produto digital considerando o contexto:
          - Tipo de produto: ${context.productType}
          - Dispositivo: ${context.device}
          - Interação principal: ${context.interactionType}
          - Tipo de fluxo: ${context.flowType}
          
          As imagens representam um fluxo completo onde:
          1. A primeira imagem (start) mostra onde o usuário inicia a interação principal
          2. As imagens intermediárias (iteration) mostram o que acontece durante o fluxo
          3. A última imagem (end) mostra onde o usuário finaliza a interação principal
          
          Por favor, analise o fluxo completo considerando que o usuário está realizando a interação principal informada e o resultado final é o tipo de fluxo informado.
          
          Para cada imagem, analise cada uma das 10 heurísticas de Nielsen e identifique:
          1. Se a heurística está sendo respeitada
          2. Se há violações, qual é a gravidade (alta, média, baixa)
          3. Onde exatamente na tela a violação ocorre
          4. Sugestões específicas de como melhorar
          
          Considere especialmente:
          1. Se algo que deveria estar na tela inicial está faltando
          2. Se há feedback adequado durante o fluxo
          3. Se o resultado final atende às expectativas do usuário
          4. Se há consistência entre as telas
          5. Se o fluxo é intuitivo e eficiente
          6. Se há prevenção de erros em cada etapa
          7. Se o usuário tem controle e liberdade para voltar/cancelar
          8. Se a interface usa linguagem e conceitos familiares ao usuário
          9. Se há ajuda e documentação quando necessário
          10. Se o design é limpo e focado no essencial
          
          Retorne sua resposta em formato JSON com a seguinte estrutura:
          {
            "violations": [
              {
                "heuristic": "Nome da heurística violada",
                "description": "Descrição detalhada da violação",
                "suggestions": ["Sugestão 1", "Sugestão 2"],
                "priority": "alta|média|baixa",
                "location": {
                  "x": 100,
                  "y": 200
                },
                "type": "start|iteration|end"
              }
            ]
          }`
        },
        ...screenshots.map(screenshot => ({
          type: 'image_url' as const,
          image_url: {
            url: screenshot.url,
            detail: 'auto' as const
          }
        }))
      ],
      name: 'user'
    }
  ];

  console.log('Enviando requisição para a OpenAI...');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 4000, // Aumentado para permitir mais resultados
    response_format: { type: 'json_object' }
  });

  if (!response.choices[0]?.message?.content) {
    throw new Error('Resposta vazia da API');
  }

  try {
    const result = JSON.parse(response.choices[0].message.content);
    
    if (!Array.isArray(result.violations)) {
      throw new Error('Formato de resposta inválido');
    }

    return result.violations;
  } catch (error) {
    console.error('Erro ao processar resposta da API:', error);
    throw new Error('Falha ao processar análise heurística');
  }
} 
import { AnalysisResult } from '../types/heuristics';

// Configuração global do modo de operação
// Altere este valor para false quando quiser usar a API real
const USE_MOCK_DATA = true;

export const ANALYSIS_CONFIG = {
  useMockData: USE_MOCK_DATA,
  mockDelay: 1000, // delay em ms para simular chamada de API
};

// Dados mockados para desenvolvimento
export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  metadata: {
    timestamp: new Date().toISOString(),
    frameworkVersion: '1.0.0',
    analysisContext: {
      productType: 'marketplace',
      device: 'web',
      interaction: 'login',
      flow: 'main'
    }
  },
  scores: {
    overall: {
      score: 75,
      descriptor: 'Bom',
      description: 'A interface apresenta uma boa implementação das heurísticas com algumas oportunidades de melhoria'
    },
    byHeuristic: {
      visibilityOfSystemStatus: {
        score: 8,
        descriptor: 'Bom',
        description: 'O sistema comunica bem seu status, com poucas oportunidades de melhoria'
      },
      matchBetweenSystemAndRealWorld: {
        score: 7,
        descriptor: 'Bom',
        description: 'A linguagem utilizada está alinhada com o vocabulário do usuário'
      }
    }
  },
  analysis: {
    images: [
      {
        sequence: 1,
        type: 'start',
        violations: [
          {
            heuristic: 'Visibilidade do status do sistema',
            location: {
              coordinates: {
                x: 100,
                y: 200,
                width: 300,
                height: 400
              },
              visualReference: {
                element: 'Botão de login',
                position: 'canto superior direito',
                context: 'Após preenchimento do formulário'
              }
            },
            severity: {
              level: 'medium',
              description: 'Impacto moderado na experiência do usuário',
              rationale: 'A falta de feedback durante a transição pode causar confusão, mas não impede a conclusão da tarefa'
            },
            description: 'O status do carregamento não é visível durante a transição',
            impact: 'Usuários podem pensar que o sistema travou',
            recommendation: 'Adicionar indicador de progresso durante transições'
          }
        ]
      }
    ]
  }
}; 
import { ANALYSIS_CONFIG } from '@/config/analysis';
import { AnalysisDimensions, AnalysisResult, HeuristicViolation, ImageAnalysis, HeuristicScore } from '@/types/heuristics';
import { PromptGenerator } from '@/services/promptGenerator';

export class AnalysisService {
  private dimensions: AnalysisDimensions;

  constructor(dimensions: AnalysisDimensions) {
    this.dimensions = dimensions;
  }

  async analyzeImages(images: File[]): Promise<AnalysisResult> {
    if (ANALYSIS_CONFIG.useMockData) {
      // No modo MOCK, não validamos as imagens
      return this.generateMockResult();
    }

    if (images.length === 0) {
      throw new Error('Por favor, adicione pelo menos uma imagem em cada etapa do fluxo');
    }

    const promptGenerator = new PromptGenerator(this.dimensions);
    const prompt = promptGenerator.generate();

    // TODO: Implementar chamada real à API
    return this.generateMockResult();
  }

  private async generateMockResult(): Promise<AnalysisResult> {
    // Simular delay da API
    return new Promise((resolve) => {
      setTimeout(() => {
        const result: AnalysisResult = {
          metadata: {
            timestamp: new Date().toISOString(),
            frameworkVersion: '1.0.0',
            analysisContext: {
              productType: this.dimensions.productType,
              device: this.dimensions.device,
              interaction: this.dimensions.interaction,
              flow: this.dimensions.flow
            }
          },
          scores: {
            overall: {
              score: 85,
              descriptor: 'Bom',
              description: 'A interface atende bem aos princípios de usabilidade'
            },
            byHeuristic: {
              visibility: {
                score: 9,
                descriptor: 'Excelente',
                description: 'Excelente visibilidade do estado do sistema'
              },
              match: {
                score: 8,
                descriptor: 'Bom',
                description: 'Bom alinhamento com o mundo real'
              },
              control: {
                score: 9,
                descriptor: 'Excelente',
                description: 'Excelente controle e liberdade do usuário'
              },
              consistency: {
                score: 8,
                descriptor: 'Bom',
                description: 'Boa consistência e padrões'
              },
              error: {
                score: 9,
                descriptor: 'Excelente',
                description: 'Excelente prevenção de erros'
              },
              recognition: {
                score: 8,
                descriptor: 'Bom',
                description: 'Bom reconhecimento em vez de memorização'
              },
              flexibility: {
                score: 9,
                descriptor: 'Excelente',
                description: 'Excelente flexibilidade e eficiência de uso'
              },
              minimalism: {
                score: 8,
                descriptor: 'Bom',
                description: 'Bom design estético e minimalista'
              },
              errorRecovery: {
                score: 9,
                descriptor: 'Excelente',
                description: 'Excelente ajuda aos usuários a reconhecer, diagnosticar e recuperar-se de erros'
              },
              help: {
                score: 8,
                descriptor: 'Bom',
                description: 'Boa ajuda e documentação'
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
                    heuristic: 'visibility',
                    location: {
                      coordinates: { x: 100, y: 200, width: 50, height: 30 },
                      visualReference: {
                        element: 'botão de navegação',
                        position: 'canto superior direito',
                        context: 'barra de navegação principal'
                      }
                    },
                    severity: {
                      level: 'medium',
                      description: 'Problema moderado de visibilidade',
                      rationale: 'O elemento pode não ser facilmente encontrado por novos usuários'
                    },
                    description: 'Elemento de navegação não está claramente visível',
                    impact: 'Usuários podem ter dificuldade em encontrar funcionalidades importantes',
                    recommendation: 'Aumentar o contraste e/ou tamanho do elemento'
                  }
                ]
              }
            ]
          }
        };
        resolve(result);
      }, 1000);
    });
  }
} 
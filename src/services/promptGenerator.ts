import { AnalysisDimensions } from '../types/heuristics';

const PRODUCT_TYPE_CHARACTERISTICS = {
  marketplace: {
    focus: 'conversão, transações, comparação de produtos',
    keyConsiderations: [
      'Apresentação clara de produtos',
      'Processo de checkout otimizado',
      'Informações críticas visíveis'
    ]
  },
  social: {
    focus: 'engajamento, criação e consumo de conteúdo',
    keyConsiderations: [
      'Sinais sociais visíveis',
      'Incentivo à criação de conteúdo',
      'Controles de privacidade acessíveis'
    ]
  },
  saas: {
    focus: 'produtividade, colaboração, gestão',
    keyConsiderations: [
      'Consistência entre módulos',
      'Ações frequentes acessíveis',
      'Comunicação clara de estado'
    ]
  },
  video: {
    focus: 'consumo, progresso, retenção',
    keyConsiderations: [
      'Controles de reprodução acessíveis',
      'Navegação fluida entre conteúdos',
      'Interface não intrusiva'
    ]
  },
  audio: {
    focus: 'experiência auditiva, controle de reprodução',
    keyConsiderations: [
      'Controles utilizáveis sem tela',
      'Feedback por múltiplos canais',
      'Transições naturais'
    ]
  },
  finance: {
    focus: 'segurança, clareza, confiança',
    keyConsiderations: [
      'Transmissão de confiança visual',
      'Destaque para informações críticas',
      'Confirmação adequada de ações'
    ]
  }
};

const DEVICE_CHARACTERISTICS = {
  web: {
    constraints: ['Maior espaço, mais recursos'],
    opportunities: ['Multitarefa, atalhos de teclado']
  },
  tablet: {
    constraints: ['Orientação variável'],
    opportunities: ['Interação touch, mobilidade']
  },
  mobile: {
    constraints: ['Espaço limitado'],
    opportunities: ['Contexto móvel, portabilidade']
  }
};

const INTERACTION_CHARACTERISTICS = {
  login: {
    primaryGoals: ['Segurança, simplicidade'],
    criticalPoints: ['Recuperação de senha, validação']
  },
  onboarding: {
    primaryGoals: ['Demonstração de valor, aprendizado'],
    criticalPoints: ['Ritmo personalizável, quantidade de informação']
  },
  consultation: {
    primaryGoals: ['Clareza, organização'],
    criticalPoints: ['Estrutura do conteúdo, navegação']
  },
  edition: {
    primaryGoals: ['Flexibilidade, prevenção de erros'],
    criticalPoints: ['Salvamento, histórico']
  },
  purchase: {
    primaryGoals: ['Confiança, clareza'],
    criticalPoints: ['Informações críticas, confirmação']
  },
  deletion: {
    primaryGoals: ['Prevenção de erros, confirmação'],
    criticalPoints: ['Irreversibilidade, impacto']
  },
  search: {
    primaryGoals: ['Relevância, refinamento'],
    criticalPoints: ['Resultados, filtros']
  },
  social: {
    primaryGoals: ['Engajamento, moderação'],
    criticalPoints: ['Privacidade, feedback']
  },
  personalization: {
    primaryGoals: ['Controle, preview'],
    criticalPoints: ['Descoberta, reversibilidade']
  },
  support: {
    primaryGoals: ['Acessibilidade, clareza'],
    criticalPoints: ['Contexto, solução']
  },
  navigation: {
    primaryGoals: ['Orientação, retorno'],
    criticalPoints: ['Estrutura, progresso']
  },
  sharing: {
    primaryGoals: ['Segurança, controle'],
    criticalPoints: ['Audiência, formato']
  },
  conclusion: {
    primaryGoals: ['Progresso, contexto'],
    criticalPoints: ['Confirmação, próximos passos']
  }
};

const FLOW_CHARACTERISTICS = {
  main: {
    successCriteria: ['Eficiência, clareza'],
    riskAreas: ['Distrações, desvios desnecessários']
  },
  alternative: {
    successCriteria: ['Clareza do desvio, retorno fácil'],
    riskAreas: ['Confusão, perda de contexto']
  },
  error: {
    successCriteria: ['Clareza, solução'],
    riskAreas: ['Frustração, abandono']
  },
  shortcut: {
    successCriteria: ['Eficiência, acesso rápido'],
    riskAreas: ['Confusão, perda de contexto']
  },
  exploratory: {
    successCriteria: ['Descoberta, organização'],
    riskAreas: ['Sobrecarga, desorientação']
  },
  confirmation: {
    successCriteria: ['Clareza, prevenção'],
    riskAreas: ['Atrito, hesitação']
  },
  return: {
    successCriteria: ['Continuidade, contexto'],
    riskAreas: ['Perda de progresso, desorientação']
  }
};

export class PromptGenerator {
  constructor(public dimensions: AnalysisDimensions) {}

  generate(): string {
    return `
      # Análise Heurística Contextual

      ${this.generateContextSection()}
      ${this.generatePriorityHeuristics()}
      ${this.generateEvaluationCriteria()}
      ${this.generateOutputFormat()}
      ${this.generateTechnicalReferences()}
    `;
  }

  private generateContextSection(): string {
    const productType = PRODUCT_TYPE_CHARACTERISTICS[this.dimensions.productType];
    const device = DEVICE_CHARACTERISTICS[this.dimensions.device];
    const interaction = INTERACTION_CHARACTERISTICS[this.dimensions.interaction];
    const flow = FLOW_CHARACTERISTICS[this.dimensions.flow];

    return `
      ## Contexto da Análise
      Você está analisando uma interface ${this.dimensions.productType} 
      para dispositivo ${this.dimensions.device} 
      com foco em interação do tipo ${this.dimensions.interaction} 
      seguindo um fluxo ${this.dimensions.flow}.

      Características específicas:
      - Tipo de Produto: ${productType.focus}
      - Considerações-chave: ${productType.keyConsiderations.join(', ')}
      
      - Dispositivo: ${device.constraints.join(', ')}
      - Oportunidades: ${device.opportunities.join(', ')}
      
      - Interação: ${interaction.primaryGoals.join(', ')}
      - Pontos críticos: ${interaction.criticalPoints.join(', ')}
      
      - Fluxo: ${flow.successCriteria.join(', ')}
      - Áreas de risco: ${flow.riskAreas.join(', ')}
    `;
  }

  private generatePriorityHeuristics(): string {
    return `
      ## Heurísticas Prioritárias
      Para este contexto específico, avalie as seguintes heurísticas:

      1. Visibilidade do status do sistema
      2. Correspondência entre sistema e mundo real
      3. Controle e liberdade do usuário
      4. Consistência e padrões
      5. Prevenção de erros
      6. Reconhecimento em vez de recordação
      7. Flexibilidade e eficiência de uso
      8. Estética e design minimalista
      9. Ajuda aos usuários a reconhecer, diagnosticar e se recuperar de erros
      10. Ajuda e documentação

      Para cada heurística, considere:
      - Impacto no contexto específico
      - Severidade da violação
      - Localização precisa na interface
      - Recomendações contextualizadas
    `;
  }

  private generateEvaluationCriteria(): string {
    return `
      ## Critérios de Avaliação

      Pontuação (0-10):
      0-2: Crítico - Impacto severo na experiência
      3-5: Grave - Problemas significativos
      6-7: Moderado - Oportunidades de melhoria
      8-9: Bom - Pequenas melhorias possíveis
      10: Excelente - Implementação ideal

      Severidade:
      - Critical: Impede a conclusão da tarefa
      - High: Impacto significativo na experiência
      - Medium: Problemas notáveis mas gerenciáveis
      - Low: Pequenas melhorias desejáveis
    `;
  }

  private generateOutputFormat(): string {
    return `
      ## Formato de Saída
      Forneça sua análise no seguinte formato JSON:
      {
        "metadata": {
          "timestamp": "string",
          "frameworkVersion": "string",
          "analysisContext": {
            "productType": "string",
            "device": "string",
            "interaction": "string",
            "flow": "string"
          }
        },
        "scores": {
          "overall": {
            "score": number,
            "descriptor": "string",
            "description": "string"
          },
          "byHeuristic": {
            "heuristicName": {
              "score": number,
              "descriptor": "string",
              "description": "string"
            }
          }
        },
        "analysis": {
          "images": [
            {
              "sequence": number,
              "type": "string",
              "violations": [
                {
                  "heuristic": "string",
                  "location": {
                    "coordinates": {
                      "x": number,
                      "y": number,
                      "width": number,
                      "height": number
                    },
                    "visualReference": {
                      "element": "string",
                      "position": "string",
                      "context": "string"
                    }
                  },
                  "severity": {
                    "level": "string",
                    "description": "string",
                    "rationale": "string"
                  },
                  "description": "string",
                  "impact": "string",
                  "recommendation": "string"
                }
              ]
            }
          ]
        }
      }
    `;
  }

  private generateTechnicalReferences(): string {
    return `
      ## Referências Técnicas
      Considere as seguintes referências técnicas específicas para ${this.dimensions.productType}:

      - Nielsen Norman Group: Heurísticas de Usabilidade
      - Material Design Guidelines
      - Apple Human Interface Guidelines
      - Web Content Accessibility Guidelines (WCAG)

      Padrões específicos para ${this.dimensions.device}:
      - Tamanhos de toque recomendados
      - Padrões de navegação
      - Hierarquia visual
      - Feedback e resposta
    `;
  }
} 
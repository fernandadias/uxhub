import { AnalysisDimensions, AnalysisResult } from '../types/heuristics';
import { PromptGenerator } from './promptGenerator';
import { ANALYSIS_CONFIG, MOCK_ANALYSIS_RESULT } from '../config/analysis';

export class AnalysisService {
  private promptGenerator: PromptGenerator;

  constructor(dimensions: AnalysisDimensions) {
    this.promptGenerator = new PromptGenerator(dimensions);
  }

  async analyzeImages(images: File[]): Promise<AnalysisResult> {
    if (ANALYSIS_CONFIG.useMockData) {
      // Simula um delay de API
      await new Promise(resolve => setTimeout(resolve, ANALYSIS_CONFIG.mockDelay));
      return MOCK_ANALYSIS_RESULT;
    }

    const prompt = this.promptGenerator.generate();
    
    try {
      const response = await fetch('/api/heuristics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dimensions: this.promptGenerator.dimensions,
          images: images.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na análise das imagens');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na análise:', error);
      throw error;
    }
  }
} 
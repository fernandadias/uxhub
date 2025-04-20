import React, { useState, useEffect } from 'react';
import { HeuristicResult } from '../../types/heuristics';
import { AnalysisResults } from './AnalysisResults';
import { LoadingAnalysis } from './LoadingAnalysis';
import { DeviceType, ProductType, KeyInteraction, FlowType } from '../../types/heuristics';
import { FiPlay, FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

interface HeuristicAnalysisProps {
  toolId: string;
}

export const HeuristicAnalysis: React.FC<HeuristicAnalysisProps> = ({ toolId }) => {
  const [results, setResults] = useState<HeuristicResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - substituir por dados reais da API
  const [auditInfo] = useState({
    projectName: 'Projeto Exemplo',
    productType: { id: '1', name: 'Marketplace', example: 'OLX, mercadoLivre' } as ProductType,
    device: { id: '1', name: 'Web', icon: '🌐' } as DeviceType,
    keyInteraction: { id: '1', name: 'Criação', example: 'nova postagem, curso, produto' } as KeyInteraction,
    flowType: { id: '1', name: 'Principal / sucesso' } as FlowType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    const analyzeTool = async () => {
      try {
        setIsLoading(true);
        // TODO: Implementar chamada à API para análise heurística
        const mockResults: HeuristicResult[] = [
          {
            id: '1',
            title: 'Usabilidade da Interface',
            description: 'A interface apresenta alguns problemas de usabilidade que podem impactar a experiência do usuário.',
            severity: 'medium',
            recommendations: [
              'Melhorar o contraste de cores para maior acessibilidade',
              'Adicionar tooltips para explicar funcionalidades complexas',
              'Implementar feedback visual para ações do usuário'
            ],
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Performance',
            description: 'O tempo de carregamento está acima do esperado para algumas operações.',
            severity: 'high',
            recommendations: [
              'Otimizar consultas ao banco de dados',
              'Implementar cache para dados frequentemente acessados',
              'Reduzir o tamanho dos assets'
            ],
            updatedAt: new Date().toISOString()
          }
        ];
        setResults(mockResults);
      } catch (err) {
        setError('Erro ao realizar análise heurística');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeTool();
  }, [toolId]);

  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName.toLowerCase()) {
      case 'web':
        return <FiMonitor className="w-6 h-6" />;
      case 'tablet':
        return <FiTablet className="w-6 h-6" />;
      case 'mobile':
        return <FiSmartphone className="w-6 h-6" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingAnalysis />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Análise Heurística</h1>
          
          <div className="bg-[#A8E80E]/10 border border-[#A8E80E]/20 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FiPlay className="w-6 h-6 text-[#A8E80E]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Entenda como usar a ferramenta</h3>
                <p className="text-[#9ca3af] mb-4">
                  Assista ao vídeo tutorial para aprender como realizar uma análise heurística eficiente.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=exemplo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#A8E80E] text-black rounded-lg hover:bg-[#A8E80E]/90 transition-colors"
                >
                  <FiPlay className="w-4 h-4 mr-2" />
                  Assistir Tutorial
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Projeto */}
          <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
            <h2 className="text-xl font-semibold text-white mb-4">Informações do Projeto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Nome do Projeto</label>
                <p className="mt-1 text-white">{auditInfo.projectName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Tipo de Produto</label>
                <p className="mt-1 text-white">{auditInfo.productType.name}</p>
                <p className="text-sm text-[#9ca3af]">Exemplo: {auditInfo.productType.example}</p>
              </div>
            </div>
          </div>

          {/* Informações da Auditoria */}
          <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
            <h2 className="text-xl font-semibold text-white mb-4">Informações da Auditoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Dispositivo</label>
                <div className="mt-1 flex items-center gap-2">
                  {getDeviceIcon(auditInfo.device.name)}
                  <span className="text-white">{auditInfo.device.name}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Interação Principal</label>
                <p className="mt-1 text-white">{auditInfo.keyInteraction.name}</p>
                <p className="text-sm text-[#9ca3af]">Exemplo: {auditInfo.keyInteraction.example}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Tipo de Fluxo</label>
                <p className="mt-1 text-white">{auditInfo.flowType.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9ca3af]">Data da Auditoria</label>
                <p className="mt-1 text-white">
                  {new Date(auditInfo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
          <h2 className="text-xl font-semibold text-white mb-4">Resultados da Análise</h2>
          <AnalysisResults results={results} />
        </div>
      </div>
    </div>
  );
}; 
'use client';

import { useState } from 'react';
import { HeuristicAnalysis } from '@/components/heuristics/HeuristicAnalysis';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel } from '@/components/shared/Carousel';

interface HeuristicAnalysisPageProps {
  params: {
    id: string;
  };
}

// Mock data - substituir por dados da API
const mockAuditInfo = {
  projectName: 'Projeto Exemplo',
  productType: { id: '1', name: 'Marketplace', example: 'OLX, mercadoLivre' },
  device: { id: '1', name: 'Web', icon: '🌐' },
  keyInteraction: { id: '1', name: 'Criação', example: 'nova postagem, curso, produto' },
  flowType: { id: '1', name: 'Principal / sucesso' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  score: 75,
  heuristics: [
    { name: 'Visibilidade do Status do Sistema', score: 80 },
    { name: 'Correspondência entre o Sistema e o Mundo Real', score: 70 },
    { name: 'Controle e Liberdade do Usuário', score: 85 },
    { name: 'Consistência e Padrões', score: 75 },
    { name: 'Prevenção de Erros', score: 65 },
    { name: 'Reconhecimento ao Invés de Lembrança', score: 80 },
    { name: 'Flexibilidade e Eficiência de Uso', score: 70 },
    { name: 'Estética e Design Minimalista', score: 85 },
    { name: 'Ajuda aos Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros', score: 75 },
    { name: 'Ajuda e Documentação', score: 65 },
  ],
  problems: {
    high: 3,
    medium: 5,
    low: 2,
  },
  screenshots: [
    {
      id: '1',
      url: '/screenshots/1.png',
      order: 0,
      type: 'start',
      annotations: [
        { id: '1', x: 100, y: 200, severity: 'high', description: 'Problema de contraste' },
        { id: '2', x: 300, y: 400, severity: 'medium', description: 'Botão muito pequeno' },
      ],
    },
    {
      id: '2',
      url: '/screenshots/2.png',
      order: 1,
      type: 'iteration',
      annotations: [
        { id: '3', x: 200, y: 300, severity: 'low', description: 'Texto pouco legível' },
      ],
    },
  ],
};

export default function HeuristicAnalysisPage({ params }: HeuristicAnalysisPageProps) {
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados da Auditoria de UX
          </h1>
          <div className="flex items-center gap-2 text-[#9ca3af] mb-2">
            <span className="text-white">{mockAuditInfo.projectName}</span>
            <span>•</span>
            <span>{mockAuditInfo.productType.name}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {getDeviceIcon(mockAuditInfo.device.name)}
              <span>{mockAuditInfo.device.name}</span>
            </div>
          </div>
          <div className="text-[#9ca3af]">
            Contexto: {mockAuditInfo.keyInteraction.name} - {mockAuditInfo.flowType.name} • Concluído em{' '}
            {new Date(mockAuditInfo.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList className="bg-[#1f1e20] border border-[rgb(45,45,45)]">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          </TabsList>

          {/* Resumo */}
          <TabsContent value="resumo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score */}
              <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
                <h2 className="text-xl font-semibold text-white mb-4">Score</h2>
                <div className="text-4xl font-bold text-[#A8E80E]">
                  {mockAuditInfo.score}/100
                </div>
              </div>

              {/* Problemas */}
              <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
                <h2 className="text-xl font-semibold text-white mb-4">Problemas</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{mockAuditInfo.problems.high}</div>
                    <div className="text-[#9ca3af]">Alta Prioridade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{mockAuditInfo.problems.medium}</div>
                    <div className="text-[#9ca3af]">Média Prioridade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{mockAuditInfo.problems.low}</div>
                    <div className="text-[#9ca3af]">Baixa Prioridade</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heurísticas */}
            <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
              <h2 className="text-xl font-semibold text-white mb-4">Panorama das Heurísticas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAuditInfo.heuristics.map((heuristic) => (
                  <div key={heuristic.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{heuristic.name}</span>
                      <span className="text-[#A8E80E]">{heuristic.score}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#A8E80E] rounded-full"
                        style={{ width: `${heuristic.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Detalhes */}
          <TabsContent value="detalhes">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Carrossel */}
              <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
                <Carousel
                  screenshots={mockAuditInfo.screenshots}
                  selectedAnnotation={selectedAnnotation}
                  onAnnotationClick={setSelectedAnnotation}
                />
              </div>

              {/* Detalhes dos Problemas */}
              <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
                <h2 className="text-xl font-semibold text-white mb-4">Detalhes dos Problemas</h2>
                <div className="space-y-4">
                  {mockAuditInfo.screenshots.flatMap((screenshot) =>
                    screenshot.annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className={`p-4 rounded-lg border ${
                          selectedAnnotation === annotation.id
                            ? 'border-[#A8E80E] bg-[#A8E80E]/10'
                            : 'border-[rgb(45,45,45)]'
                        }`}
                        onClick={() => setSelectedAnnotation(annotation.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              annotation.severity === 'high'
                                ? 'bg-red-500'
                                : annotation.severity === 'medium'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                          />
                          <span className="text-white">
                            {annotation.severity === 'high'
                              ? 'Alta Prioridade'
                              : annotation.severity === 'medium'
                              ? 'Média Prioridade'
                              : 'Baixa Prioridade'}
                          </span>
                        </div>
                        <p className="text-[#9ca3af]">{annotation.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 
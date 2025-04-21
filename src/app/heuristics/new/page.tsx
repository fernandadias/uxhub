'use client';

import { useState } from 'react';
import { TagInput } from '@/components/shared/TagInput';
import { ScreenshotUploader } from '@/components/shared/ScreenshotUploader';
import { ToolHeader } from '@/components/shared/ToolHeader';
import { ToolResponse } from '@/components/shared/ToolResponse';
import { supabase } from '@/lib/supabase';
import {
  productTypes,
  devices,
  keyInteractions,
  flowTypes,
  type HeuristicAudit,
  type Screenshot,
  type ProductType,
  type DeviceType,
  type KeyInteraction,
  type FlowType,
} from '@/types/heuristics';
import { FiMonitor, FiTablet, FiSmartphone, FiUpload, FiCheck, FiAlertCircle, FiLoader, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

type AnalysisStatus = 'idle' | 'processing' | 'completed' | 'failed';
type AnalysisStep = 'upload' | 'processing' | 'analyzing' | 'generating' | 'completed';
const stepsOrder: AnalysisStep[] = ['upload', 'processing', 'analyzing', 'generating', 'completed'];

export default function NewHeuristicAudit() {
  const [formData, setFormData] = useState<Partial<HeuristicAudit>>({
    projectName: '',
    productType: productTypes[0],
    device: devices[0],
    keyInteraction: keyInteractions[0],
    flowType: flowTypes[0],
    screenshots: [],
  });

  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScreenshotUpload = (type: 'start' | 'iteration' | 'end', urls: string[]) => {
    console.log('Imagens enviadas:', {
      type,
      urls
    });

    const newScreenshots = urls.map((url, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      order: formData.screenshots?.length || 0 + index,
      type,
    }));

    setFormData((prev) => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), ...newScreenshots],
    }));

    toast.success(`Imagens ${type} enviadas com sucesso!`);
  };

  const updateProgress = (step: AnalysisStep) => {
    const steps: Record<AnalysisStep, number> = {
      upload: 0,
      processing: 25,
      analyzing: 50,
      generating: 75,
      completed: 100
    };
    setCurrentStep(step);
    setProgress(steps[step]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há pelo menos uma imagem em cada etapa
    const hasStartScreenshot = formData.screenshots?.some(s => s.type === 'start');
    const hasIterationScreenshot = formData.screenshots?.some(s => s.type === 'iteration');
    const hasEndScreenshot = formData.screenshots?.some(s => s.type === 'end');
    
    if (!hasStartScreenshot || !hasIterationScreenshot || !hasEndScreenshot) {
      toast.error('Por favor, adicione pelo menos uma imagem em cada etapa do fluxo');
      return;
    }

    setAnalysisStatus('processing');
    setError(null);
    updateProgress('processing');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Usuário não autenticado');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const payload = {
        ...formData,
        userId: user.id,
      };

      console.log('Dados sendo enviados para análise:', JSON.stringify(payload, null, 2));

      updateProgress('analyzing');

      const response = await fetch('/api/heuristics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta da API:', errorData);
        throw new Error(errorData.error || 'Erro ao enviar análise');
      }

      updateProgress('generating');

      const data = await response.json();
      setAnalysisResults(data);
      setAnalysisStatus('completed');
      updateProgress('completed');
      toast.success('Análise concluída com sucesso!');
    } catch (err) {
      console.error('Erro ao processar análise:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar análise');
      setAnalysisStatus('failed');
      toast.error('Erro ao processar análise');
    }
  };

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

  const getStepIcon = (step: AnalysisStep, currentStep: AnalysisStep) => {
    if (step === currentStep) {
      return <FiLoader className="w-5 h-5 animate-spin text-white" />;
    }
    
    const stepIndex = stepsOrder.indexOf(step);
    const currentStepIndex = stepsOrder.indexOf(currentStep);
    
    if (stepIndex < currentStepIndex) {
      return <FiCheck className="w-5 h-5 text-[#A8E80E]" />;
    }
    
    return null;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-500';
      case 'média':
        return 'bg-yellow-500';
      case 'baixa':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToolHeader
        title="Nova Análise Heurística"
        description="Preencha os campos abaixo para iniciar uma nova análise heurística."
      />

      {/* Barra de Progresso */}
      {analysisStatus !== 'idle' && (
        <div className="mt-8 bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Status da Análise</h3>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-[#A8E80E] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-5 gap-4">
            {stepsOrder.map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center gap-2 ${
                  stepsOrder.indexOf(step) <= stepsOrder.indexOf(currentStep)
                    ? 'text-white'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  {getStepIcon(step, currentStep)}
                </div>
                <span className="text-xs capitalize">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Projeto */}
            <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
              <h2 className="text-xl font-semibold text-white mb-4">Informações do Projeto</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-white mb-2">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-[rgb(45,45,45)] text-white focus:outline-none focus:border-[#A8E80E] transition-colors duration-200"
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, projectName: e.target.value }))
                    }
                    required
                  />
                </div>

                <TagInput<ProductType>
                  label="Tipo do Produto"
                  options={productTypes}
                  value={formData.productType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, productType: value }))
                  }
                  getOptionLabel={(option) => option.name}
                />
              </div>
            </div>

            {/* Informações da Auditoria */}
            <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
              <h2 className="text-xl font-semibold text-white mb-4">Informações da Auditoria</h2>

              <div className="space-y-6">
                <TagInput<DeviceType>
                  label="Dispositivo"
                  options={devices}
                  value={formData.device}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, device: value }))
                  }
                  getOptionLabel={(option) => option.name}
                  renderOption={(option) => (
                    <div className="flex items-center">
                      {getDeviceIcon(option.name)}
                      <span className="ml-2">{option.name}</span>
                    </div>
                  )}
                />

                <TagInput<KeyInteraction>
                  label="Interação Principal"
                  options={keyInteractions}
                  value={formData.keyInteraction}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, keyInteraction: value }))
                  }
                  getOptionLabel={(option) => option.name}
                />

                <TagInput<FlowType>
                  label="Tipo de Fluxo"
                  options={flowTypes}
                  value={formData.flowType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, flowType: value }))
                  }
                  getOptionLabel={(option) => option.name}
                />
              </div>
              <br/>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Telas do Fluxo</h3>
                <div className="grid grid-cols-1 gap-6">
                  <ScreenshotUploader
                    type="start"
                    onUpload={(urls) => handleScreenshotUpload('start', urls)}
                    label="Tela Inicial"
                  />
                  <ScreenshotUploader
                    type="iteration"
                    onUpload={(urls) => handleScreenshotUpload('iteration', urls)}
                    label="Telas Intermediárias"
                  />
                  <ScreenshotUploader
                    type="end"
                    onUpload={(urls) => handleScreenshotUpload('end', urls)}
                    label="Tela Final"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={analysisStatus === 'processing'}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  analysisStatus === 'processing'
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-[#A8E80E] hover:bg-[#A8E80E]/90'
                }`}
              >
                {analysisStatus === 'processing' ? 'Processando...' : 'Iniciar Auditoria'}
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {analysisStatus === 'completed' && analysisResults && (
          <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
            <h2 className="text-xl font-semibold text-white mb-4">Resultados da Análise</h2>
            <div className="space-y-4">
              {analysisResults.violations?.map((violation: any, index: number) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-[#A8E80E]">{violation.heuristic}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      violation.priority === 'alta' ? 'bg-red-500/10 text-red-500' :
                      violation.priority === 'média' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {violation.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/80 mb-2">{violation.description}</p>
                  
                  <button
                    onClick={() => {
                      setSelectedViolation(violation);
                      setIsModalOpen(true);
                    }}
                    className="text-[#A8E80E] hover:text-[#A8E80E]/80 text-sm font-medium"
                  >
                    Ver localização da violação →
                  </button>
                  
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-white mb-1">Sugestões:</h4>
                    <ul className="list-disc list-inside text-white/60">
                      {violation.suggestions.map((suggestion: string, i: number) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="col-span-2">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-red-500 font-medium">Erro na Análise</h3>
                <p className="text-white/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedViolation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1f1e20] rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">{selectedViolation.heuristic}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative">
              <img 
                src={formData.screenshots?.find(s => s.type === selectedViolation.type)?.url} 
                alt="Screenshot com violação" 
                className="rounded-lg w-full"
              />
              {selectedViolation.location && (
                <div 
                  className={`absolute border-2 ${getPriorityColor(selectedViolation.priority)} rounded-full`}
                  style={{
                    left: `${selectedViolation.location.x}px`,
                    top: `${selectedViolation.location.y}px`,
                    width: '20px',
                    height: '20px',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
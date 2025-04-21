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
  type Device,
  type Interaction,
  type Flow,
  type AnalysisResult,
  type ProductTypeOption,
  type DeviceOption,
  type InteractionOption,
  type FlowOption
} from '@/types/heuristics';
import { FiMonitor, FiTablet, FiSmartphone, FiUpload, FiCheck, FiAlertCircle, FiLoader, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AnalysisService } from '@/services/analysisService';
import { ANALYSIS_CONFIG } from '@/config/analysis';

type AnalysisStatus = 'idle' | 'processing' | 'completed' | 'failed';
type AnalysisStep = 'upload' | 'processing' | 'analyzing' | 'generating' | 'completed';
const stepsOrder: AnalysisStep[] = ['upload', 'processing', 'analyzing', 'generating', 'completed'];

export default function NewHeuristicAudit() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<HeuristicAudit>>({
    projectName: '',
    productType: productTypes[0].value,
    device: devices[0].value,
    interaction: keyInteractions[0].value,
    flow: flowTypes[0].value,
    screenshots: [],
  });

  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<ProductTypeOption>(productTypes[0]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceOption>(devices[0]);
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionOption>(keyInteractions[0]);
  const [selectedFlow, setSelectedFlow] = useState<FlowOption>(flowTypes[0]);
  const [images, setImages] = useState<File[]>([]);

  const handleScreenshotUpload = (type: 'start' | 'iteration' | 'end', urls: string[]) => {
    console.log('Imagens enviadas:', {
      type,
      urls
    });

    const newScreenshots: Screenshot[] = urls.map((url, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      sequence: formData.screenshots?.length || 0 + index,
      type,
    }));

    setFormData((prev: Partial<HeuristicAudit>) => ({
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
    setIsLoading(true);
    setAnalysisStatus('processing');
    updateProgress('processing');

    try {
      // No modo MOCK, não exige nome do projeto nem imagens
      if (!ANALYSIS_CONFIG.useMockData) {
        if (!projectName) {
          toast.error('Por favor, informe o nome do projeto');
          return;
        }

        if (images.length === 0) {
          toast.error('Por favor, adicione pelo menos uma imagem em cada etapa do fluxo');
          return;
        }
      }

      const analysisService = new AnalysisService({
        productType: selectedProductType.value,
        device: selectedDevice.value,
        interaction: selectedInteraction.value,
        flow: selectedFlow.value
      });

      updateProgress('analyzing');
      const result = await analysisService.analyzeImages(images);
      
      updateProgress('generating');
      setAnalysisResults(result);
      setAnalysisStatus('completed');
      updateProgress('completed');

      // No modo MOCK, não salvamos no Supabase
      if (!ANALYSIS_CONFIG.useMockData) {
        const { data, error } = await supabase
          .from('heuristic_audits')
          .insert({
            project_name: projectName,
            product_type: selectedProductType.value,
            device: selectedDevice.value,
            interaction: selectedInteraction.value,
            flow: selectedFlow.value,
            analysis_result: result,
            screenshots: formData.screenshots,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) {
          throw error;
        }
      }

      toast.success('Análise concluída com sucesso!');
      if (!ANALYSIS_CONFIG.useMockData) {
        router.push('/heuristics');
      }

    } catch (error) {
      console.error('Erro na análise:', error);
      setError('Erro ao realizar a análise. Tente novamente.');
      setAnalysisStatus('failed');
      toast.error('Erro ao realizar a análise. Tente novamente.');
    } finally {
      setIsLoading(false);
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
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-yellow-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
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
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required={!ANALYSIS_CONFIG.useMockData}
                  />
                </div>

                <TagInput<ProductTypeOption>
                  label="Tipo do Produto"
                  options={productTypes}
                  value={selectedProductType}
                  onChange={(value) => {
                    setSelectedProductType(value);
                    setFormData(prev => ({ ...prev, productType: value.value }));
                  }}
                  getOptionLabel={(option) => option.name}
                />
              </div>
            </div>

            {/* Informações da Auditoria */}
            <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
              <h2 className="text-xl font-semibold text-white mb-4">Informações da Auditoria</h2>

              <div className="space-y-6">
                <TagInput<DeviceOption>
                  label="Dispositivo"
                  options={devices}
                  value={selectedDevice}
                  onChange={(value) => {
                    setSelectedDevice(value);
                    setFormData(prev => ({ ...prev, device: value.value }));
                  }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(option) => (
                    <div className="flex items-center">
                      {getDeviceIcon(option.name)}
                      <span className="ml-2">{option.name}</span>
                    </div>
                  )}
                />

                <TagInput<InteractionOption>
                  label="Interação Principal"
                  options={keyInteractions}
                  value={selectedInteraction}
                  onChange={(value) => {
                    setSelectedInteraction(value);
                    setFormData(prev => ({ ...prev, interaction: value.value }));
                  }}
                  getOptionLabel={(option) => option.name}
                />

                <TagInput<FlowOption>
                  label="Tipo de Fluxo"
                  options={flowTypes}
                  value={selectedFlow}
                  onChange={(value) => {
                    setSelectedFlow(value);
                    setFormData(prev => ({ ...prev, flow: value.value }));
                  }}
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
                    disabled={ANALYSIS_CONFIG.useMockData}
                  />
                  <ScreenshotUploader
                    type="iteration"
                    onUpload={(urls) => handleScreenshotUpload('iteration', urls)}
                    label="Telas Intermediárias"
                    disabled={ANALYSIS_CONFIG.useMockData}
                  />
                  <ScreenshotUploader
                    type="end"
                    onUpload={(urls) => handleScreenshotUpload('end', urls)}
                    label="Tela Final"
                    disabled={ANALYSIS_CONFIG.useMockData}
                  />
                </div>
              </div>
            </div>

            {!ANALYSIS_CONFIG.useMockData && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imagens
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="mt-1 block w-full"
                  required
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-[#A8E80E] hover:bg-[#A8E80E]/90'
                }`}
              >
                {isLoading ? 'Analisando...' : 'Iniciar Auditoria'}
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {analysisStatus === 'completed' && analysisResults && (
          <div className="bg-[#1f1e20] rounded-lg p-6 border border-[rgb(45,45,45)]">
            <h2 className="text-xl font-semibold text-white mb-4">Resultados da Análise</h2>
            
            {/* Score Geral */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg font-medium text-[#A8E80E] mb-2">Score Geral</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-white">{analysisResults.scores.overall.score}</div>
                <div>
                  <div className="text-white font-medium">{analysisResults.scores.overall.descriptor}</div>
                  <div className="text-white/60 text-sm">{analysisResults.scores.overall.description}</div>
                </div>
              </div>
            </div>

            {/* Scores por Heurística */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Scores por Heurística</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analysisResults.scores.byHeuristic).map(([heuristic, score]) => (
                  <div key={heuristic} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-[#A8E80E]">{heuristic}</h4>
                      <span className="text-white font-bold">{score.score}</span>
                    </div>
                    <div className="text-white/60 text-sm">{score.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Violações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Violações Encontradas</h3>
              {analysisResults.analysis.images.map((image) => (
                image.violations.map((violation, index) => (
                  <div key={`${image.sequence}-${index}`} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium text-[#A8E80E]">{violation.heuristic}</h4>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        violation.severity.level === 'critical' ? 'bg-red-500/10 text-red-500' :
                        violation.severity.level === 'high' ? 'bg-yellow-500/10 text-yellow-500' :
                        violation.severity.level === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {violation.severity.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/80 mb-2">{violation.description}</p>
                    <p className="text-white/60 text-sm mb-2">{violation.impact}</p>
                    
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
                      <h4 className="text-sm font-medium text-white mb-1">Recomendação:</h4>
                      <p className="text-white/60">{violation.recommendation}</p>
                    </div>
                  </div>
                ))
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
                src={formData.screenshots?.find((s: Screenshot) => s.type === selectedViolation.type)?.url} 
                alt="Screenshot com violação" 
                className="rounded-lg w-full"
              />
              {selectedViolation.location && (
                <div 
                  className={`absolute border-2 ${getPriorityColor(selectedViolation.severity.level)} rounded-full`}
                  style={{
                    left: `${selectedViolation.location.coordinates.x}px`,
                    top: `${selectedViolation.location.coordinates.y}px`,
                    width: `${selectedViolation.location.coordinates.width}px`,
                    height: `${selectedViolation.location.coordinates.height}px`,
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
'use client';

import { useState } from 'react';
import { TagInput } from '@/components/shared/TagInput';
import { ScreenshotUploader } from '@/components/shared/ScreenshotUploader';
import { ToolHeader } from '@/components/shared/ToolHeader';
import { ToolResponse } from '@/components/shared/ToolResponse';
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
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

export default function NewHeuristicAudit() {
  const [formData, setFormData] = useState<Partial<HeuristicAudit>>({
    projectName: '',
    productType: productTypes[0],
    device: devices[0],
    keyInteraction: keyInteractions[0],
    flowType: flowTypes[0],
    screenshots: [],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleScreenshotUpload = (type: 'start' | 'iteration' | 'end', file: File) => {
    const url = URL.createObjectURL(file);
    const newScreenshot: Screenshot = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      order: formData.screenshots?.length || 0,
      type,
    };

    setFormData((prev) => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), newScreenshot],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // TODO: Implementar submissão do formulário
    console.log(formData);
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

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        <ToolHeader
          title="Nova Auditoria de Heurísticas"
          description="Analise a usabilidade de interfaces digitais seguindo os princípios de Nielsen"
          videoUrl="https://www.youtube.com/watch?v=exemplo"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Container 1: Configurações */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                  <div className="grid grid-cols-1 ">
                    
                    <ScreenshotUploader
                      type="start"
                      onUpload={(file) => handleScreenshotUpload('start', file)}
                      label="Tela Inicial"
                    />
                    <br/>
                    <ScreenshotUploader
                      type="iteration"
                      onUpload={(file) => handleScreenshotUpload('iteration', file)}
                      label="Tela Intermediária"
                    />
                    <br/>
                    <ScreenshotUploader
                      type="end"
                      onUpload={(file) => handleScreenshotUpload('end', file)}
                      label="Tela Final"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#A8E80E] text-black rounded-lg hover:bg-[#A8E80E]/90 transition-colors"
                >
                  Iniciar Auditoria
                </button>
              </div>
            </form>
          </div>

          {/* Container 2: Resposta */}
          <div>
            <ToolResponse
              isEnabled={isSubmitted}
              summary={
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Resumo da Análise</h3>
                  <p className="text-[#9ca3af]">
                    Aqui será exibido um resumo das principais descobertas da análise heurística.
                  </p>
                </div>
              }
              details={
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Detalhes da Análise</h3>
                  <p className="text-[#9ca3af]">
                    Aqui serão exibidos os detalhes completos da análise heurística, incluindo
                    recomendações específicas para cada problema encontrado.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
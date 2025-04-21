import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
import { ViolationHighlight } from './ViolationHighlight';

type AnalysisStatus = 'idle' | 'processing' | 'analyzing' | 'generating' | 'completed' | 'failed';

type Violation = {
  heuristic: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestions: string[];
  imageRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  impact: string;
  screenshotUrl?: string;
};

type AnalysisResults = {
  violations: Violation[];
};

export function AnalysisForm() {
  const router = useRouter();
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'processing') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setScreenshots(files);
      
      // Criar URLs de preview
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('processing');
    setError(null);
    setResults(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        projectName: formData.get('projectName'),
        productType: formData.get('productType'),
        device: formData.get('device'),
        keyInteraction: formData.get('keyInteraction'),
        flowType: formData.get('flowType'),
        screenshots: screenshots.map((file, index) => ({
          file,
          order: index,
          type: 'screenshot'
        })),
      };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const response = await fetch('/api/heuristics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      if (!response.ok) throw new Error('Erro ao processar análise');

      const analysisResults = await response.json();
      setResults(analysisResults);
      setStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setStatus('failed');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return 'Processando imagens...';
      case 'analyzing':
        return 'Analisando heurísticas...';
      case 'generating':
        return 'Gerando relatório...';
      default:
        return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do Projeto"
          name="projectName"
          required
          disabled={status !== 'idle'}
        />
        
        <Select
          label="Tipo de Produto"
          name="productType"
          options={[
            { value: 'web', label: 'Web' },
            { value: 'mobile', label: 'Mobile' },
            { value: 'desktop', label: 'Desktop' },
          ]}
          required
          disabled={status !== 'idle'}
        />

        <Select
          label="Dispositivo"
          name="device"
          options={[
            { value: 'desktop', label: 'Desktop' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'mobile', label: 'Mobile' },
          ]}
          required
          disabled={status !== 'idle'}
        />

        <Input
          label="Interação Principal"
          name="keyInteraction"
          required
          disabled={status !== 'idle'}
        />

        <Select
          label="Tipo de Fluxo"
          name="flowType"
          options={[
            { value: 'onboarding', label: 'Onboarding' },
            { value: 'checkout', label: 'Checkout' },
            { value: 'search', label: 'Busca' },
          ]}
          required
          disabled={status !== 'idle'}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Screenshots
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleScreenshotUpload}
            disabled={status !== 'idle'}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/90"
          />
          
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = [...previewUrls];
                      newUrls.splice(index, 1);
                      setPreviewUrls(newUrls);
                      
                      const newFiles = [...screenshots];
                      newFiles.splice(index, 1);
                      setScreenshots(newFiles);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={status !== 'idle' || screenshots.length === 0}
          className="w-full"
        >
          {status === 'idle' ? 'Iniciar Auditoria' : (
            <>
              <Spinner className="mr-2" />
              {getStatusMessage()}
            </>
          )}
        </Button>
      </form>

      {status !== 'idle' && status !== 'completed' && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-600 text-center">{getStatusMessage()}</p>
        </div>
      )}

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {status === 'completed' && results && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Resultados da Análise</h2>
          
          {results.violations.length === 0 ? (
            <p className="text-green-600">Nenhuma violação encontrada!</p>
          ) : (
            <div className="space-y-6">
              {results.violations.map((violation, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{violation.heuristic}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(violation.severity)}`}>
                      {violation.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{violation.description}</p>
                  
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">Impacto na Experiência:</h4>
                    <p className="text-gray-600">{violation.impact}</p>
                  </div>

                  {violation.screenshotUrl && violation.imageRegion && (
                    <div className="mb-4">
                      <ViolationHighlight
                        imageUrl={violation.screenshotUrl}
                        regions={[violation.imageRegion]}
                        severity={violation.severity}
                      />
                    </div>
                  )}
                  
                  <h4 className="font-medium mb-2">Sugestões de Melhoria:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {violation.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-gray-600">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
} 
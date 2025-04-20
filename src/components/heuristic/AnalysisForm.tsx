import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { Card } from '@/components/ui/card/Card';

const INTERACTION_TYPES = [
  'Criação',
  'Personalização',
  'Exclusão',
  'Edição',
  'Login',
  'Onboarding',
  'Compra',
  'Busca',
  'Cadastro',
  'Interação social',
  'Envio',
  'Solicitação de suporte',
  'Consulta/Leitura',
];

const FLOW_TYPES = [
  'Principal / sucesso',
  'Alternativo / exceção',
  'Erro / bloqueio',
  'Exploratório',
  'Retorno / recuperação',
  'Atalho ou acelerado',
];

export function AnalysisForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    productType: 'marketplace' as const,
    device: 'web' as const,
    interactionType: '',
    flowType: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScreenshots(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const analysisInput = {
        userId: user.id,
        screenshots: screenshots.map((file, index) => ({
          file,
          order: index,
        })),
        context: formData,
      };

      const { data: analysis } = await fetch('/api/heuristics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisInput),
      }).then(res => res.json());

      router.push(`/heuristics/analysis/${analysis.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar análise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Produto
          </label>
          <select
            value={formData.productType}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              productType: e.target.value as any,
            }))}
            className="w-full p-2 border rounded-lg bg-white/5 border-[#2d2d2d]"
          >
            <option value="marketplace">Marketplace</option>
            <option value="audio">Conteúdo em áudio</option>
            <option value="video">Conteúdo em vídeo</option>
            <option value="saas">SaaS / Web app</option>
            <option value="social">Rede social</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Dispositivo
          </label>
          <select
            value={formData.device}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              device: e.target.value as any,
            }))}
            className="w-full p-2 border rounded-lg bg-white/5 border-[#2d2d2d]"
          >
            <option value="web">Web</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Interação
          </label>
          <select
            value={formData.interactionType}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              interactionType: e.target.value,
            }))}
            className="w-full p-2 border rounded-lg bg-white/5 border-[#2d2d2d]"
          >
            <option value="">Selecione...</option>
            {INTERACTION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Fluxo
          </label>
          <select
            value={formData.flowType}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              flowType: e.target.value,
            }))}
            className="w-full p-2 border rounded-lg bg-white/5 border-[#2d2d2d]"
          >
            <option value="">Selecione...</option>
            {FLOW_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Screenshots
          </label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {screenshots.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {screenshots.length} arquivo(s) selecionado(s)
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || screenshots.length === 0}
          className="w-full"
        >
          {isLoading ? 'Analisando...' : 'Iniciar Análise'}
        </Button>
      </form>
    </Card>
  );
} 
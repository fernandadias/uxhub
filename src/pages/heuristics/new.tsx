import { AnalysisForm } from '@/components/heuristic/AnalysisForm';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function NewAnalysisPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Nova Análise de Heurísticas</h1>
      <AnalysisForm />
    </div>
  );
} 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { analyzeHeuristics } from '@/services/heuristicAnalysis';

export const maxDuration = 60; // 60 segundos de timeout global

export async function POST(request: Request) {
  try {
    // Obter o token do cabeçalho
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Criar cliente Supabase com o token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        db: {
          schema: 'public'
        },
        storage: {
          retryAttempts: 3,
          retryDelay: 1000
        }
      }
    );

    // Verificar o token e obter o usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }
    
    const body = await request.json();
    console.log('Dados recebidos:', JSON.stringify(body, null, 2));

    const { userId, projectName, productType, device, keyInteraction, flowType, screenshots } = body;

    // Validar dados obrigatórios
    if (!userId || !projectName || !productType || !device || !keyInteraction || !flowType) {
      return NextResponse.json({ error: 'Dados obrigatórios não fornecidos' }, { status: 400 });
    }

    // Preparar dados para inserção
    const analysisData = {
      user_id: userId,
      context: {
        productType: productType.name,
        device: device.name,
        interactionType: keyInteraction.name,
        flowType: flowType.name,
      },
      status: 'processing',
    };

    // Inserir análise
    const { data: analysis, error: analysisError } = await supabase
      .from('heuristic_analysis')
      .insert(analysisData)
      .select()
      .single();

    if (analysisError) {
      console.error('Erro ao inserir análise:', analysisError);
      return NextResponse.json({ error: 'Erro ao salvar análise' }, { status: 500 });
    }

    // Função para tentar baixar a imagem com retry
    const downloadImageWithRetry = async (path: string, maxRetries = 3): Promise<Blob> => {
      let lastError;
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          const { data, error } = await supabase.storage
            .from('screenshots')
            .download(path);
            
          if (error) throw error;
          if (!data) throw new Error('Dados da imagem não encontrados');
          
          return data;
        } catch (error) {
          lastError = error;
          console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
      
      throw lastError;
    };

    // Baixar imagens do Supabase e converter para base64
    const imageContents = await Promise.all(
      screenshots.map(async (screenshot: { url: string; type: string }) => {
        try {
          const url = new URL(screenshot.url);
          let path = url.pathname.replace('/storage/v1/object/public/screenshots/', '');
          console.log('Tentando baixar arquivo:', path);

          const data = await downloadImageWithRetry(path);

          // Verificar o tamanho do arquivo
          console.log('Tamanho do arquivo:', data.size);
          
          // Verificar o tipo MIME do arquivo
          const mimeType = data.type || 'image/jpeg';
          console.log('Tipo MIME detectado:', mimeType);

          // Converter para base64
          const buffer = await data.arrayBuffer();
          console.log('Tamanho do buffer:', buffer.byteLength);
          
          if (buffer.byteLength === 0) {
            throw new Error('Buffer da imagem está vazio');
          }

          const base64 = Buffer.from(buffer).toString('base64');
          console.log('Tamanho do base64:', base64.length);
          
          if (base64.length === 0) {
            throw new Error('String base64 está vazia');
          }

          // Criar a URL base64 com o tipo MIME correto
          const base64Url = `data:${mimeType};base64,${base64}`;
          console.log('Base64 URL criada com sucesso');
          
          return {
            url: base64Url,
            type: screenshot.type
          };
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          throw error;
        }
      })
    );

    // Atualizar status para analyzing
    await supabase
      .from('heuristic_analysis')
      .update({ status: 'analyzing' })
      .eq('id', analysis.id);

    // Realizar análise heurística
    const violations = await analyzeHeuristics(
      {
        userId: user.id,
        productType: productType.name,
        device: device.name,
        interactionType: keyInteraction.name,
        flowType: flowType.name,
      },
      imageContents,
      token
    );

    // Atualizar análise com resultados
    const { error: updateError } = await supabase
      .from('heuristic_analysis')
      .update({
        status: 'completed',
        violations: violations,
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysis.id);

    if (updateError) {
      console.error('Erro ao atualizar análise:', updateError);
      return NextResponse.json({ error: 'Erro ao atualizar análise' }, { status: 500 });
    }

    return NextResponse.json({ violations });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 
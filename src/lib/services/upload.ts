import { supabase } from '@/lib/supabase';

export function validateImage(file: File): { isValid: boolean; error?: string } {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'A imagem deve ter no máximo 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WEBP' };
  }

  return { isValid: true };
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    // Upload para o storage do Supabase
    const { data, error } = await supabase.storage
      .from('screenshots')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }
} 
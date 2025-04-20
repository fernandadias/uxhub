import { v4 as uuidv4 } from 'uuid';

const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File): Promise<string> {
  // Simulando um delay de upload
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Lista de imagens de exemplo permitidas
  const allowedImages = ['01.png', '02.png', '03.png', '04.png', '05.png'];

  // Verifica se o arquivo é uma das imagens de exemplo
  if (allowedImages.includes(file.name)) {
    return `/images/${file.name}`;
  }

  throw new Error('Apenas as imagens de exemplo são permitidas neste momento');
}

export function validateImage(file: File): { isValid: boolean; error?: string } {
  console.log('Validando imagem:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_FILES = ['01.png', '02.png', '03.png', '04.png', '05.png'];

  if (!ALLOWED_FILES.includes(file.name)) {
    return { isValid: false, error: 'Apenas as imagens de exemplo são permitidas' };
  }

  if (file.size > MAX_FILE_SIZE) {
    console.log('Imagem muito grande:', file.size);
    return { isValid: false, error: 'A imagem deve ter no máximo 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    console.log('Tipo de arquivo inválido:', file.type);
    return { isValid: false, error: 'Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WEBP' };
  }

  console.log('Imagem válida');
  return { isValid: true };
} 
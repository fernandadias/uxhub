import { useState, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { uploadFile, validateImage } from '@/lib/services/upload';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ScreenshotUploaderProps {
  type: 'start' | 'iteration' | 'end';
  screenshots?: string[];
  onUpload: (urls: string[]) => void;
  onReorder?: (urls: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export function ScreenshotUploader({ 
  type,
  screenshots = [], 
  onUpload,
  onReorder,
  label,
  disabled = false
}: ScreenshotUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { isAuthenticated } = useAuth();
  const maxScreenshots = type === 'start' ? 3 : 5;
  const canAddMore = screenshots.length < maxScreenshots;

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(false);
    
    if (!e.dataTransfer.files.length) return;
    
    const files = Array.from(e.dataTransfer.files);
    await handleUpload(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    await handleUpload(files);
  };

  const handleUpload = async (files: File[]) => {
    if (disabled) return;
    
    if (!isAuthenticated) {
      toast.error('Você precisa estar autenticado para fazer upload de imagens');
      return;
    }

    if (files.length + screenshots.length > maxScreenshots) {
      toast.error(`Você só pode adicionar até ${maxScreenshots} imagens`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('screenshots')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      onUpload([...screenshots, ...urls]);
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      toast.error('Erro ao fazer upload das imagens');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    
    setIsDragging(false);
  };

  const removeScreenshot = useCallback((index: number) => {
    const newScreenshots = [...screenshots];
    newScreenshots.splice(index, 1);
    onUpload(newScreenshots);
  }, [screenshots, onUpload]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || !onReorder) return;

    const items = Array.from(screenshots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  }, [screenshots, onReorder]);

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      
      {label && <h3 className="text-lg font-medium text-white">{label}</h3>}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="screenshot-upload"
          disabled={!canAddMore || isUploading || !isAuthenticated || disabled}
        />
        <label 
          htmlFor="screenshot-upload" 
          className={`block text-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="space-y-2">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <span>Enviando imagens...</span>
              ) : disabled ? (
                <span>Upload desativado</span>
              ) : (
                <>
                  <span>Arraste imagens aqui ou </span>
                  <span className="text-blue-600 hover:text-blue-500">
                    clique para selecionar
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {type === 'start' ? 'Até 3 imagens' : 'Até 5 imagens'}
            </div>
          </div>
        </label>
      </div>

      {screenshots.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="screenshots" isDropDisabled={!type.includes('iteration')}>
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {screenshots.map((url, index) => (
                  <Draggable
                    key={url}
                    draggableId={url}
                    index={index}
                    isDragDisabled={!type.includes('iteration')}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group"
                      >
                        <img
                          src={url}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {!disabled && (
                          <button
                            type="button"
                            onClick={() => removeScreenshot(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 
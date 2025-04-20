import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import { uploadImage, validateImage } from '@/services/upload';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

interface ScreenshotUploaderProps {
  type: 'start' | 'iteration' | 'end';
  screenshots?: string[];
  onUpload: (urls: string[]) => void;
  onReorder?: (urls: string[]) => void;
  label?: string;
}

export function ScreenshotUploader({ 
  type,
  screenshots = [], 
  onUpload,
  onReorder,
  label
}: ScreenshotUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isMultiple = type === 'iteration';
  const maxFiles = isMultiple ? 5 : 1;

  const handleUpload = useCallback(async (files: FileList) => {
    if (screenshots.length + files.length > maxFiles) {
      toast.error(`Você pode enviar no máximo ${maxFiles} ${maxFiles === 1 ? 'imagem' : 'imagens'}`);
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const validation = validateImage(file);
        if (!validation.isValid) {
          toast.error(validation.error || 'Formato de imagem inválido');
          continue;
        }

        try {
          const url = await uploadImage(file);
          newUrls.push(url);
        } catch (error: any) {
          console.error('Erro ao enviar imagem:', error);
          toast.error(`Erro ao enviar imagem ${i + 1}: ${error?.message || 'Erro desconhecido'}`);
          continue;
        }
      }

      if (newUrls.length > 0) {
        onUpload([...screenshots, ...newUrls]);
        toast.success('Imagens enviadas com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro geral no upload:', error);
      toast.error('Erro ao enviar imagens. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  }, [screenshots, maxFiles, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  }, [handleUpload]);

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

  const canAddMore = screenshots.length < maxFiles;

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      
      {label && <h3 className="text-lg font-medium text-white">{label}</h3>}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}
          ${!canAddMore ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple={isMultiple}
          onChange={handleFileInput}
          className="hidden"
          id="screenshot-upload"
          disabled={!canAddMore || isUploading}
        />
        <label htmlFor="screenshot-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isUploading 
                ? 'Carregando imagem...' 
                : canAddMore 
                  ? `Arraste ${isMultiple ? 'imagens' : 'uma imagem'} ou clique para selecionar`
                  : 'Limite máximo de imagens atingido'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isMultiple ? `Máximo de ${maxFiles} imagens` : 'Apenas uma imagem'}
            </p>
          </div>
        </label>
      </div>

      {screenshots.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="screenshots" isDropDisabled={!isMultiple}>
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
                    isDragDisabled={!isMultiple}
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
                        {isMultiple && (
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 left-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <GripVertical className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
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

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4 animate-pulse" />
          <span>Enviando imagens...</span>
        </div>
      )}
    </div>
  );
} 
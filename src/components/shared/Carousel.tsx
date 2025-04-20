import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Annotation {
  id: string;
  x: number;
  y: number;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

interface Screenshot {
  id: string;
  url: string;
  order: number;
  type: 'start' | 'iteration' | 'end';
  annotations: Annotation[];
}

interface CarouselProps {
  screenshots: Screenshot[];
  selectedAnnotation: string | null;
  onAnnotationClick: (id: string) => void;
}

export function Carousel({ screenshots, selectedAnnotation, onAnnotationClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + screenshots.length) % screenshots.length);
  };

  const currentScreenshot = screenshots[currentIndex];

  return (
    <div className="relative">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <img
          src={currentScreenshot.url}
          alt={`Tela ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* Anotações */}
        {currentScreenshot.annotations.map((annotation) => (
          <button
            key={annotation.id}
            className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
              selectedAnnotation === annotation.id ? 'ring-2 ring-[#A8E80E]' : ''
            } ${
              annotation.severity === 'high'
                ? 'bg-red-500'
                : annotation.severity === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{
              left: `${annotation.x}px`,
              top: `${annotation.y}px`,
            }}
            onClick={() => onAnnotationClick(annotation.id)}
          >
            {annotation.id}
          </button>
        ))}
      </div>

      {/* Navegação */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-4">
        {screenshots.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-[#A8E80E]' : 'bg-white/20'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 
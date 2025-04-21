import { useState } from 'react';
import Image from 'next/image';

type ImageRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ViolationHighlightProps = {
  imageUrl: string;
  regions: ImageRegion[];
  severity: 'low' | 'medium' | 'high';
};

export function ViolationHighlight({ imageUrl, regions, severity }: ViolationHighlightProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt="Screenshot com violações"
        width={800}
        height={600}
        className="rounded-lg"
        onLoad={handleImageLoad}
      />
      
      {regions.map((region, index) => {
        const scaleX = 800 / imageSize.width;
        const scaleY = 600 / imageSize.height;
        
        return (
          <div
            key={index}
            className={`absolute border-2 ${getSeverityColor()} rounded-lg pointer-events-none`}
            style={{
              left: `${region.x * scaleX}px`,
              top: `${region.y * scaleY}px`,
              width: `${region.width * scaleX}px`,
              height: `${region.height * scaleY}px`,
            }}
          />
        );
      })}
    </div>
  );
} 
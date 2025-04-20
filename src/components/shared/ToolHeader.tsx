import { FiPlay, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface ToolHeaderProps {
  title: string;
  description: string;
  videoUrl?: string;
}

export function ToolHeader({ title, description, videoUrl }: ToolHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors w-fit"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Voltar para o Hub</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">{title}</h1>
          <p className="text-[#9ca3af] mt-2">{description}</p>
        </div>
        
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1f1e20] text-white rounded-lg hover:bg-[#2f2e30] transition-colors"
          >
            <FiPlay className="w-5 h-5" />
            <span>Como usar essa ferramenta?</span>
          </a>
        )}
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { ToolCard } from '@/components/ToolCard';
import { Tool } from '@/types/tool';

const tools: Tool[] = [
  {
    id: '1',
    title: 'Analista de Heurísticas',
    description: 'Análise automatizada de interfaces baseada nas heurísticas de Nielsen',
    tags: ['Análise', 'UX', 'IA'],
    isBeta: true,
  },
  {
    id: '2',
    title: 'Gerador de Cenários',
    description: 'Crie cenários de uso com IA baseados em objetivos e personas',
    tags: ['Cenários', 'UX', 'IA'],
  },
  {
    id: '3',
    title: 'Repositório de Padrões',
    description: 'Biblioteca de padrões de UX/UI com recomendações contextuais',
    tags: ['Padrões', 'UI', 'UX'],
  },
  {
    id: '4',
    title: 'Assistente de Visão de Produto',
    description: 'Documente e refine sua visão de produto com sugestões de IA',
    tags: ['Produto', 'IA', 'Documentação'],
  },
  {
    id: '5',
    title: 'UXGPT',
    description: 'Assistente especializado em UX/UI e produto',
    tags: ['Chat', 'IA', 'UX'],
    isBeta: true,
  },
];

const categories = ['Todos', 'Análise', 'UX', 'IA', 'UI', 'Produto', 'Documentação', 'Chat'];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredTools = tools.filter((tool) => {
    if (showFavorites && !tool.isFavorite) return false;
    if (selectedCategory === 'Todos') return true;
    return tool.tags.includes(selectedCategory);
  });

  return (
    <main className="flex-1 p-8 pt-16 md:pt-8">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Hub de Ferramentas</h1>
            <p>
              Explore nossas ferramentas especializadas em UX e Produto
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className={`button-style ${showFavorites ? 'bg-white/20' : ''}`}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <svg
                className="w-5 h-5"
                fill={showFavorites ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-[#A8E80E] text-black'
                  : 'bg-white/10 text-[#9ca3af] hover:bg-white/20'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </main>
  );
} 
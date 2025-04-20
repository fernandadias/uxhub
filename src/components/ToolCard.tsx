'use client';

import React from 'react';
import { Tool } from '../types/tool';
import Link from 'next/link';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[rgb(45,45,45)] bg-[#1f1e20] hover:border-[#A8E80E] transition-colors duration-200">
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">
            <Link href={tool.id === '1' ? '/heuristics/new' : '#'}>
              <span aria-hidden="true" className="absolute inset-0" />
              {tool.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2">
            {tool.isBeta && (
              <span className="inline-flex items-center rounded-full bg-[#A8E80E]/10 px-2 py-1 text-xs font-medium text-[#A8E80E]">
                Beta
              </span>
            )}
            <button
              type="button"
              className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill={tool.isFavorite ? 'currentColor' : 'none'}
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
        <p className="text-sm text-[#9ca3af]">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-[#9ca3af]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 
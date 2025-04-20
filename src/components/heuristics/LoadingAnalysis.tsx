import React from 'react';

export function LoadingAnalysis() {
  return (
    <div className="min-h-screen bg-[rgb(10,10,10)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#A8E80E] border-t-transparent animate-spin" />
            <div className="absolute inset-4 rounded-full border-4 border-[#A8E80E] border-b-transparent animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Analisando sua interface...</h1>
            <p className="text-lg text-[#9ca3af]">
              Estamos analisando cada detalhe da sua interface para identificar possíveis melhorias.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#A8E80E] rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-sm text-[#9ca3af]">Processando imagens e identificando padrões...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React from 'react';
import { HeuristicResult } from '../../types/heuristics';

interface AnalysisResultsProps {
  results: HeuristicResult[];
}

const getSeverityColor = (severity: HeuristicResult['severity']): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'low':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#9ca3af]">Nenhum resultado encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-[#1f1e20] rounded-lg border border-[rgb(45,45,45)] p-6 hover:border-[#A8E80E]/20 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">{result.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                result.severity
              )}`}
            >
              {result.severity}
            </span>
          </div>
          
          <p className="text-[#9ca3af] mb-4">{result.description}</p>
          
          {result.recommendations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-white mb-2">Recomendações:</h4>
              <ul className="list-disc list-inside space-y-1 text-[#9ca3af]">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 text-sm text-[#9ca3af]">
            Última atualização: {new Date(result.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}; 
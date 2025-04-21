export interface AnalysisContext {
  userId: string;
  productType: string;
  device: string;
  interactionType: string;
  flowType: string;
}

export interface Screenshot {
  url: string;
  description?: string;
}

export interface Violation {
  heuristic: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  productType: string;
  device: string;
  interactionType: string;
  flowType: string;
  violations: Violation[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
} 
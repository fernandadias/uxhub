export type ProductType = 'marketplace' | 'audio' | 'video' | 'saas' | 'social';
export type Device = 'web' | 'tablet' | 'mobile';
export type Priority = 'high' | 'medium' | 'low';

export interface AnalysisContext {
  productType: ProductType;
  device: Device;
  interactionType: string;
  flowType: string;
}

export interface Violation {
  heuristic: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  reason: string;
  priority: Priority;
  suggestions: string[];
  screenshotId: string;
}

export interface HeuristicAnalysis {
  id: string;
  userId: string;
  screenshots: {
    id: string;
    url: string;
    order: number;
    description?: string;
  }[];
  context: AnalysisContext;
  violations: Violation[];
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
} 
export type ProductType = 'marketplace' | 'social' | 'saas' | 'video' | 'audio' | 'finance';
export type Device = 'web' | 'tablet' | 'mobile';
export type Interaction = 'login' | 'onboarding' | 'consultation' | 'edition' | 'purchase' | 'deletion' | 'search' | 'social' | 'personalization' | 'support' | 'navigation' | 'sharing' | 'conclusion';
export type Flow = 'main' | 'alternative' | 'error' | 'shortcut' | 'exploratory' | 'confirmation' | 'return';

export interface ProductTypeOption {
  id: string;
  name: string;
  example: string;
  value: ProductType;
}

export interface DeviceOption {
  id: string;
  name: string;
  icon: string;
  value: Device;
}

export interface InteractionOption {
  id: string;
  name: string;
  example: string;
  value: Interaction;
}

export interface FlowOption {
  id: string;
  name: string;
  value: Flow;
}

export interface AnalysisDimensions {
  productType: ProductType;
  device: Device;
  interaction: Interaction;
  flow: Flow;
}

export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisualReference {
  element: string;
  position: string;
  context: string;
}

export interface Location {
  coordinates: Coordinates;
  visualReference: VisualReference;
}

export interface Severity {
  level: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  rationale: string;
}

export interface HeuristicViolation {
  heuristic: string;
  location: Location;
  severity: Severity;
  description: string;
  impact: string;
  recommendation: string;
}

export interface ImageAnalysis {
  sequence: number;
  type: 'start' | 'iteration' | 'end';
  violations: HeuristicViolation[];
}

export interface HeuristicScore {
  score: number;
  descriptor: string;
  description: string;
}

export interface AnalysisResult {
  metadata: {
    timestamp: string;
    frameworkVersion: string;
    analysisContext: AnalysisDimensions;
  };
  scores: {
    overall: HeuristicScore;
    byHeuristic: Record<string, HeuristicScore>;
  };
  analysis: {
    images: ImageAnalysis[];
  };
}

export interface Screenshot {
  id: string;
  url: string;
  sequence: number;
  type: 'start' | 'iteration' | 'end';
}

export interface HeuristicAudit {
  id: string;
  projectName: string;
  productType: ProductType;
  device: Device;
  interaction: Interaction;
  flow: Flow;
  screenshots: Screenshot[];
  analysisResult: AnalysisResult;
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = DeviceOption;
export type KeyInteraction = InteractionOption;
export type FlowType = FlowOption;

export const productTypes: ProductTypeOption[] = [
  { id: '1', name: 'Marketplace', example: 'e-commerce, loja virtual', value: 'marketplace' },
  { id: '2', name: 'Rede Social', example: 'Facebook, Instagram', value: 'social' },
  { id: '3', name: 'SaaS/Web App', example: 'Notion, Figma', value: 'saas' },
  { id: '4', name: 'Conteúdo de Vídeo', example: 'YouTube, Netflix', value: 'video' },
  { id: '5', name: 'Conteúdo de Áudio', example: 'Spotify, Podcast', value: 'audio' },
  { id: '6', name: 'Financeiro e Gestão', example: 'Nubank, Conta Azul', value: 'finance' }
];

export const devices: DeviceOption[] = [
  { id: '1', name: 'Web', icon: '🌐', value: 'web' },
  { id: '2', name: 'Tablet', icon: '📱', value: 'tablet' },
  { id: '3', name: 'Mobile', icon: '📱', value: 'mobile' }
];

export const keyInteractions: InteractionOption[] = [
  { id: '1', name: 'Criação', example: 'nova postagem, curso, produto', value: 'edition' },
  { id: '2', name: 'Personalização', example: 'ajustar preferências', value: 'personalization' }
];

export const flowTypes: FlowOption[] = [
  { id: '1', name: 'Principal / sucesso', value: 'main' },
  { id: '2', name: 'Alternativo / exceção', value: 'alternative' }
]; 
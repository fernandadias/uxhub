export type ProductType = {
  id: string;
  name: string;
  example: string;
};

export type DeviceType = {
  id: string;
  name: string;
  icon: string;
};

export type KeyInteraction = {
  id: string;
  name: string;
  example: string;
};

export type FlowType = {
  id: string;
  name: string;
};

export type Screenshot = {
  id: string;
  url: string;
  order: number;
  type: 'start' | 'iteration' | 'end';
};

export type HeuristicAudit = {
  id: string;
  projectName: string;
  productType: ProductType;
  device: DeviceType;
  keyInteraction: KeyInteraction;
  flowType: FlowType;
  screenshots: Screenshot[];
  createdAt: string;
  updatedAt: string;
};

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type HeuristicResult = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
  updatedAt: string;
};

// Mock data
export const productTypes: ProductType[] = [
  { id: '1', name: 'Marketplace', example: 'OLX, mercadoLivre' },
  { id: '2', name: 'Conteúdo em audio', example: 'Audible, Spotify' },
  { id: '3', name: 'Conteúdo em video', example: 'Netflix, YouTube' },
  { id: '4', name: 'SaaS / Web app', example: 'Notion, Canva' },
  { id: '5', name: 'Rede social', example: 'Instagram, LinkedIn' },
];

export const devices: DeviceType[] = [
  { id: '1', name: 'Web', icon: '🌐' },
  { id: '2', name: 'Tablet', icon: '📱' },
  { id: '3', name: 'Mobile', icon: '📱' },
];

export const keyInteractions: KeyInteraction[] = [
  { id: '1', name: 'Criação', example: 'nova postagem, curso, produto' },
  { id: '2', name: 'Personalização', example: 'ajustar preferências' },
  { id: '3', name: 'Exclusão', example: 'conta, produto, comentário' },
  { id: '4', name: 'Edição', example: 'alterar dados, conteúdo, perfil' },
  { id: '5', name: 'Login', example: 'autenticação' },
  { id: '6', name: 'Onboarding', example: 'orientação inicial ou reativação' },
  { id: '7', name: 'Compra', example: 'checkout, carrinho, pagamento' },
  { id: '8', name: 'Busca', example: 'pesquisa, filtro, navegação' },
  { id: '9', name: 'Cadastro', example: 'criação de conta' },
  { id: '10', name: 'Interação social', example: 'comentar, curtir' },
  { id: '11', name: 'Envio', example: 'formulário, arquivos, mensagens' },
  { id: '12', name: 'Solicitação de suporte', example: '' },
  { id: '13', name: 'Consulta/Leitura', example: 'ver conteúdo, relatório' },
];

export const flowTypes: FlowType[] = [
  { id: '1', name: 'Principal / sucesso' },
  { id: '2', name: 'Alternativo / exceção' },
  { id: '3', name: 'Erro / bloqueio' },
  { id: '4', name: 'Exploratório' },
  { id: '5', name: 'Retorno / recuperação' },
  { id: '6', name: 'Atalho ou acelerado' },
]; 
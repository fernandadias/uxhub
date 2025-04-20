export interface Tool {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isBeta?: boolean;
  isFavorite?: boolean;
} 
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
  provider?: string;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  prompt: string;
  category?: 'bio' | 'security' | 'projects' | 'interests' | 'fun' | 'roast';
}

export type ChatScreenState = 'welcome' | 'chat';

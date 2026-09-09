/**
 * KRISHNA.AI Configuration
 *
 * For GitHub Pages or static hosting, set VITE_API_URL during build or set
 * window.__KRISHNA_AI_API_URL__ in index.html to point to your deployed backend.
 *
 * Default: relative '/api/chat' for local / full-stack deployment.
 */

declare global {
  interface Window {
    __KRISHNA_AI_API_URL__?: string;
  }
}

export const APP_CONFIG = {
  appName: 'KRISHNA.AI',
  tagline: "You've found my digital twin.",
  subTagline: 'Ask me anything about Krishna.',
  defaultModel: 'google/gemma-4-26b-a4b-it:free',

  // API Endpoint - easily configurable for GitHub Pages
  getApiUrl: (): string => {
    if (typeof window !== 'undefined' && window.__KRISHNA_AI_API_URL__) {
      return window.__KRISHNA_AI_API_URL__;
    }
    const metaEnv = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
    const envUrl = metaEnv?.VITE_API_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl.trim();
    }
    return '/api/chat';
  },
};

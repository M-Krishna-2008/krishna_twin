import React from 'react';
import { Sparkles, Terminal, Flame, Shield, HelpCircle, Code, Lightbulb } from 'lucide-react';
import { SuggestedQuestion } from '../types';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
  variant?: 'grid' | 'chips';
}

const SUGGESTED_PROMPTS: SuggestedQuestion[] = [
  {
    id: 'who-is-krishna',
    label: 'Who is Krishna?',
    prompt: 'Who is Krishna?',
    category: 'bio',
  },
  {
    id: 'projects',
    label: 'What has Krishna built?',
    prompt: 'What has Krishna built?',
    category: 'projects',
  },
  {
    id: 'cybersecurity',
    label: 'Why cybersecurity?',
    prompt: 'Why cybersecurity?',
    category: 'security',
  },
  {
    id: 'learning',
    label: 'What is Krishna currently learning?',
    prompt: 'What is Krishna currently learning?',
    category: 'bio',
  },
  {
    id: 'interests',
    label: "What are Krishna's interests?",
    prompt: "What are Krishna's interests?",
    category: 'interests',
  },
  {
    id: 'fun-fact',
    label: 'Tell me something interesting',
    prompt: 'Tell me something interesting about Krishna.',
    category: 'fun',
  },
  {
    id: 'roast',
    label: 'Roast Krishna 💀',
    prompt: 'Roast Krishna 💀',
    category: 'roast',
  },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  disabled = false,
  variant = 'grid',
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
  };

  const handleSelect = (prompt: string) => {
    triggerHaptic();
    onSelectQuestion(prompt);
  };

  const getIcon = (category?: string, id?: string) => {
    if (id === 'roast') return <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    if (category === 'security') return <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    if (category === 'projects') return <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (category === 'fun') return <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    return <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  };

  // Horizontal chips variant (ideal for quick follow-ups above the input bar)
  if (variant === 'chips') {
    return (
      <div className="w-full overflow-x-auto no-scrollbar py-1 px-3 sm:px-4 flex items-center gap-1.5 touch-pan-x">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.id}
            id={`suggested-chip-${item.id}`}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(item.prompt)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-full text-xs font-mono transition-all border ${
              item.id === 'roast'
                ? 'bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 border-rose-800/40 active:scale-95'
                : 'bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 border-slate-800 hover:border-cyan-500/40 active:scale-95'
            } active:bg-cyan-950/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm`}
          >
            {getIcon(item.category, item.id)}
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Full Grid variant (used below the initial greeting)
  return (
    <div className="w-full max-w-2xl mx-auto my-2 px-1 sm:px-2">
      <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-wider text-cyan-400/70 uppercase px-1">
        <Terminal className="w-3.5 h-3.5" />
        <span>Suggested Prompts</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.id}
            id={`suggested-prompt-${item.id}`}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(item.prompt)}
            className={`flex items-center gap-2.5 px-3.5 py-3 min-h-[46px] text-left text-xs sm:text-sm rounded-xl transition-all duration-200 border ${
              item.id === 'roast'
                ? 'bg-rose-950/20 hover:bg-rose-950/40 text-rose-200 border-rose-800/40 hover:border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.1)] active:bg-rose-900/40'
                : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border-slate-800/80 hover:border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.06)] active:bg-slate-800'
            } active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            {getIcon(item.category, item.id)}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

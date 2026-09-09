import React from 'react';
import { ArrowLeft, RotateCcw, ShieldCheck, Terminal } from 'lucide-react';
import { APP_CONFIG } from '../config';

interface ChatHeaderProps {
  onBackToWelcome: () => void;
  onResetChat: () => void;
  messageCount: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBackToWelcome,
  onResetChat,
  messageCount,
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  const handleBack = () => {
    triggerHaptic();
    onBackToWelcome();
  };

  const handleReset = () => {
    triggerHaptic();
    onResetChat();
  };

  return (
    <header className="sticky top-0 z-20 w-full pt-[env(safe-area-inset-top,0px)] bg-[#080c14]/95 backdrop-blur-md border-b border-slate-800/80 shrink-0">
      <div className="h-14 sm:h-16 px-3 sm:px-6 max-w-3xl mx-auto flex items-center justify-between">
        {/* Left: Back to welcome */}
        <div className="flex items-center gap-2">
          <button
            id="btn-back-welcome"
            type="button"
            onClick={handleBack}
            aria-label="Back to welcome screen"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors active:scale-95 cursor-pointer"
            title="Back to Welcome Screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight font-mono">
                {APP_CONFIG.appName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 leading-none mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span>ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reset Chat button */}
        <div className="flex items-center gap-2">
          {messageCount > 0 && (
            <button
              id="btn-reset-chat"
              type="button"
              onClick={handleReset}
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-slate-800/80 hover:border-rose-900/50 transition-all active:scale-95 cursor-pointer"
              title="Clear and reset chat history"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

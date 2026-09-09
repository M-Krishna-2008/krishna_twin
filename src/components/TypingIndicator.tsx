import React from 'react';
import { Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className="w-full flex items-start gap-2.5 sm:gap-3 py-2 px-1"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
        <Terminal className="w-4 h-4 animate-pulse" />
      </div>

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-500">
          <span>KRISHNA.AI</span>
          <span>•</span>
          <span className="text-cyan-400">processing</span>
        </div>

        <div className="rounded-2xl rounded-tl-xs p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 text-slate-100 flex items-center gap-2 shadow-[0_0_15px_rgba(15,23,42,0.6)]">
          <span className="text-xs font-mono text-slate-400 mr-1">Thinking</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

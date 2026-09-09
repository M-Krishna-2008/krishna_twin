import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { APP_CONFIG } from '../config';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const handleStart = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
    onStartChat();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-6 sm:p-6 select-none overflow-hidden pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)]">
      {/* Subtle futuristic background cyber ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center my-auto"
      >
        {/* Status Indicator Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider mb-4 sm:mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>DIGITAL TWIN ONLINE</span>
        </motion.div>

        {/* Brand Icon / Avatar Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_24px_rgba(6,182,212,0.15)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-cyan-400/5 animate-pulse" />
          <Terminal className="w-7 h-7 sm:w-10 sm:h-10 text-cyan-400" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-white mb-2 sm:mb-3"
        >
          {APP_CONFIG.appName}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-base xs:text-lg sm:text-xl font-medium text-cyan-300/90 mb-2"
        >
          &ldquo;{APP_CONFIG.tagline}&rdquo;
        </motion.p>

        {/* Explanation */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-xs xs:text-sm sm:text-base text-slate-400 max-w-sm mb-6 sm:mb-8 leading-relaxed"
        >
          {APP_CONFIG.subTagline}
        </motion.p>

        {/* Prominent Start Chat Button */}
        <motion.button
          id="btn-start-chat"
          type="button"
          onClick={handleStart}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(6,182,212,0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer active:scale-95"
        >
          <span>START CHAT</span>
          <ArrowRight className="w-5 h-5 text-slate-950 transition-transform group-hover:translate-x-1" />
        </motion.button>

        {/* Subtle Cyber Details Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-mono"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/70" />
            Cybersecurity & Code
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400/70" />
            Verified Knowledge
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

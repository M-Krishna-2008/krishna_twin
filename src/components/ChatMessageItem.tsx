import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Terminal, User, Copy, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { ChatMessage } from '../types';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
  };

  const handleCopy = async () => {
    triggerHaptic();
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`group w-full flex items-start gap-2 sm:gap-3 py-1.5 px-0.5 sm:px-1 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-mono shadow-sm mt-0.5 ${
          isUser
            ? 'bg-slate-800 text-slate-300 border border-slate-700'
            : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
        }`}
      >
        {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
      </div>

      {/* Message Box */}
      <div className={`flex flex-col max-w-[88%] xs:max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Author / timestamp bar */}
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-slate-500">
          <span>{isUser ? 'You' : 'KRISHNA.AI'}</span>
          <span>•</span>
          <span>{formatTime(message.timestamp)}</span>
        </div>

        {/* Bubble */}
        <div
          className={`relative rounded-2xl p-3 sm:p-4 text-[14px] sm:text-[15px] leading-relaxed break-words shadow-sm transition-all ${
            isUser
              ? 'bg-cyan-950/70 border border-cyan-500/30 text-cyan-50 rounded-tr-xs'
              : message.isError
              ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-tl-xs'
              : 'bg-slate-900/80 border border-slate-800 text-slate-100 rounded-tl-xs shadow-[0_0_15px_rgba(15,23,42,0.6)]'
          }`}
        >
          {message.isError ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-rose-300 font-medium text-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{message.content}</span>
              </div>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    onRetry();
                  }}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-700/50 transition-colors active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          ) : isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="markdown-content text-slate-200 space-y-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 sm:[&_ol]:pl-5 [&_li]:my-1 [&_code]:bg-slate-950/80 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_pre]:bg-slate-950 [&_pre]:p-2.5 sm:[&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:my-2 [&_pre]:overflow-x-auto [&_a]:text-cyan-400 [&_a]:underline hover:[&_a]:text-cyan-300 [&_a]:break-all [&_strong]:text-white">
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {/* Copy action on non-error messages */}
          {!message.isError && (
            <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-slate-500">
              <span className="text-[10px] text-slate-500/80 truncate">
                {isUser ? '' : 'Digital Twin • memory.txt'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="opacity-80 active:opacity-100 hover:opacity-100 flex items-center gap-1 hover:text-cyan-300 p-1 -m-1 transition-opacity cursor-pointer touch-manipulation"
                title="Copy message"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

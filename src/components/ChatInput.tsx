import React, { useRef, useEffect } from 'react';
import { Send, Loader2, X } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled?: boolean;
  onFocus?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  disabled = false,
  onFocus,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap max height to around 120px
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        triggerHaptic();
        onSend();
      }
    }
  };

  const handleSendClick = () => {
    if (!isSendDisabled) {
      triggerHaptic();
      onSend();
    }
  };

  const handleClear = () => {
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const isSendDisabled = disabled || isLoading || !input.trim();

  return (
    <div className="w-full bg-[#080c14]/95 backdrop-blur-md border-t border-slate-800/80 px-2.5 pt-2 pb-[max(env(safe-area-inset-bottom,0px),10px)] sm:px-4 sm:pt-3">
      <div className="max-w-3xl mx-auto flex items-end gap-1.5 sm:gap-3 bg-slate-900/90 border border-slate-800 focus-within:border-cyan-500/50 rounded-2xl p-1.5 sm:p-2 shadow-[0_0_20px_rgba(15,23,42,0.8)] transition-all">
        <textarea
          ref={textareaRef}
          id="chat-message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          disabled={disabled || isLoading}
          placeholder="Ask me anything..."
          rows={1}
          enterKeyHint="send"
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base sm:text-sm px-2.5 sm:px-3 py-2 resize-none focus:outline-none max-h-[120px] min-h-[40px] leading-relaxed"
          style={{ fontSize: '16px' }} // Prevent iOS auto-zoom
        />

        {/* Mobile Clear Button */}
        {input.trim().length > 0 && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input text"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 active:scale-95 transition-colors cursor-pointer mb-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          id="btn-send-message"
          type="button"
          onClick={handleSendClick}
          disabled={isSendDisabled}
          aria-label="Send message"
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isSendDisabled
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-90'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-200" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="max-w-3xl mx-auto mt-1 px-2 flex items-center justify-between text-[10px] font-mono text-slate-600">
        <span className="hidden sm:inline">Press Enter to send, Shift + Enter for new line</span>
        <span className="sm:hidden">Tap send to chat</span>
        <span>KRISHNA.AI • Digital Twin</span>
      </div>
    </div>
  );
};

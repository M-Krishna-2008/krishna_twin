import React, { useState, useRef, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageItem } from './components/ChatMessageItem';
import { TypingIndicator } from './components/TypingIndicator';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { ChatInput } from './components/ChatInput';
import { ChatMessage, ChatScreenState } from './types';
import { APP_CONFIG } from './config';
import { getClientFallbackReply } from './clientMemoryFallback';

const INITIAL_AI_GREETING: ChatMessage = {
  id: 'greeting-msg',
  role: 'assistant',
  content:
    "Hey! I'm Krishna's digital twin.\n\nAsk me anything about Krishna—his background, cybersecurity focus, projects, or interests. Or tap any prompt below to get started!",
  timestamp: Date.now(),
};

export default function App() {
  const [screen, setScreen] = useState<ChatScreenState>('welcome');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_AI_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (screen === 'chat') {
      scrollToBottom('auto');
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'chat') {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawContent = textToSend ?? input;
    const trimmed = rawContent.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = APP_CONFIG.getApiUrl();
      
      // Send conversation payload
      const payloadMessages = newMessages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.message || data.text;

      if (!replyContent) {
        throw new Error('Empty response from AI service');
      }

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
        provider: data.provider,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Chat request fallback to client digital-twin memory:', err);
      try {
        const fallbackText = getClientFallbackReply(trimmed, newMessages);
        const fallbackMsg: ChatMessage = {
          id: `ai-local-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: Date.now(),
          provider: 'digital-twin-memory',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch {
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Krishna AI is temporarily offline. Try again in a moment.',
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove the error message
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_AI_GREETING,
        timestamp: Date.now(),
      },
    ]);
  };

  // If on welcome screen
  if (screen === 'welcome') {
    return (
      <main className="min-h-[100dvh] w-full bg-[#080c14] text-slate-100 flex flex-col justify-center">
        <WelcomeScreen onStartChat={() => setScreen('chat')} />
      </main>
    );
  }

  // Determine whether to show suggested prompts:
  // Show grid when there's only the greeting message or no user messages yet
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const showSuggestionsGrid = userMessageCount === 0;
  // Show quick follow-up chip bar on mobile/desktop when chat is active
  const showFollowUpChips = userMessageCount > 0 && !isLoading;

  const handleDismissKeyboard = (e: React.MouseEvent | React.TouchEvent) => {
    // Only dismiss if the click target is not an interactive element (e.g. button, link)
    const target = e.target as HTMLElement;
    if (target && !target.closest('button') && !target.closest('a') && !target.closest('textarea')) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 280);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#080c14] text-slate-100 overflow-hidden overscroll-none">
      {/* Header */}
      <ChatHeader
        onBackToWelcome={() => setScreen('welcome')}
        onResetChat={handleResetChat}
        messageCount={messages.length - 1}
      />

      {/* Main Chat Scrollable Area */}
      <main
        onClick={handleDismissKeyboard}
        onTouchStart={handleDismissKeyboard}
        className="flex-1 overflow-y-auto overscroll-y-contain px-2.5 sm:px-6 py-3 sm:py-4 space-y-2.5 sm:space-y-3 max-w-3xl w-full mx-auto touch-pan-y"
      >
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            onRetry={msg.isError ? handleRetry : undefined}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Suggested Prompts below greeting when chat is fresh */}
        {showSuggestionsGrid && !isLoading && (
          <div className="pt-2">
            <SuggestedQuestions
              variant="grid"
              onSelectQuestion={(q) => handleSendMessage(q)}
              disabled={isLoading}
            />
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </main>

      {/* Bottom Message Input Bar & Quick Mobile Chips */}
      <footer className="shrink-0 w-full bg-[#080c14]/95 border-t border-slate-800/80">
        {/* Quick follow-up chip carousel for active chat */}
        {showFollowUpChips && (
          <div className="max-w-3xl mx-auto pt-1.5 pb-0.5">
            <SuggestedQuestions
              variant="chips"
              onSelectQuestion={(q) => handleSendMessage(q)}
              disabled={isLoading}
            />
          </div>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isLoading={isLoading}
          onFocus={handleInputFocus}
        />
      </footer>
    </div>
  );
}

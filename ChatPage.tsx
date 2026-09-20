import React, { useState } from 'react';
import { sendMessageToGemini, Message } from '../services/gemini';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userPrompt = input.trim();
    setInput('');
    setError(null);

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userPrompt }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini({
        prompt: userPrompt,
        history: messages,
      });

      setMessages([...updatedMessages, { role: 'model', content: responseText }]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Bot className="w-12 h-12 mb-2 text-indigo-400" />
            <h2 className="text-xl font-semibold text-slate-200">NEXUS AI</h2>
            <p className="text-sm max-w-sm mt-1">Start a conversation powered by Google Gemini.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm p-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Thinking...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:hover:text-indigo-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

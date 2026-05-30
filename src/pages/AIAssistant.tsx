import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  User,
  Sparkles,
  FileText,
  Image,
  FileSpreadsheet,
  Loader2,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const suggestions = [
  { icon: FileText, text: 'Organize these invoices by date' },
  { icon: Image, text: 'Extract text from uploaded images' },
  { icon: FileSpreadsheet, text: 'Convert this PDF to Excel' },
  { icon: Sparkles, text: 'Summarize all documents from today' },
];

export default function AIAssistant() {
  const { company, user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${profile?.full_name?.split(' ')[0] || 'there'}! I'm your AI assistant. I can help you with:\n\n• Extract text from documents (OCR)\n• Organize and classify files\n• Convert between formats\n• Process invoices automatically\n• Summarize documents\n\nWhat would you like me to help you with?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    let response = '';

    if (userMessage.toLowerCase().includes('extract') || userMessage.toLowerCase().includes('ocr')) {
      response = "I'm ready to extract text from your documents.\n\nTo proceed, please:\n1. Upload the documents you want to process\n2. I'll automatically extract all text content\n3. You can then export the results to your preferred format\n\nWould you like me to process existing files or wait for new uploads?";
    } else if (userMessage.toLowerCase().includes('organize') || userMessage.toLowerCase().includes('classify')) {
      response = "I can help organize your documents automatically!\n\n**Organization options:**\n• By document type (invoices, contracts, reports)\n• By date\n• By client/customer\n• By project\n\nYour documents will be automatically tagged and sorted into appropriate folders. Shall I start organizing your recent uploads?";
    } else if (userMessage.toLowerCase().includes('convert') || userMessage.toLowerCase().includes('excel') || userMessage.toLowerCase().includes('pdf')) {
      response = "I can convert your documents to various formats:\n\n**Available conversions:**\n• PDF to Excel/CSV\n• PDF to searchable text\n• Image to PDF\n• Invoice to structured data\n• Scanned document to digital text\n\nJust upload the files you want to convert, and I'll handle the rest automatically.";
    } else if (userMessage.toLowerCase().includes('summarize') || userMessage.toLowerCase().includes('summary')) {
      response = "I'll create a comprehensive summary of your documents.\n\n**Summary includes:**\n• Key information extraction\n• Important dates and entities\n• Document topics\n• Action items\n\nProcessing your recent documents now...\n\n---\n✅ Summary ready! This would show actual document summaries once the AI backend is connected.";
    } else {
      response = "I understand you'd like help with that! Here's what I can do:\n\n1. **Data Extraction** - Pull structured data from unstructured documents\n2. **Document Processing** - Handle PDFs, images, spreadsheets\n3. **Automation** - Set up recurring tasks for regular documents\n4. **Analysis** - Provide insights on your document workflow\n\nCould you tell me more about what specific task you'd like to accomplish?";
    }

    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    await simulateAIResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">AI Assistant</h1>
          <p className="text-gray-400">Your intelligent data automation companion</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Ready
          </span>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl bg-gray-900/50 border border-gray-800 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div className={`flex-1 max-w-3xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                      : 'bg-gray-800/80 border border-gray-700 text-gray-200'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>

                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className={`text-xs text-gray-500 mt-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-gray-800/80 border border-gray-700">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                >
                  <suggestion.icon className="w-4 h-4 text-blue-400" />
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your documents..."
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none overflow-hidden"
                  style={{ minHeight: '48px', maxHeight: '200px' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
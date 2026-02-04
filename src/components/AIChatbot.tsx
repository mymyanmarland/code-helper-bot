import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSafe } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const auth = useAuthSafe();
  const user = auth?.user ?? null;

  // Load chat history from database
  const loadChatHistory = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  // Load history when chat opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user, loadChatHistory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Save message to database
  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          role,
          content
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const streamChat = async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Save user message to database
    await saveMessage('user', userMessage);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast({
            variant: "destructive",
            title: "Rate Limit",
            description: "တစ်မိနစ်လောက် စောင့်ပြီး ပြန်ကြိုးစားပါ",
          });
        } else if (response.status === 402) {
          toast({
            variant: "destructive",
            title: "Credit ကုန်သွားပါပြီ",
            description: "Credits ထပ်ဖြည့်ပါ",
          });
        } else {
          throw new Error(errorData.error || 'Failed to get response');
        }
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Final flush
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
            }
          } catch { /* ignore */ }
        }
      }

      if (assistantContent) {
        setMessages([...newMessages, { role: 'assistant', content: assistantContent }]);
        // Save assistant message to database
        await saveMessage('assistant', assistantContent);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "AI response ရယူရာတွင် မအောင်မြင်ပါ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    await streamChat(userMessage);
  };

  const clearChat = async () => {
    if (!user) {
      setMessages([]);
      return;
    }

    try {
      // Delete all messages for this user from database
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setMessages([]);
      toast({
        title: "Chat cleared",
        description: "Chat history ဖျက်ပြီးပါပြီ",
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Chat history ဖျက်ရာတွင် မအောင်မြင်ပါ",
      });
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terminal-prompt text-terminal-bg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-terminal-header rounded-lg border border-terminal-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-terminal-prompt" />
                <span className="font-bold text-terminal-fg">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="w-8 h-8 text-terminal-comment hover:text-terminal-fg hover:bg-terminal-border"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {isLoadingHistory ? (
                  <div className="text-center text-terminal-comment text-sm py-8">
                    <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                    <p>Loading chat history...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-terminal-comment text-sm py-8">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>မင်္ဂလာပါ! ကျွန်ုပ်က Dotfiles AI Assistant ပါ။</p>
                    <p className="mt-1">Terminal, Git, AI tools အကြောင်း မေးလို့ရပါတယ်။</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <motion.div
                      key={msg.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-terminal-prompt text-terminal-bg' 
                          : 'bg-terminal-border text-terminal-fg'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[75%] rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-terminal-prompt text-terminal-bg'
                          : 'bg-terminal-border text-terminal-fg'
                      }`}>
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm prose-invert max-w-none text-sm">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-terminal-border flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-terminal-fg animate-spin" />
                    </div>
                    <div className="bg-terminal-border rounded-lg px-3 py-2">
                      <span className="text-terminal-comment text-sm">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-terminal-border bg-terminal-bg">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 bg-terminal-header border-terminal-border text-terminal-fg placeholder:text-terminal-comment/50 focus:ring-terminal-prompt focus:border-terminal-prompt"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-terminal-prompt text-terminal-bg hover:bg-terminal-prompt/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

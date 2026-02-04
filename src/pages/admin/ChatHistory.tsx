import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Bot, RefreshCw, Search, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ChatMessage {
  id: string;
  user_id: string;
  role: string;
  content: string;
  created_at: string;
  username?: string;
}

const ChatHistory = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles!chat_messages_user_id_fkey(username)
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        // If foreign key doesn't exist, fetch without join
        const { data: messagesOnly, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);
        
        if (messagesError) throw messagesError;
        setMessages(messagesOnly || []);
      } else {
        const messagesWithUsername = (data || []).map(msg => ({
          ...msg,
          username: (msg as any).profiles?.username
        }));
        setMessages(messagesWithUsername);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Messages ရယူရာတွင် မအောင်မြင်ပါ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== messageId));
      toast({
        title: "Deleted",
        description: "Message ဖျက်ပြီးပါပြီ",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Message ဖျက်ရာတွင် မအောင်မြင်ပါ",
      });
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group messages by user
  const groupedByUser = filteredMessages.reduce((acc, msg) => {
    if (!acc[msg.user_id]) {
      acc[msg.user_id] = [];
    }
    acc[msg.user_id].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-comment" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-terminal-header border-terminal-border text-terminal-fg"
          />
        </div>
        <Button
          onClick={fetchMessages}
          variant="outline"
          className="border-terminal-border text-terminal-fg hover:bg-terminal-border"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-terminal-comment">
            Loading...
          </div>
        ) : Object.keys(groupedByUser).length === 0 ? (
          <div className="col-span-2 text-center py-8 text-terminal-comment">
            No messages found
          </div>
        ) : (
          Object.entries(groupedByUser).slice(0, 10).map(([userId, userMessages]) => (
            <motion.div
              key={userId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-terminal-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-terminal-prompt" />
                  <span className="font-medium text-terminal-fg">
                    {userMessages[0]?.username || userId.slice(0, 8) + '...'}
                  </span>
                </div>
                <span className="text-xs text-terminal-comment">
                  {userMessages.length} messages
                </span>
              </div>
              <ScrollArea className="h-[200px] p-4">
                <div className="space-y-3">
                  {userMessages.slice(0, 10).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-terminal-prompt/20' 
                          : 'bg-terminal-border'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-3 h-3 text-terminal-prompt" />
                        ) : (
                          <Bot className="w-3 h-3 text-terminal-fg" />
                        )}
                      </div>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-terminal-prompt/20 text-terminal-fg'
                          : 'bg-terminal-border text-terminal-fg'
                      }`}>
                        <p className="line-clamp-3">{msg.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-terminal-comment">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="text-red-400 hover:text-red-300 p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-terminal-header border-terminal-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-terminal-fg">Delete Message?</AlertDialogTitle>
                                <AlertDialogDescription className="text-terminal-comment">
                                  ဒီ message ကို ဖျက်မှာ သေချာပါသလား?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-terminal-border border-terminal-border text-terminal-fg">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMessage(msg.id)}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ChatHistory;

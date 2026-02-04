import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Stats {
  totalUsers: number;
  totalMessages: number;
  activeToday: number;
  messagesThisWeek: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalMessages: 0,
    activeToday: 0,
    messagesThisWeek: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total messages
      const { count: messagesCount } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      // Get messages from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get messages this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: weekMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      setStats({
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
        activeToday: todayMessages || 0,
        messagesThisWeek: weekMessages || 0
      });

      // Get chart data - messages per day for last 7 days
      const { data: recentMessages } = await supabase
        .from('chat_messages')
        .select('created_at')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true });

      // Group by day
      const dailyCounts: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-US', { weekday: 'short' });
        dailyCounts[key] = 0;
      }

      recentMessages?.forEach(msg => {
        const day = new Date(msg.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (dailyCounts[day] !== undefined) {
          dailyCounts[day]++;
        }
      });

      setChartData(Object.entries(dailyCounts).map(([name, messages]) => ({
        name,
        messages
      })));

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Statistics ရယူရာတွင် မအောင်မြင်ပါ",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { 
      icon: Users, 
      label: 'Total Users', 
      value: stats.totalUsers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      icon: MessageSquare, 
      label: 'Total Messages', 
      value: stats.totalMessages,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      icon: Activity, 
      label: 'Messages Today', 
      value: stats.activeToday,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    { 
      icon: TrendingUp, 
      label: 'This Week', 
      value: stats.messagesThisWeek,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 text-terminal-comment hover:text-terminal-fg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-terminal-header rounded-lg border border-terminal-border p-4"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-terminal-fg">
              {loading ? '...' : stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-terminal-comment">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-terminal-header rounded-lg border border-terminal-border p-6"
      >
        <h3 className="text-lg font-bold text-terminal-fg mb-4">Messages This Week</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#434c5e" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#3b4252', 
                  border: '1px solid #434c5e',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#e5e9f0' }}
              />
              <Bar dataKey="messages" fill="#88c0d0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;

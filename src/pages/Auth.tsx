import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Terminal, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIBackground from '@/components/AIBackground';
import { z } from 'zod';

const emailSchema = z.string().email("Valid email address ထည့်ပါ");
const passwordSchema = z.string().min(6, "Password အနည်းဆုံး 6 လုံး ရှိရမယ်");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Login မအောင်မြင်ပါ",
              description: "Email သို့မဟုတ် password မှားနေပါတယ်",
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              variant: "destructive",
              title: "Email မအတည်ပြုရသေးပါ",
              description: "သင့် email ကို verify လုပ်ပါ",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }
          return;
        }

        toast({
          title: "Login အောင်မြင်ပါပြီ!",
          description: "Welcome back!",
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username || email.split('@')[0],
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "Email ရှိပြီးသား",
              description: "ဒီ email နဲ့ account ရှိပြီးသားပါ။ Login လုပ်ပါ။",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }
          return;
        }

        toast({
          title: "Sign up အောင်မြင်ပါပြီ!",
          description: "သင့် email ကို verify link ပို့ပြီးပါပြီ။",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "တစ်ခုခု မှားသွားပါတယ်။ ပြန်ကြိုးစားပါ။",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono relative flex items-center justify-center">
      <AIBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-4"
      >
        <div className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="w-3 h-3 rounded-full bg-terminal-warning" />
              <span className="w-3 h-3 rounded-full bg-terminal-maximize" />
            </div>
            <div className="text-terminal-comment text-sm">
              {isLogin ? 'login' : 'signup'}@terminal
            </div>
            <div className="w-14" />
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-block mb-4"
              >
                <Terminal className="w-10 h-10 text-terminal-prompt" />
              </motion.div>
              <h1 className="text-xl font-bold text-terminal-fg">
                {isLogin ? 'Login' : 'Create Account'}
              </h1>
              <p className="text-terminal-comment text-sm mt-1">
                {isLogin ? 'AI Chatbot ကိုသုံးဖို့ login လုပ်ပါ' : 'Account အသစ်ဖွင့်ပါ'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-terminal-comment flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username (optional)
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="bg-terminal-bg border-terminal-border text-terminal-fg placeholder:text-terminal-comment/50 focus:ring-terminal-prompt focus:border-terminal-prompt"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-terminal-comment flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  className="bg-terminal-bg border-terminal-border text-terminal-fg placeholder:text-terminal-comment/50 focus:ring-terminal-prompt focus:border-terminal-prompt"
                  required
                />
                {errors.email && (
                  <p className="text-terminal-error text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-terminal-comment flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className="bg-terminal-bg border-terminal-border text-terminal-fg placeholder:text-terminal-comment/50 focus:ring-terminal-prompt focus:border-terminal-prompt"
                  required
                />
                {errors.password && (
                  <p className="text-terminal-error text-xs">{errors.password}</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-terminal-prompt text-terminal-bg hover:bg-terminal-prompt/90 font-bold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Processing...
                    </span>
                  ) : (
                    isLogin ? '$ login' : '$ signup'
                  )}
                </Button>
              </motion.div>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-terminal-prompt hover:text-terminal-prompt/80 text-sm transition-colors"
              >
                {isLogin ? "Account မရှိသေးဘူးလား? Sign up" : "Account ရှိပြီးသားလား? Login"}
              </button>
            </div>

            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-terminal-comment hover:text-terminal-fg transition-colors text-sm mx-auto"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

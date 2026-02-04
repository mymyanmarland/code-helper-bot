import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Github, Terminal, Download, ExternalLink, LogOut, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AIBackground from '@/components/AIBackground';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const Index = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const installCommand = `git clone https://github.com/mymyanmarland/code-helper-bot.git ~/dotfiles
cd ~/dotfiles/dotfiles
chmod +x install.sh
./install.sh`;

  const aiToolsCommand = `cd ~/dotfiles/dotfiles
chmod +x install-ai-tools.sh
./install-ai-tools.sh`;

  const features = [
    { icon: '🎨', title: 'Nord Theme', desc: 'Arctic-inspired color palette' },
    { icon: '⚡', title: 'Powerline Prompt', desc: 'Git, Python, Node, Docker info' },
    { icon: '🤖', title: 'AI Tools', desc: 'Claude, Aider, Copilot, Ollama' },
    { icon: '🔧', title: 'Git Aliases', desc: '50+ shortcuts for Git workflow' },
    { icon: '📦', title: 'NPM/Yarn/Bun', desc: 'Web development shortcuts' },
    { icon: '🐳', title: 'Docker & K8s', desc: 'Container management aliases' },
  ];

  const quickCommands = [
    { cmd: 'cc', desc: 'claude code' },
    { cmd: 'ai', desc: 'aider' },
    { cmd: 'ghcs', desc: 'copilot suggest' },
    { cmd: 'gs', desc: 'git status' },
    { cmd: 'nrd', desc: 'npm run dev' },
    { cmd: 'dcu', desc: 'docker compose up' },
  ];

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono overflow-hidden relative">
      <AIBackground />
      
      {/* Auth Button - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {isAdmin && (
          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-terminal-header border border-terminal-border rounded-lg text-terminal-fg hover:border-terminal-prompt transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-4 h-4 text-terminal-prompt" />
            <span className="hidden md:inline">Admin</span>
          </motion.button>
        )}
        <span className="text-terminal-comment text-sm hidden md:block">
          {user?.email}
        </span>
        <motion.button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 bg-terminal-header border border-terminal-border rounded-lg text-terminal-fg hover:border-terminal-prompt transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </motion.button>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Terminal className="w-12 h-12 text-terminal-prompt" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-terminal-fg">
            ငါ့ရဲ့စိတ်ကြိုက် Dotfiles
          </h1>
          <p className="text-terminal-comment">
            Bash configuration with Powerline prompt, Nord theme, and 100+ aliases
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="install" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-5 bg-terminal-header border border-terminal-border mb-6">
              <TabsTrigger value="install" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                🚀 Install
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                ✨ Features
              </TabsTrigger>
              <TabsTrigger value="guide" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                📖 Guide
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                🔑 API Keys
              </TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                📁 Files
              </TabsTrigger>
            </TabsList>

            {/* Install Tab */}
            <TabsContent value="install" className="space-y-6">
              {/* Quick Install */}
              <motion.div 
                className="bg-terminal-header rounded-lg p-6 border border-terminal-border hover:border-terminal-prompt/50 transition-colors duration-300"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-terminal-comment text-sm">Quick Install</span>
                  <motion.button
                    onClick={() => copyToClipboard(installCommand, 'install')}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-terminal-border hover:bg-terminal-comment/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedSection === 'install' ? (
                      <><Check className="w-4 h-4 text-terminal-directory" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </motion.button>
                </div>
                <pre className="text-terminal-prompt overflow-x-auto text-sm">
                  <code>{installCommand}</code>
                </pre>
              </motion.div>

              {/* AI Tools Install */}
              <motion.div 
                className="bg-terminal-header rounded-lg p-6 border border-terminal-border hover:border-terminal-prompt/50 transition-colors duration-300"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-terminal-comment text-sm">🤖 AI Tools Install (Optional)</span>
                  <motion.button
                    onClick={() => copyToClipboard(aiToolsCommand, 'ai-tools')}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-terminal-border hover:bg-terminal-comment/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedSection === 'ai-tools' ? (
                      <><Check className="w-4 h-4 text-terminal-directory" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </motion.button>
                </div>
                <pre className="text-terminal-prompt overflow-x-auto text-sm">
                  <code>{aiToolsCommand}</code>
                </pre>
                <p className="text-terminal-comment text-sm mt-3">
                  Claude Code, Aider, GitHub Copilot, Ollama နှင့် အခြား AI tools များကို install လုပ်ပေးပါမည်
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.a
                  href="/dotfiles/.bashrc"
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-terminal-prompt text-terminal-bg rounded-lg font-bold"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(136, 192, 208, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5" />
                  Download .bashrc
                </motion.a>
                <motion.a
                  href="https://github.com/mymyanmarland/code-helper-bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-terminal-border rounded-lg hover:border-terminal-comment transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </motion.a>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-8">
              {/* Features Grid */}
              <div>
                <motion.h2 
                  className="text-xl font-bold mb-4 text-terminal-directory"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ✨ Features Included
                </motion.h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="bg-terminal-header border border-terminal-border rounded-lg p-4 hover:border-terminal-prompt transition-colors cursor-pointer"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div 
                        className="text-2xl mb-2"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="font-bold text-terminal-fg mb-1">{feature.title}</h3>
                      <p className="text-sm text-terminal-comment">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Quick Commands */}
              <div>
                <motion.h2 
                  className="text-xl font-bold mb-4 text-terminal-directory"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  ⌨️ Quick Commands
                </motion.h2>
                <motion.div 
                  className="bg-terminal-header border border-terminal-border rounded-lg overflow-hidden"
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-terminal-border">
                    {quickCommands.map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="p-4 hover:bg-terminal-border/30 transition-colors cursor-pointer"
                        whileHover={{ backgroundColor: "rgba(67, 76, 94, 0.5)" }}
                      >
                        <code className="text-terminal-prompt font-bold">{item.cmd}</code>
                        <span className="text-terminal-comment ml-2">→ {item.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <p className="text-center text-terminal-comment mt-3 text-sm">
                  Type <code className="text-terminal-warning">help-me</code> or <code className="text-terminal-warning">ai-help</code> in terminal for full reference
                </p>
              </div>

              {/* Terminal Preview */}
              <div>
                <motion.h2 
                  className="text-xl font-bold mb-4 text-terminal-directory"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  🖥️ Prompt Preview
                </motion.h2>
                <motion.div 
                  className="bg-terminal-header rounded-lg overflow-hidden border border-terminal-border"
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border">
                    <motion.span 
                      className="w-3 h-3 rounded-full bg-destructive"
                      whileHover={{ scale: 1.3 }}
                    />
                    <motion.span 
                      className="w-3 h-3 rounded-full bg-terminal-warning"
                      whileHover={{ scale: 1.3 }}
                    />
                    <motion.span 
                      className="w-3 h-3 rounded-full bg-terminal-maximize"
                      whileHover={{ scale: 1.3 }}
                    />
                    <span className="text-terminal-comment text-sm ml-2">Terminal</span>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <span className="text-terminal-prompt font-bold">user</span>
                      <span className="text-terminal-comment">@</span>
                      <span className="text-terminal-directory">linux-terminal</span>
                      <span className="text-terminal-comment"> ❯ </span>
                      <span className="text-[#8FBCBB] font-bold">~/projects/my-app</span>
                      <span className="text-[#A3BE8C]"> main ●</span>
                      <span className="text-[#A3BE8C]"> ⬢ 20.10.0</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <span className="text-[#B48EAD]">❯</span>
                      <span className="text-terminal-fg ml-2">npm run dev</span>
                      <motion.span 
                        className="ml-1 inline-block"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ▋
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

          {/* Myanmar Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <h2 className="text-xl font-bold text-terminal-directory">📖 မြန်မာလို အသုံးပြုနည်း လမ်းညွှန်</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-terminal-prompt pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-terminal-prompt font-bold mb-2">အဆင့် ၁: Repository ကို Clone လုပ်ပါ</h3>
                <p className="text-terminal-comment mb-2 text-sm">
                  Terminal ကိုဖွင့်ပြီး အောက်ပါ command ကို ရိုက်ထည့်ပါ။
                </p>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                  git clone https://github.com/mymyanmarland/code-helper-bot.git ~/dotfiles
                </pre>
              </div>

              <div className="border-l-4 border-terminal-directory pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-terminal-directory font-bold mb-2">အဆင့် ၂: Dotfiles folder ထဲသို့ ဝင်ပါ</h3>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                  cd ~/dotfiles/dotfiles
                </pre>
              </div>

              <div className="border-l-4 border-terminal-warning pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-terminal-warning font-bold mb-2">အဆင့် ၃: Install Script ကို Run ပါ</h3>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
{`chmod +x install.sh
./install.sh`}
                </pre>
              </div>

              <div className="border-l-4 border-[#A3BE8C] pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-[#A3BE8C] font-bold mb-2">အဆင့် ၄: AI Tools များကို Install လုပ်ပါ (Optional)</h3>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
{`chmod +x install-ai-tools.sh
./install-ai-tools.sh`}
                </pre>
              </div>

              <div className="border-l-4 border-[#B48EAD] pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-[#B48EAD] font-bold mb-2">အဆင့် ၅: Terminal ကို Reload လုပ်ပါ</h3>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                  source ~/.bashrc
                </pre>
              </div>

              <div className="bg-terminal-bg/50 rounded-lg p-4">
                <h4 className="text-terminal-prompt font-bold mb-2">💡 အကြံပြုချက်များ</h4>
                <ul className="text-terminal-comment text-sm space-y-1">
                  <li>• <code className="text-terminal-warning">help-me</code> ကို ရိုက်ပြီး command အားလုံးကို ကြည့်နိုင်ပါတယ်</li>
                  <li>• <code className="text-terminal-warning">ai-help</code> ကို ရိုက်ပြီး AI tools commands တွေကို ကြည့်နိုင်ပါတယ်</li>
                  <li>• API keys တွေကို <code className="text-terminal-warning">~/.bash_secrets</code> file ထဲမှာ သိမ်းပါ</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <h2 className="text-xl font-bold text-terminal-directory">🔑 API Keys Setup Guide</h2>
            
            <div className="space-y-4">
              {/* Claude */}
              <div className="border-l-4 border-[#D08770] pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-[#D08770] font-bold mb-2">🤖 Claude Code (Anthropic)</h3>
                <p className="text-terminal-comment mb-2 text-sm">Claude Code အတွက် Anthropic API key လိုအပ်ပါတယ်။</p>
                <div className="space-y-1 text-sm">
                  <p>1. <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-terminal-prompt hover:underline">console.anthropic.com</a> မှာ account ဖွင့်ပါ</p>
                  <p>2. API Keys section မှာ key အသစ်ဖန်တီးပါ</p>
                </div>
                <pre className="bg-terminal-bg p-2 rounded text-terminal-prompt text-sm mt-2 overflow-x-auto">
                  export ANTHROPIC_API_KEY="sk-ant-xxxxx"
                </pre>
              </div>

              {/* OpenAI & Codex */}
              <div className="border-l-4 border-terminal-prompt pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-terminal-prompt font-bold mb-2">💬 OpenAI (GPT-4, Codex, Aider)</h3>
                <p className="text-terminal-comment mb-2 text-sm">Aider, Codex နဲ့ GPT models တွေအတွက် OpenAI API key လိုအပ်ပါတယ်။</p>
                <div className="space-y-1 text-sm">
                  <p>1. <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-terminal-prompt hover:underline">platform.openai.com/api-keys</a> သို့သွားပါ</p>
                  <p>2. "Create new secret key" နှိပ်ပြီး key ဖန်တီးပါ</p>
                  <p className="text-terminal-comment mt-1">💡 Codex CLI: <code className="text-terminal-warning">npm install -g @openai/codex</code></p>
                </div>
                <pre className="bg-terminal-bg p-2 rounded text-terminal-prompt text-sm mt-2 overflow-x-auto">
                  export OPENAI_API_KEY="sk-xxxxx"
                </pre>
              </div>

              {/* GitHub Copilot */}
              <div className="border-l-4 border-terminal-directory pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-terminal-directory font-bold mb-2">🐙 GitHub Copilot</h3>
                <p className="text-terminal-comment mb-2 text-sm">GitHub Copilot CLI အတွက် GitHub account နဲ့ Copilot subscription လိုအပ်ပါတယ်။</p>
                <pre className="bg-terminal-bg p-2 rounded text-terminal-prompt text-sm overflow-x-auto">
{`gh auth login
gh extension install github/gh-copilot`}
                </pre>
              </div>

              {/* Ollama */}
              <div className="border-l-4 border-[#B48EAD] pl-4 bg-terminal-header rounded-r-lg p-4">
                <h3 className="text-[#B48EAD] font-bold mb-2">🦙 Ollama (Local LLMs - Free!)</h3>
                <p className="text-terminal-comment mb-2 text-sm">Ollama က local မှာ run တာဖြစ်လို့ API key မလိုပါဘူး။</p>
                <pre className="bg-terminal-bg p-2 rounded text-terminal-prompt text-sm overflow-x-auto">
{`curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
ollama run llama3.2`}
                </pre>
              </div>

              {/* Template */}
              <div className="bg-terminal-bg/50 rounded-lg p-4">
                <h4 className="text-terminal-warning font-bold mb-2">📄 ~/.bash_secrets Template</h4>
                <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-xs overflow-x-auto">
{`# ~/.bash_secrets - Keep this file private!

export ANTHROPIC_API_KEY="sk-ant-xxxxx"
export OPENAI_API_KEY="sk-xxxxx"
export GOOGLE_API_KEY="xxxxx"
export AIDER_MODEL="claude-3-5-sonnet-20241022"`}
                </pre>
              </div>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <h2 className="text-xl font-bold text-terminal-directory">📁 Files Included</h2>
            <div className="bg-terminal-header border border-terminal-border rounded-lg p-6">
              <pre className="text-terminal-comment text-sm">
{`dotfiles/
├── .bashrc              # Main config + prompt + aliases
├── .bash_aliases        # Additional aliases
├── .ai_aliases          # AI tools: Claude, Aider, Copilot
├── .bash_secrets.template # API keys template
├── .gitconfig           # Git configuration + aliases
├── .gitignore_global    # Global git ignore patterns
├── install.sh           # Main installation script
├── install-ai-tools.sh  # AI CLI tools installer
└── README.md            # Documentation`}
              </pre>
            </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        {/* Footer */}
        <motion.div 
          className="text-center mt-12 text-terminal-comment text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>Made with <motion.span 
            className="inline-block text-destructive"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >❤️</motion.span> for productive terminal experiences</p>
          <p className="mt-2">
            <motion.a 
              href="https://github.com/mymyanmarland/code-helper-bot" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-terminal-prompt hover:underline inline-flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              Fork on GitHub <ExternalLink className="w-3 h-3" />
            </motion.a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

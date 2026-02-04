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
            <TabsList className="grid w-full grid-cols-6 bg-terminal-header border border-terminal-border mb-6">
              <TabsTrigger value="install" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                🚀 Install
              </TabsTrigger>
              <TabsTrigger value="build-guide" className="data-[state=active]:bg-terminal-prompt data-[state=active]:text-terminal-bg text-xs md:text-sm transition-all duration-300">
                📚 Build
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

            {/* Build Guide Tab - Complete Dotfiles Creation Guide */}
            <TabsContent value="build-guide" className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-bold text-terminal-directory mb-2">📚 Dotfiles တည်ဆောက်နည်း အပြည့်အစုံ</h2>
                <p className="text-terminal-comment mb-6">
                  သင့်ကိုယ်ပိုင် dotfiles များကို အစမှ တည်ဆောက်နည်း အဆင့်ဆင့် လမ်းညွှန်ချက်
                </p>
              </motion.div>

              {/* Part 1: Understanding Dotfiles */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
              >
                <div className="bg-terminal-prompt/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-terminal-prompt font-bold text-lg">အပိုင်း ၁: Dotfiles ဆိုတာ ဘာလဲ?</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-terminal-fg">
                    Dotfiles များသည် Unix/Linux systems တွင် <code className="text-terminal-warning">.</code> (dot) ဖြင့် စတင်သော configuration files များဖြစ်သည်။ 
                    ၎င်းတို့သည် default အားဖြင့် hidden files များဖြစ်ပြီး terminal, shell, git, editors စသည်တို့ကို customize လုပ်ရာတွင် အသုံးပြုသည်။
                  </p>
                  
                  <div className="bg-terminal-bg rounded-lg p-4">
                    <h4 className="text-terminal-directory font-bold mb-2">အဓိက Dotfiles များ:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-terminal-prompt">•</span>
                        <span><code className="text-terminal-warning">.bashrc</code> - Bash shell configuration (aliases, prompt, environment variables)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terminal-prompt">•</span>
                        <span><code className="text-terminal-warning">.bash_aliases</code> - Custom command shortcuts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terminal-prompt">•</span>
                        <span><code className="text-terminal-warning">.gitconfig</code> - Git settings (user info, aliases, preferences)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terminal-prompt">•</span>
                        <span><code className="text-terminal-warning">.gitignore_global</code> - Global ignore patterns for Git</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-terminal-prompt">•</span>
                        <span><code className="text-terminal-warning">.bash_secrets</code> - API keys နှင့် sensitive data (git ignore လုပ်ထားသည်)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-terminal-directory/10 border border-terminal-directory/30 rounded-lg p-4">
                    <h4 className="text-terminal-directory font-bold mb-2">💡 Dotfiles သုံးခြင်း အကျိုးကျေးဇူးများ:</h4>
                    <ul className="text-terminal-comment text-sm space-y-1">
                      <li>✓ မည်သည့် computer မှာမဆို တူညီသော terminal experience ရနိုင်သည်</li>
                      <li>✓ GitHub Codespaces တွင် automatic setup ဖြစ်သည်</li>
                      <li>✓ Version control ဖြင့် changes များကို track လုပ်နိုင်သည်</li>
                      <li>✓ အခြားသူများနှင့် share လုပ်နိုင်သည်</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Part 2: Creating .bashrc */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-terminal-directory/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-terminal-directory font-bold text-lg">အပိုင်း ၂: .bashrc ဖန်တီးနည်း</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-terminal-fg text-sm">
                    .bashrc သည် Bash shell ဖွင့်တိုင်း အလိုအလျောက် run သည့် configuration file ဖြစ်သည်။
                  </p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-terminal-prompt pl-4">
                      <h4 className="text-terminal-prompt font-bold mb-2">အဆင့် ၂.၁: Environment Variables သတ်မှတ်ခြင်း</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# Editor settings
export EDITOR='code'
export VISUAL='code'

# History settings
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoreboth:erasedups

# Path additions
export PATH="$HOME/bin:$HOME/.local/bin:$PATH"`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-terminal-directory pl-4">
                      <h4 className="text-terminal-directory font-bold mb-2">အဆင့် ၂.၂: Color Theme (Nord) သတ်မှတ်ခြင်း</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# Nord Color Palette
NORD0='\\033[38;2;46;52;64m'     # Polar Night (dark)
NORD4='\\033[38;2;216;222;233m'  # Snow Storm (light text)
NORD8='\\033[38;2;136;192;208m'  # Frost (cyan)
NORD11='\\033[38;2;191;97;106m'  # Aurora (red)
NORD14='\\033[38;2;163;190;140m' # Aurora (green)
RESET='\\033[0m'`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-terminal-warning pl-4">
                      <h4 className="text-terminal-warning font-bold mb-2">အဆင့် ၂.၃: Powerline Prompt ဖန်တီးခြင်း</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# Git branch function
parse_git_branch() {
    git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/ \\1/'
}

# Custom prompt
PS1='\\[\\033[38;2;136;192;208m\\]\\u\\[\\033[0m\\]'
PS1+='@\\[\\033[38;2;129;161;193m\\]\\h\\[\\033[0m\\] '
PS1+='\\[\\033[38;2;143;188;187m\\]\\w\\[\\033[0m\\]'
PS1+='\\[\\033[38;2;163;190;140m\\]$(parse_git_branch)\\[\\033[0m\\]'
PS1+='\\n\\[\\033[38;2;180;142;173m\\]❯\\[\\033[0m\\] '
export PS1`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-[#A3BE8C] pl-4">
                      <h4 className="text-[#A3BE8C] font-bold mb-2">အဆင့် ၂.၄: Aliases Source လုပ်ခြင်း</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# Load additional alias files
[ -f ~/.bash_aliases ] && source ~/.bash_aliases
[ -f ~/.ai_aliases ] && source ~/.ai_aliases
[ -f ~/.bash_secrets ] && source ~/.bash_secrets`}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Part 3: Creating Aliases */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-terminal-warning/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-terminal-warning font-bold text-lg">အပိုင်း ၃: Aliases ဖန်တီးနည်း</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-terminal-fg text-sm">
                    Aliases များသည် ရှည်လျားသော commands များကို အတိုကောက် အဖြစ် သတ်မှတ်ခြင်း ဖြစ်သည်။
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-terminal-bg rounded-lg p-4">
                      <h4 className="text-terminal-directory font-bold mb-2">📂 .bash_aliases (Git Commands)</h4>
                      <pre className="text-xs overflow-x-auto">
{`# Git shortcuts
alias gs='git status'
alias ga='git add'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline -10'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gd='git diff'
alias gst='git stash'
alias gstp='git stash pop'`}
                      </pre>
                    </div>

                    <div className="bg-terminal-bg rounded-lg p-4">
                      <h4 className="text-terminal-directory font-bold mb-2">📦 Web Development</h4>
                      <pre className="text-xs overflow-x-auto">
{`# NPM shortcuts
alias ni='npm install'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'

# Yarn shortcuts
alias ya='yarn add'
alias yd='yarn dev'

# Bun shortcuts
alias bi='bun install'
alias brd='bun run dev'`}
                      </pre>
                    </div>

                    <div className="bg-terminal-bg rounded-lg p-4">
                      <h4 className="text-terminal-directory font-bold mb-2">🐳 Docker Commands</h4>
                      <pre className="text-xs overflow-x-auto">
{`# Docker shortcuts
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dimg='docker images'
alias dcu='docker compose up -d'
alias dcd='docker compose down'
alias dlog='docker logs -f'
alias dex='docker exec -it'
alias dprune='docker system prune -af'`}
                      </pre>
                    </div>

                    <div className="bg-terminal-bg rounded-lg p-4">
                      <h4 className="text-terminal-directory font-bold mb-2">🐍 Python Commands</h4>
                      <pre className="text-xs overflow-x-auto">
{`# Python shortcuts
alias py='python3'
alias pip='pip3'
alias venv='python3 -m venv venv'
alias va='source venv/bin/activate'
alias pir='pip install -r requirements.txt'
alias pyt='pytest'
alias djr='python manage.py runserver'`}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Part 4: AI Aliases */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-[#B48EAD]/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-[#B48EAD] font-bold text-lg">အပိုင်း ၄: AI Tools Aliases (.ai_aliases)</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-terminal-fg text-sm">
                    AI coding tools များအတွက် သီးသန့် aliases file ဖန်တီးပါ။
                  </p>

                  <pre className="bg-terminal-bg p-4 rounded text-xs overflow-x-auto">
{`# ═══════════════════════════════════════════════════════════
# AI CODING TOOLS ALIASES
# ═══════════════════════════════════════════════════════════

# Claude Code (Anthropic)
alias cc='claude'
alias ccc='claude --continue'
alias ccs='claude --sync'
alias ccv='claude --version'

# Aider (AI Pair Programming)
alias ai='aider'
alias aic='aider --claude'
alias aig='aider --gpt-4'
alias aio='aider --ollama'
alias aih='aider --help'

# GitHub Copilot CLI
alias ghcs='gh copilot suggest'
alias ghce='gh copilot explain'

# OpenAI Codex CLI
alias codex='npx @openai/codex'

# Ollama (Local LLMs)
alias ol='ollama'
alias olr='ollama run'
alias oll='ollama list'
alias olp='ollama pull'
alias ols='ollama serve'

# Quick AI Commands
alias ask='gh copilot suggest -t shell'
alias explain='gh copilot explain'

# Help function
ai-help() {
    echo "╭───────────────────────────────────────────────╮"
    echo "│       🤖 AI Coding Tools Quick Reference      │"
    echo "╰───────────────────────────────────────────────╯"
    echo ""
    echo "  Claude:   cc (claude) | ccc (continue) | ccs (sync)"
    echo "  Aider:    ai | aic (claude) | aig (gpt-4) | aio (ollama)"
    echo "  Copilot:  ghcs (suggest) | ghce (explain)"
    echo "  Ollama:   ol | olr (run) | oll (list) | olp (pull)"
    echo ""
}`}
                  </pre>
                </div>
              </motion.div>

              {/* Part 5: Git Configuration */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-[#D08770]/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-[#D08770] font-bold text-lg">အပိုင်း ၅: .gitconfig ဖန်တီးနည်း</h3>
                </div>
                <div className="p-4 space-y-4">
                  <pre className="bg-terminal-bg p-4 rounded text-xs overflow-x-auto">
{`[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = code --wait
    autocrlf = input
    excludesfile = ~/.gitignore_global

[init]
    defaultBranch = main

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --decorate -10
    last = log -1 HEAD
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
    amend = commit --amend --no-edit
    
[color]
    ui = auto
    
[push]
    default = current
    autoSetupRemote = true

[pull]
    rebase = false`}
                  </pre>
                </div>
              </motion.div>

              {/* Part 6: Install Script */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-[#A3BE8C]/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-[#A3BE8C] font-bold text-lg">အပိုင်း ၆: Install Script ဖန်တီးနည်း</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-terminal-fg text-sm">
                    dotfiles များကို မည်သည့် machine မှာမဆို လွယ်ကူစွာ install လုပ်နိုင်ရန် script ဖန်တီးပါ။
                  </p>

                  <pre className="bg-terminal-bg p-4 rounded text-xs overflow-x-auto">
{`#!/bin/bash

# ═══════════════════════════════════════════════════════════
# Dotfiles Installation Script
# ═══════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m'

echo "🚀 Installing dotfiles..."

# Get script directory
DOTFILES_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

# Backup and link function
backup_and_link() {
    local source="$1"
    local target="$2"
    
    if [ -f "$target" ]; then
        echo -e "\${YELLOW}→ Backing up $target\${NC}"
        mv "$target" "$target.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    echo -e "\${GREEN}✓ Linking $source → $target\${NC}"
    ln -sf "$source" "$target"
}

# Install dotfiles
backup_and_link "$DOTFILES_DIR/.bashrc" "$HOME/.bashrc"
backup_and_link "$DOTFILES_DIR/.bash_aliases" "$HOME/.bash_aliases"
backup_and_link "$DOTFILES_DIR/.ai_aliases" "$HOME/.ai_aliases"
backup_and_link "$DOTFILES_DIR/.gitconfig" "$HOME/.gitconfig"
backup_and_link "$DOTFILES_DIR/.gitignore_global" "$HOME/.gitignore_global"

# Reload bash
source "$HOME/.bashrc"

echo ""
echo "✅ Installation complete!"
echo "   Run: source ~/.bashrc"
echo "   Type: help-me for commands"`}
                  </pre>
                </div>
              </motion.div>

              {/* Part 7: Secrets Management */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-destructive/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-destructive font-bold text-lg">အပိုင်း ၇: API Keys & Secrets စီမံခန့်ခွဲခြင်း</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
                    <h4 className="text-destructive font-bold mb-2">⚠️ အရေးကြီးသော သတိပေးချက်</h4>
                    <p className="text-terminal-comment text-sm">
                      API keys များကို .bashrc သို့မဟုတ် repository ထဲတွင် မထည့်ပါနှင့်။ 
                      သီးသန့် .bash_secrets file ဖန်တီးပြီး .gitignore တွင် ထည့်ထားပါ။
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-terminal-prompt pl-4">
                      <h4 className="text-terminal-prompt font-bold mb-2">၁. .bash_secrets.template ဖန်တီးပါ</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# ~/.bash_secrets - Keep this file private!
# Copy to ~/.bash_secrets and fill in your keys

# AI API Keys
export ANTHROPIC_API_KEY='your-anthropic-key'
export OPENAI_API_KEY='your-openai-key'
export GOOGLE_API_KEY='your-google-key'

# Aider settings
export AIDER_MODEL='claude-3-5-sonnet-20241022'`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-terminal-directory pl-4">
                      <h4 className="text-terminal-directory font-bold mb-2">၂. .gitignore_global တွင် ထည့်ပါ</h4>
                      <pre className="bg-terminal-bg p-3 rounded text-xs overflow-x-auto">
{`# Secrets - Never commit these!
.bash_secrets
.env.local
*.secret
*_secret*`}
                      </pre>
                    </div>

                    <div className="border-l-4 border-terminal-warning pl-4">
                      <h4 className="text-terminal-warning font-bold mb-2">၃. GitHub Codespaces အတွက် Secrets Setup</h4>
                      <p className="text-terminal-comment text-sm mb-2">
                        GitHub Settings → Codespaces → Secrets တွင် API keys များကို ထည့်ပါ။
                        Codespaces က အလိုအလျောက် environment variables အဖြစ် inject လုပ်ပေးမည်။
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Part 8: Directory Structure */}
              <motion.div 
                className="bg-terminal-header rounded-lg border border-terminal-border overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.7 }}
              >
                <div className="bg-terminal-prompt/20 px-4 py-3 border-b border-terminal-border">
                  <h3 className="text-terminal-prompt font-bold text-lg">အပိုင်း ၈: နောက်ဆုံး Folder Structure</h3>
                </div>
                <div className="p-4">
                  <pre className="bg-terminal-bg p-4 rounded text-sm overflow-x-auto">
{`~/dotfiles/
├── .bashrc                 # Main shell config
├── .bash_aliases           # General aliases (git, npm, docker)
├── .ai_aliases             # AI tools aliases
├── .bash_secrets.template  # API keys template
├── .gitconfig              # Git configuration
├── .gitignore_global       # Global git ignores
├── install.sh              # Main installer
├── install-ai-tools.sh     # AI CLI installer
└── README.md               # Documentation

~/ (Home directory after install)
├── .bashrc          → ~/dotfiles/.bashrc
├── .bash_aliases    → ~/dotfiles/.bash_aliases
├── .ai_aliases      → ~/dotfiles/.ai_aliases
├── .gitconfig       → ~/dotfiles/.gitconfig
├── .gitignore_global→ ~/dotfiles/.gitignore_global
└── .bash_secrets    # Created manually (not in git)`}
                  </pre>
                </div>
              </motion.div>

              {/* Summary */}
              <motion.div 
                className="bg-terminal-directory/10 border border-terminal-directory/30 rounded-lg p-6"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-terminal-directory font-bold text-lg mb-4">✅ အကျဉ်းချုပ် Checklist</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.bashrc (environment, prompt, sources)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.bash_aliases (general shortcuts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.ai_aliases (AI tools)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.gitconfig (Git settings)</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.gitignore_global</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>.bash_secrets.template</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>install.sh script</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-terminal-prompt">☐</span>
                      <span>README.md documentation</span>
                    </li>
                  </ul>
                </div>
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

            {/* Uninstall Section */}
            <div className="mt-8 pt-6 border-t border-terminal-border">
              <h2 className="text-xl font-bold text-destructive mb-4">🗑️ Dotfiles ဖျက်နည်း (Uninstall)</h2>
              <p className="text-terminal-comment mb-4 text-sm">
                Install လုပ်ထားတဲ့ dotfiles တွေကို ပြန်ဖျက်ပြီး မူလ settings တွေကို ပြန်ယူချင်ရင် အောက်ပါ အဆင့်တွေ လုပ်ပါ။
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-destructive pl-4 bg-terminal-header rounded-r-lg p-4">
                  <h3 className="text-destructive font-bold mb-2">အဆင့် ၁: Backup Files များကို ပြန်ယူပါ</h3>
                  <p className="text-terminal-comment mb-2 text-sm">
                    Install script က သင့်ရဲ့ မူလ files တွေကို <code className="text-terminal-warning">.backup</code> extension နဲ့ သိမ်းထားပါတယ်။
                  </p>
                  <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
{`# မူလ .bashrc ကို ပြန်ယူပါ
cp ~/.bashrc.backup ~/.bashrc

# မူလ .gitconfig ကို ပြန်ယူပါ (ရှိရင်)
cp ~/.gitconfig.backup ~/.gitconfig`}
                  </pre>
                </div>

                <div className="border-l-4 border-terminal-warning pl-4 bg-terminal-header rounded-r-lg p-4">
                  <h3 className="text-terminal-warning font-bold mb-2">အဆင့် ၂: Dotfiles Folder ကို ဖျက်ပါ</h3>
                  <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                    rm -rf ~/dotfiles
                  </pre>
                </div>

                <div className="border-l-4 border-terminal-directory pl-4 bg-terminal-header rounded-r-lg p-4">
                  <h3 className="text-terminal-directory font-bold mb-2">အဆင့် ၃: AI Tools များကို ဖျက်ပါ (Optional)</h3>
                  <p className="text-terminal-comment mb-2 text-sm">
                    Install လုပ်ထားတဲ့ AI tools တွေကို ဖျက်ချင်ရင်:
                  </p>
                  <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
{`# Claude Code ဖျက်ရန်
npm uninstall -g @anthropic-ai/claude-code

# Aider ဖျက်ရန်
pip uninstall aider-chat

# GitHub Copilot CLI ဖျက်ရန်
gh extension remove github/gh-copilot

# Ollama ဖျက်ရန် (Linux)
sudo rm /usr/local/bin/ollama
rm -rf ~/.ollama`}
                  </pre>
                </div>

                <div className="border-l-4 border-[#B48EAD] pl-4 bg-terminal-header rounded-r-lg p-4">
                  <h3 className="text-[#B48EAD] font-bold mb-2">အဆင့် ၄: API Keys များကို ဖျက်ပါ</h3>
                  <p className="text-terminal-comment mb-2 text-sm">
                    ~/.bash_secrets file ထဲက API keys တွေကို ဖျက်ပါ။
                  </p>
                  <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                    rm ~/.bash_secrets
                  </pre>
                </div>

                <div className="border-l-4 border-terminal-prompt pl-4 bg-terminal-header rounded-r-lg p-4">
                  <h3 className="text-terminal-prompt font-bold mb-2">အဆင့် ၅: Terminal ကို Reload လုပ်ပါ</h3>
                  <pre className="bg-terminal-bg p-3 rounded text-terminal-prompt text-sm overflow-x-auto">
                    source ~/.bashrc
                  </pre>
                  <p className="text-terminal-comment mt-2 text-sm">
                    သို့မဟုတ် Terminal ကို ပိတ်ပြီး ပြန်ဖွင့်ပါ။
                  </p>
                </div>

                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <h4 className="text-destructive font-bold mb-2">⚠️ သတိပြုရန်</h4>
                  <ul className="text-terminal-comment text-sm space-y-1">
                    <li>• Backup files မရှိရင် default .bashrc ကို ဖန်တီးရပါမယ်</li>
                    <li>• API keys ဖျက်ပြီးရင် ပြန်ရယူလို့ မရတော့ပါ၊ သိမ်းထားပါ</li>
                    <li>• ဖျက်ခြင်းမပြုမီ လိုအပ်တဲ့ settings တွေကို backup လုပ်ထားပါ</li>
                  </ul>
                </div>
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

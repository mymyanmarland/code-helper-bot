import { useState } from 'react';
import { Copy, Check, Github, Terminal, Download, ExternalLink } from 'lucide-react';

const Index = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const installCommand = `git clone https://github.com/mymyanmarland/code-helper-bot.git ~/dotfiles
cd ~/dotfiles/dotfiles
chmod +x install.sh
./install.sh`;

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
    <div className="min-h-screen bg-terminal-bg text-terminal-fg font-mono">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Terminal className="w-16 h-16 text-terminal-prompt" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-terminal-fg">
            Custom Terminal Dotfiles
          </h1>
          
          <p className="text-xl text-terminal-comment mb-8">
            Bash configuration with Powerline prompt, Nord theme, and 100+ aliases
            <br />
            <span className="text-terminal-prompt">GitHub Codespaces Ready</span>
          </p>

          {/* Quick Install */}
          <div className="bg-terminal-header rounded-lg p-6 mb-12 text-left border border-terminal-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-terminal-comment text-sm">Quick Install</span>
              <button
                onClick={() => copyToClipboard(installCommand, 'install')}
                className="flex items-center gap-2 px-3 py-1 rounded bg-terminal-border hover:bg-terminal-comment/20 transition-colors"
              >
                {copiedSection === 'install' ? (
                  <><Check className="w-4 h-4 text-terminal-directory" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copy</>
                )}
              </button>
            </div>
            <pre className="text-terminal-prompt overflow-x-auto">
              <code>{installCommand}</code>
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href="/dotfiles/.bashrc"
              download
              className="flex items-center gap-2 px-6 py-3 bg-terminal-prompt text-terminal-bg rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              Download .bashrc
            </a>
            <a
              href="https://github.com/mymyanmarland/code-helper-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border-2 border-terminal-border rounded-lg hover:border-terminal-comment transition-colors"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-terminal-directory">
            ✨ Features Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-terminal-header border border-terminal-border rounded-lg p-5 hover:border-terminal-prompt transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-terminal-fg mb-1">{feature.title}</h3>
                <p className="text-sm text-terminal-comment">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Commands */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-terminal-directory">
            ⌨️ Quick Commands
          </h2>
          <div className="bg-terminal-header border border-terminal-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-terminal-border">
              {quickCommands.map((item, i) => (
                <div key={i} className="p-4 hover:bg-terminal-border/30 transition-colors">
                  <code className="text-terminal-prompt font-bold">{item.cmd}</code>
                  <span className="text-terminal-comment ml-2">→ {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-terminal-comment mt-4">
            Type <code className="text-terminal-warning">help-me</code> or <code className="text-terminal-warning">ai-help</code> in terminal for full reference
          </p>
        </div>

        {/* Terminal Preview */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-terminal-directory">
            🖥️ Prompt Preview
          </h2>
          <div className="bg-terminal-header rounded-lg overflow-hidden border border-terminal-border">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border">
              <span className="w-3 h-3 rounded-full bg-destructive" />
              <span className="w-3 h-3 rounded-full bg-terminal-warning" />
              <span className="w-3 h-3 rounded-full bg-terminal-maximize" />
              <span className="text-terminal-comment text-sm ml-2">Terminal</span>
            </div>
            <div className="p-6 space-y-2">
              <div>
                <span className="text-terminal-prompt font-bold">user</span>
                <span className="text-terminal-comment">@</span>
                <span className="text-terminal-directory">linux-terminal</span>
                <span className="text-terminal-comment"> ❯ </span>
                <span className="text-[#8FBCBB] font-bold">~/projects/my-app</span>
                <span className="text-[#A3BE8C]"> main ●</span>
                <span className="text-[#A3BE8C]"> ⬢ 20.10.0</span>
              </div>
              <div>
                <span className="text-[#B48EAD]">❯</span>
                <span className="text-terminal-fg ml-2">npm run dev</span>
                <span className="animate-pulse ml-1">▋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Files Included */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-terminal-directory">
            📁 Files Included
          </h2>
          <div className="bg-terminal-header border border-terminal-border rounded-lg p-6">
            <pre className="text-terminal-comment">
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
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-terminal-comment">
          <p>Made with ❤️ for productive terminal experiences</p>
          <p className="mt-2">
            <a href="#" className="text-terminal-prompt hover:underline inline-flex items-center gap-1">
              Fork on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

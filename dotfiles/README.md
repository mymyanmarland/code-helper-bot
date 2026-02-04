# 🚀 Custom Terminal Dotfiles

> **Bash configuration with Powerline prompt, Nord theme, and comprehensive aliases for Git, Web Dev, Python, and Docker.**

![Bash](https://img.shields.io/badge/Shell-Bash-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white)
![Nord](https://img.shields.io/badge/Theme-Nord-88C0D0?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Features

### 🎨 Powerline Prompt
- **Git status** - Branch name, uncommitted changes, push/pull indicators
- **Python venv** - Shows active virtual environment
- **Node.js** - Displays version in Node projects
- **Docker** - Indicator when Dockerfile/docker-compose.yml present
- **Exit code** - Shows last command exit status if failed

### 🎨 Nord Color Theme
Beautiful Arctic-inspired color palette with:
- Polar Night (dark backgrounds)
- Snow Storm (light text)
- Frost (accent blues/cyans)
- Aurora (status colors)

### ⌨️ Aliases Included

#### Git
```bash
gs    # git status
ga    # git add
gc    # git commit -m
gp    # git push
gl    # git log --oneline
gco   # git checkout
gcob  # git checkout -b (new branch)
gd    # git diff
gst   # git stash
# ... and 50+ more!
```

#### Web Development
```bash
# NPM
ni    # npm install
nrd   # npm run dev
nrb   # npm run build

# Yarn
ya    # yarn add
yd    # yarn dev

# Bun
bi    # bun install
brd   # bun run dev
```

#### Python
```bash
py    # python3
venv  # create virtual env
va    # activate venv
pir   # pip install -r requirements.txt
pyt   # pytest
djr   # django runserver
```

#### Docker
```bash
dps   # docker ps
dcu   # docker compose up
dcd   # docker compose down
dex   # docker exec -it
dlog  # docker logs
k     # kubectl
```

## 📦 Installation

### Quick Install

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/dotfiles.git ~/dotfiles

# Run install script
cd ~/dotfiles
chmod +x install.sh
./install.sh

# Reload shell
source ~/.bashrc
```

### GitHub Codespaces

1. Fork this repository
2. Go to GitHub Settings → Codespaces
3. Set this repo as your dotfiles repository
4. New Codespaces will automatically use these settings!

### Manual Install

```bash
# Backup existing files
cp ~/.bashrc ~/.bashrc.backup
cp ~/.gitconfig ~/.gitconfig.backup

# Create symlinks
ln -sf ~/dotfiles/.bashrc ~/.bashrc
ln -sf ~/dotfiles/.bash_aliases ~/.bash_aliases
ln -sf ~/dotfiles/.gitconfig ~/.gitconfig
ln -sf ~/dotfiles/.gitignore_global ~/.gitignore_global

# Reload
source ~/.bashrc
```

## ⚙️ Configuration

### Update Git Credentials

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Change Editor

Edit `.bashrc` and update:
```bash
export EDITOR='code'  # or 'vim', 'nano', etc.
export VISUAL='code'
```

## 📚 Quick Reference

Type `help-me` in terminal for a quick command reference:

```
╭──────────────────────────────────────────────────────────────╮
│ Custom Terminal Commands Reference                            │
╰──────────────────────────────────────────────────────────────╯

Git:       gs (status) | ga (add) | gc (commit) | gp (push)
           gl (log) | gco (checkout) | gcob (new branch)

NPM:       ni (install) | nr (run) | nrd (dev) | nrb (build)
Yarn:      ya (add) | yd (dev) | yb (build)

Python:    venv (create) | va (activate) | py (python3)
           pir (pip install -r) | pyt (pytest)

Docker:    dps (ps) | dcu (compose up) | dcd (compose down)
           dex (exec) | dlog (logs) | dprune (cleanup)

Utils:     mkcd | extract | ff (find) | killport | myip
```

## 🛠️ Useful Functions

| Function | Description |
|----------|-------------|
| `mkcd dir` | Create directory and cd into it |
| `extract file` | Extract any archive type |
| `killport 3000` | Kill process on port |
| `myip` | Show public IP address |
| `weather` | Show weather in terminal |
| `gclone url` | Clone and cd into repo |
| `gcm "message"` | Add all and commit |
| `dsh container` | Shell into Docker container |

## 📁 Files Included

```
dotfiles/
├── .bashrc           # Main bash config with prompt & aliases
├── .bash_aliases     # Additional aliases
├── .gitconfig        # Git configuration & aliases
├── .gitignore_global # Global git ignore patterns
├── install.sh        # Installation script
└── README.md         # This file
```

## 🎨 Customization

### Change Prompt Colors

Edit the Nord color variables in `.bashrc`:
```bash
NORD8='\033[38;2;136;192;208m'   # Cyan - hostname
NORD14='\033[38;2;163;190;140m'  # Green - git info
```

### Add Custom Aliases

Add to `.bash_aliases`:
```bash
alias myalias='my command'
```

Then reload: `source ~/.bashrc`

## 📜 License

MIT License - Feel free to use and modify!

---

Made with ❤️ for productive terminal experiences

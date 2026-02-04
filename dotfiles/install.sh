#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# Dotfiles Installation Script
# For GitHub Codespaces & Linux Systems
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo '╔══════════════════════════════════════════════════════════════╗'
echo '║           🚀 Dotfiles Installation Script                    ║'
echo '║           GitHub Codespaces Ready                            ║'
echo '╚══════════════════════════════════════════════════════════════╝'
echo -e "${NC}"

# Get the directory where this script is located
DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Backup existing files
backup_file() {
    if [ -f "$1" ]; then
        backup_name="$1.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${YELLOW}→ Backing up existing $1 to $backup_name${NC}"
        mv "$1" "$backup_name"
    fi
}

# Create symlink
create_link() {
    local source="$1"
    local target="$2"
    
    if [ -L "$target" ]; then
        echo -e "${YELLOW}→ Removing existing symlink: $target${NC}"
        rm "$target"
    elif [ -f "$target" ]; then
        backup_file "$target"
    fi
    
    echo -e "${GREEN}✓ Linking $source → $target${NC}"
    ln -sf "$source" "$target"
}

echo -e "\n${BLUE}📁 Installing dotfiles from: $DOTFILES_DIR${NC}\n"

# Install .bashrc
if [ -f "$DOTFILES_DIR/.bashrc" ]; then
    create_link "$DOTFILES_DIR/.bashrc" "$HOME/.bashrc"
fi

# Install .bash_aliases
if [ -f "$DOTFILES_DIR/.bash_aliases" ]; then
    create_link "$DOTFILES_DIR/.bash_aliases" "$HOME/.bash_aliases"
fi

# Install .gitconfig
if [ -f "$DOTFILES_DIR/.gitconfig" ]; then
    create_link "$DOTFILES_DIR/.gitconfig" "$HOME/.gitconfig"
fi

# Install .gitignore_global
if [ -f "$DOTFILES_DIR/.gitignore_global" ]; then
    create_link "$DOTFILES_DIR/.gitignore_global" "$HOME/.gitignore_global"
fi

# Source the new bashrc
echo -e "\n${BLUE}🔄 Reloading bash configuration...${NC}"
source "$HOME/.bashrc" 2>/dev/null || true

echo -e "\n${GREEN}"
echo '╔══════════════════════════════════════════════════════════════╗'
echo '║           ✅ Installation Complete!                          ║'
echo '╠══════════════════════════════════════════════════════════════╣'
echo '║  Installed:                                                  ║'
echo '║    • .bashrc        (Powerline prompt + Nord theme)          ║'
echo '║    • .bash_aliases  (Additional aliases)                     ║'
echo '║    • .gitconfig     (Git settings + aliases)                 ║'
echo '║    • .gitignore_global (Global ignore patterns)              ║'
echo '║                                                              ║'
echo '║  Next steps:                                                 ║'
echo '║    1. Update .gitconfig with your name/email                 ║'
echo '║    2. Run: source ~/.bashrc                                  ║'
echo '║    3. Type: help-me for command reference                    ║'
echo '╚══════════════════════════════════════════════════════════════╝'
echo -e "${NC}"

# Reminder to update git config
echo -e "${YELLOW}⚠️  Don't forget to update your Git credentials:${NC}"
echo -e "   git config --global user.name \"Your Name\""
echo -e "   git config --global user.email \"your.email@example.com\""
echo ""

#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# AI Coding Tools Installation Script
# Installs Claude Code, Aider, GitHub Copilot CLI, and more
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo '╔══════════════════════════════════════════════════════════════╗'
echo '║           🤖 AI Coding Tools Installer                       ║'
echo '╚══════════════════════════════════════════════════════════════╝'
echo -e "${NC}"

# Check if command exists
command_exists() {
    command -v "$1" &>/dev/null
}

# ─────────────────────────────────────────────────────────────────────────────
# CLAUDE CODE
# ─────────────────────────────────────────────────────────────────────────────
install_claude() {
    echo -e "\n${BLUE}📦 Installing Claude Code...${NC}"
    if command_exists claude; then
        echo -e "${YELLOW}→ Claude Code already installed${NC}"
    else
        if command_exists npm; then
            npm install -g @anthropic-ai/claude-code
            echo -e "${GREEN}✓ Claude Code installed${NC}"
        else
            echo -e "${RED}✗ npm not found, skipping Claude Code${NC}"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# AIDER
# ─────────────────────────────────────────────────────────────────────────────
install_aider() {
    echo -e "\n${BLUE}📦 Installing Aider...${NC}"
    if command_exists aider; then
        echo -e "${YELLOW}→ Aider already installed${NC}"
    else
        if command_exists pip3; then
            pip3 install aider-chat
            echo -e "${GREEN}✓ Aider installed${NC}"
        elif command_exists pipx; then
            pipx install aider-chat
            echo -e "${GREEN}✓ Aider installed via pipx${NC}"
        else
            echo -e "${RED}✗ pip3/pipx not found, skipping Aider${NC}"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# GITHUB COPILOT CLI
# ─────────────────────────────────────────────────────────────────────────────
install_gh_copilot() {
    echo -e "\n${BLUE}📦 Installing GitHub Copilot CLI...${NC}"
    if command_exists gh; then
        if gh extension list | grep -q "copilot"; then
            echo -e "${YELLOW}→ GitHub Copilot CLI already installed${NC}"
        else
            gh extension install github/gh-copilot
            echo -e "${GREEN}✓ GitHub Copilot CLI installed${NC}"
        fi
    else
        echo -e "${RED}✗ GitHub CLI (gh) not found, skipping Copilot${NC}"
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# OPENAI CLI
# ─────────────────────────────────────────────────────────────────────────────
install_openai() {
    echo -e "\n${BLUE}📦 Installing OpenAI CLI...${NC}"
    if command_exists openai; then
        echo -e "${YELLOW}→ OpenAI CLI already installed${NC}"
    else
        if command_exists pip3; then
            pip3 install openai
            echo -e "${GREEN}✓ OpenAI CLI installed${NC}"
        else
            echo -e "${RED}✗ pip3 not found, skipping OpenAI CLI${NC}"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# SHELL GPT
# ─────────────────────────────────────────────────────────────────────────────
install_sgpt() {
    echo -e "\n${BLUE}📦 Installing Shell GPT...${NC}"
    if command_exists sgpt; then
        echo -e "${YELLOW}→ Shell GPT already installed${NC}"
    else
        if command_exists pip3; then
            pip3 install shell-gpt
            echo -e "${GREEN}✓ Shell GPT installed${NC}"
        else
            echo -e "${RED}✗ pip3 not found, skipping Shell GPT${NC}"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# LLM CLI
# ─────────────────────────────────────────────────────────────────────────────
install_llm() {
    echo -e "\n${BLUE}📦 Installing LLM CLI...${NC}"
    if command_exists llm; then
        echo -e "${YELLOW}→ LLM CLI already installed${NC}"
    else
        if command_exists pip3; then
            pip3 install llm
            echo -e "${GREEN}✓ LLM CLI installed${NC}"
        else
            echo -e "${RED}✗ pip3 not found, skipping LLM CLI${NC}"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# OLLAMA
# ─────────────────────────────────────────────────────────────────────────────
install_ollama() {
    echo -e "\n${BLUE}📦 Installing Ollama...${NC}"
    if command_exists ollama; then
        echo -e "${YELLOW}→ Ollama already installed${NC}"
    else
        curl -fsSL https://ollama.ai/install.sh | sh
        echo -e "${GREEN}✓ Ollama installed${NC}"
    fi
}

# ─────────────────────────────────────────────────────────────────────────────
# MAIN MENU
# ─────────────────────────────────────────────────────────────────────────────

echo "Select which tools to install:"
echo ""
echo "  1) Claude Code (Anthropic CLI)"
echo "  2) Aider (AI Pair Programming)"
echo "  3) GitHub Copilot CLI"
echo "  4) OpenAI CLI"
echo "  5) Shell GPT"
echo "  6) LLM CLI"
echo "  7) Ollama (Local LLMs)"
echo "  8) All of the above"
echo "  9) Skip installation"
echo ""
read -p "Enter your choice [1-9]: " choice

case $choice in
    1) install_claude ;;
    2) install_aider ;;
    3) install_gh_copilot ;;
    4) install_openai ;;
    5) install_sgpt ;;
    6) install_llm ;;
    7) install_ollama ;;
    8)
        install_claude
        install_aider
        install_gh_copilot
        install_openai
        install_sgpt
        install_llm
        install_ollama
        ;;
    9)
        echo -e "${YELLOW}Skipping installation${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# ─────────────────────────────────────────────────────────────────────────────
# API KEY SETUP REMINDER
# ─────────────────────────────────────────────────────────────────────────────

echo -e "\n${GREEN}"
echo '╔══════════════════════════════════════════════════════════════╗'
echo '║           ✅ Installation Complete!                          ║'
echo '╚══════════════════════════════════════════════════════════════╝'
echo -e "${NC}"

echo -e "${YELLOW}⚠️  Don't forget to set up your API keys:${NC}"
echo ""
echo -e "${CYAN}Claude Code:${NC}"
echo "  export ANTHROPIC_API_KEY='your-api-key'"
echo ""
echo -e "${CYAN}OpenAI/Codex:${NC}"
echo "  export OPENAI_API_KEY='your-api-key'"
echo ""
echo -e "${CYAN}GitHub Copilot:${NC}"
echo "  gh auth login"
echo "  gh copilot alias"
echo ""
echo -e "${CYAN}Aider:${NC}"
echo "  # Uses ANTHROPIC_API_KEY or OPENAI_API_KEY"
echo ""
echo "Add these to your ~/.bashrc or ~/.bash_secrets"
echo ""
echo -e "Type ${GREEN}ai-help${NC} for command reference"
echo ""

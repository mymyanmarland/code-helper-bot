# ═══════════════════════════════════════════════════════════════════════════
# Additional Bash Aliases (Sourced by .bashrc)
# ═══════════════════════════════════════════════════════════════════════════

# Quick edits
alias zshrc='${EDITOR:-nano} ~/.zshrc'
alias bashrc='${EDITOR:-nano} ~/.bashrc'
alias aliases='${EDITOR:-nano} ~/.bash_aliases'
alias gitconfig='${EDITOR:-nano} ~/.gitconfig'

# Codespaces specific
alias codespace='echo $CODESPACE_NAME'
alias rebuild='gh cs rebuild'

# System monitoring
alias top='htop 2>/dev/null || top'
alias psmem='ps auxf | sort -nr -k 4 | head -10'
alias pscpu='ps auxf | sort -nr -k 3 | head -10'

# Network
alias pingg='ping google.com -c 5'
alias wget='wget -c'
alias curl='curl -L'

# Clipboard (works in many environments)
alias clip='xclip -selection clipboard'
alias paste='xclip -selection clipboard -o'

# JSON formatting
alias json='python3 -m json.tool'
alias jsonf='python3 -m json.tool'

# Quick servers
alias http='python3 -m http.server'
alias https='python3 -m http.server --bind 127.0.0.1'

# Timestamp
alias timestamp='date +%Y%m%d_%H%M%S'
alias epoch='date +%s'

# Tree view
alias tree='tree -C'
alias tree1='tree -C -L 1'
alias tree2='tree -C -L 2'
alias tree3='tree -C -L 3'

# Disk usage sorted
alias usage='du -sh * | sort -h'

# Process management
alias psg='ps aux | grep -v grep | grep -i'

# Quick backup
backup() {
    cp "$1" "$1.bak.$(date +%Y%m%d_%H%M%S)"
}

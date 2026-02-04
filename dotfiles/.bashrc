# ╔══════════════════════════════════════════════════════════════════════════╗
# ║                     Custom Bash Configuration                              ║
# ║                     GitHub Codespaces Ready                                ║
# ║                     + AI Coding Assistants                                 ║
# ╚══════════════════════════════════════════════════════════════════════════╝

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# ─────────────────────────────────────────────────────────────────────────────
# HISTORY SETTINGS
# ─────────────────────────────────────────────────────────────────────────────
HISTCONTROL=ignoreboth:erasedups
HISTSIZE=10000
HISTFILESIZE=20000
HISTTIMEFORMAT="%F %T "
shopt -s histappend
shopt -s cmdhist

# ─────────────────────────────────────────────────────────────────────────────
# SHELL OPTIONS
# ─────────────────────────────────────────────────────────────────────────────
shopt -s checkwinsize
shopt -s globstar
shopt -s autocd
shopt -s cdspell
shopt -s dirspell
shopt -s nocaseglob

# ─────────────────────────────────────────────────────────────────────────────
# NORD COLOR PALETTE
# ─────────────────────────────────────────────────────────────────────────────
# Polar Night
NORD0='\033[38;2;46;52;64m'      # #2E3440
NORD1='\033[38;2;59;66;82m'      # #3B4252
NORD2='\033[38;2;67;76;94m'      # #434C5E
NORD3='\033[38;2;76;86;106m'     # #4C566A

# Snow Storm
NORD4='\033[38;2;216;222;233m'   # #D8DEE9
NORD5='\033[38;2;229;233;240m'   # #E5E9F0
NORD6='\033[38;2;236;239;244m'   # #ECEFF4

# Frost
NORD7='\033[38;2;143;188;187m'   # #8FBCBB (Teal)
NORD8='\033[38;2;136;192;208m'   # #88C0D0 (Cyan)
NORD9='\033[38;2;129;161;193m'   # #81A1C1 (Blue)
NORD10='\033[38;2;94;129;172m'   # #5E81AC (Dark Blue)

# Aurora
NORD11='\033[38;2;191;97;106m'   # #BF616A (Red)
NORD12='\033[38;2;208;135;112m'  # #D08770 (Orange)
NORD13='\033[38;2;235;203;139m'  # #EBCB8B (Yellow)
NORD14='\033[38;2;163;190;140m'  # #A3BE8C (Green)
NORD15='\033[38;2;180;142;173m'  # #B48EAD (Purple)

RESET='\033[0m'
BOLD='\033[1m'

# ─────────────────────────────────────────────────────────────────────────────
# POWERLINE STYLE PROMPT
# ─────────────────────────────────────────────────────────────────────────────
__git_info() {
    local branch=""
    local status=""
    
    if git rev-parse --is-inside-work-tree &>/dev/null; then
        branch=$(git symbolic-ref --short HEAD 2>/dev/null || git describe --tags --always 2>/dev/null)
        
        # Check for uncommitted changes
        if [[ -n $(git status --porcelain 2>/dev/null) ]]; then
            status=" ●"
        fi
        
        # Check for unpushed commits
        if [[ -n $(git log @{u}..HEAD 2>/dev/null) ]]; then
            status="${status} ↑"
        fi
        
        # Check for unpulled commits
        if [[ -n $(git log HEAD..@{u} 2>/dev/null) ]]; then
            status="${status} ↓"
        fi
        
        echo -e " \ue0a0 ${branch}${status}"
    fi
}

__python_venv() {
    if [[ -n "$VIRTUAL_ENV" ]]; then
        echo -e " 🐍 $(basename $VIRTUAL_ENV)"
    fi
}

__docker_context() {
    if command -v docker &>/dev/null && [[ -f "docker-compose.yml" || -f "Dockerfile" ]]; then
        echo -e " 🐳"
    fi
}

__node_version() {
    if [[ -f "package.json" ]] && command -v node &>/dev/null; then
        echo -e " ⬢ $(node -v 2>/dev/null | cut -c2-)"
    fi
}

__exit_status() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        echo -e "${NORD11}✘ ${exit_code}${RESET} "
    fi
}

# Powerline prompt
__set_prompt() {
    local EXIT=$?
    PS1=""
    
    # Exit status indicator
    if [[ $EXIT -ne 0 ]]; then
        PS1+="\[${NORD11}\]✘ ${EXIT} \[${RESET}\]"
    fi
    
    # Username
    PS1+="\[${BOLD}${NORD8}\]\u\[${RESET}\]"
    
    # @ symbol
    PS1+="\[${NORD3}\]@\[${RESET}\]"
    
    # Hostname
    PS1+="\[${NORD9}\]\h\[${RESET}\]"
    
    # Separator
    PS1+="\[${NORD3}\] ❯ \[${RESET}\]"
    
    # Current directory
    PS1+="\[${BOLD}${NORD7}\]\w\[${RESET}\]"
    
    # Git info
    PS1+="\[${NORD14}\]$(__git_info)\[${RESET}\]"
    
    # Python venv
    PS1+="\[${NORD13}\]$(__python_venv)\[${RESET}\]"
    
    # Node version (only in node projects)
    PS1+="\[${NORD14}\]$(__node_version)\[${RESET}\]"
    
    # Docker indicator
    PS1+="\[${NORD8}\]$(__docker_context)\[${RESET}\]"
    
    # New line and prompt symbol
    PS1+="\n\[${NORD15}\]❯\[${RESET}\] "
}

PROMPT_COMMAND=__set_prompt

# ─────────────────────────────────────────────────────────────────────────────
# ALIASES - GENERAL
# ─────────────────────────────────────────────────────────────────────────────
# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ~='cd ~'
alias -- -='cd -'

# List files
alias ls='ls --color=auto'
alias ll='ls -alF --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias lt='ls -altr --color=auto'   # Sort by date
alias lS='ls -alSr --color=auto'   # Sort by size

# Grep with color
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Safety nets
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'
alias ln='ln -i'

# Disk usage
alias df='df -h'
alias du='du -h'
alias dud='du -d 1 -h'
alias duf='du -sh *'

# System
alias path='echo -e ${PATH//:/\\n}'
alias now='date +"%T"'
alias today='date +"%Y-%m-%d"'
alias ports='netstat -tulanp'
alias meminfo='free -h -l -t'
alias cpuinfo='lscpu'

# Quick edit configs
alias bashrc='${EDITOR:-nano} ~/.bashrc'
alias reload='source ~/.bashrc && echo "Bash config reloaded!"'

# ─────────────────────────────────────────────────────────────────────────────
# ALIASES - GIT
# ─────────────────────────────────────────────────────────────────────────────
alias g='git'
alias gs='git status'
alias gst='git status -sb'
alias ga='git add'
alias gaa='git add --all'
alias gc='git commit -m'
alias gca='git commit -am'
alias gcam='git commit --amend'
alias gp='git push'
alias gpf='git push --force-with-lease'
alias gpu='git push -u origin $(git branch --show-current)'
alias gpl='git pull'
alias gplr='git pull --rebase'
alias gf='git fetch --all --prune'
alias gb='git branch'
alias gba='git branch -a'
alias gbd='git branch -d'
alias gbD='git branch -D'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gcom='git checkout main'
alias gcod='git checkout develop'
alias gm='git merge'
alias gmm='git merge main'
alias gmd='git merge develop'
alias gr='git rebase'
alias gri='git rebase -i'
alias grm='git rebase main'
alias grc='git rebase --continue'
alias gra='git rebase --abort'
alias gl='git log --oneline -10'
alias glog='git log --oneline --graph --decorate'
alias gloga='git log --oneline --graph --decorate --all'
alias gd='git diff'
alias gds='git diff --staged'
alias gdt='git difftool'
alias gsh='git stash'
alias gshp='git stash pop'
alias gshl='git stash list'
alias gshd='git stash drop'
alias grst='git reset'
alias grsth='git reset --hard'
alias grsts='git reset --soft'
alias gcp='git cherry-pick'
alias gcl='git clone'
alias gcls='git clone --depth 1'  # Shallow clone
alias gclean='git clean -fd'
alias gtag='git tag'
alias gtagl='git tag -l'
alias gwip='git add -A && git commit -m "WIP"'
alias gunwip='git log -1 --format="%s" | grep -q "WIP" && git reset HEAD~1'
alias gundo='git reset --soft HEAD~1'

# GitHub CLI aliases (if gh is installed)
alias ghpr='gh pr create'
alias ghprl='gh pr list'
alias ghprv='gh pr view'
alias ghprm='gh pr merge'
alias ghprc='gh pr checkout'
alias ghis='gh issue create'
alias ghisl='gh issue list'
alias ghisv='gh issue view'
alias ghrepo='gh repo view --web'

# ─────────────────────────────────────────────────────────────────────────────
# ALIASES - WEB DEVELOPMENT
# ─────────────────────────────────────────────────────────────────────────────
# Node/NPM
alias n='npm'
alias ni='npm install'
alias nid='npm install --save-dev'
alias nig='npm install -g'
alias nu='npm update'
alias nr='npm run'
alias nrs='npm run start'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'
alias nrc='npm run check'
alias nrl='npm run lint'
alias nrf='npm run format'
alias nrw='npm run watch'
alias nci='npm ci'
alias nout='npm outdated'
alias nau='npm audit'
alias nauf='npm audit fix'

# Yarn
alias y='yarn'
alias ya='yarn add'
alias yad='yarn add --dev'
alias yr='yarn remove'
alias yu='yarn upgrade'
alias yui='yarn upgrade-interactive'
alias ys='yarn start'
alias yd='yarn dev'
alias yb='yarn build'
alias yt='yarn test'
alias yl='yarn lint'
alias yf='yarn format'

# PNPM
alias pn='pnpm'
alias pni='pnpm install'
alias pna='pnpm add'
alias pnad='pnpm add -D'
alias pnr='pnpm run'
alias pns='pnpm start'
alias pnd='pnpm dev'
alias pnb='pnpm build'
alias pnt='pnpm test'

# Bun
alias b='bun'
alias bi='bun install'
alias ba='bun add'
alias bad='bun add -d'
alias br='bun run'
alias brd='bun run dev'
alias brb='bun run build'
alias brt='bun run test'

# Quick servers
alias serve='python3 -m http.server 8000'
alias phpserve='php -S localhost:8000'
alias liveserver='npx live-server'

# ─────────────────────────────────────────────────────────────────────────────
# ALIASES - PYTHON
# ─────────────────────────────────────────────────────────────────────────────
alias py='python3'
alias python='python3'
alias pip='pip3'
alias pir='pip install -r requirements.txt'
alias piu='pip install --upgrade'
alias piup='pip install --upgrade pip'
alias pif='pip freeze'
alias pifr='pip freeze > requirements.txt'
alias pil='pip list'
alias pio='pip list --outdated'

# Virtual environments
alias venv='python3 -m venv venv'
alias va='source venv/bin/activate'
alias vd='deactivate'
alias venvc='python3 -m venv venv && source venv/bin/activate && pip install --upgrade pip'

# Django
alias dj='python manage.py'
alias djr='python manage.py runserver'
alias djm='python manage.py migrate'
alias djmm='python manage.py makemigrations'
alias djsh='python manage.py shell'
alias djsu='python manage.py createsuperuser'
alias djc='python manage.py collectstatic'
alias djt='python manage.py test'

# Flask
alias flr='flask run'
alias flrd='FLASK_DEBUG=1 flask run'

# FastAPI
alias uvr='uvicorn main:app --reload'

# Pytest
alias pyt='pytest'
alias pytv='pytest -v'
alias pytvv='pytest -vv'
alias pytc='pytest --cov'

# ─────────────────────────────────────────────────────────────────────────────
# ALIASES - DOCKER
# ─────────────────────────────────────────────────────────────────────────────
alias d='docker'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'
alias dlog='docker logs'
alias dlogf='docker logs -f'
alias drm='docker rm'
alias drmi='docker rmi'
alias drmf='docker rm -f'
alias drmia='docker rmi $(docker images -q)'
alias dprune='docker system prune -af'
alias dvprune='docker volume prune -f'
alias dstop='docker stop $(docker ps -q)'
alias dkill='docker kill $(docker ps -q)'
alias dpull='docker pull'
alias dbuild='docker build -t'
alias drun='docker run -it --rm'
alias dsp='docker system prune'
alias dv='docker volume'
alias dvl='docker volume ls'
alias dn='docker network'
alias dnl='docker network ls'
alias dstat='docker stats'
alias dinsp='docker inspect'

# Docker Compose
alias dc='docker compose'
alias dcu='docker compose up'
alias dcud='docker compose up -d'
alias dcd='docker compose down'
alias dcr='docker compose restart'
alias dcl='docker compose logs'
alias dclf='docker compose logs -f'
alias dcps='docker compose ps'
alias dcb='docker compose build'
alias dcbn='docker compose build --no-cache'
alias dce='docker compose exec'
alias dcpull='docker compose pull'

# Kubernetes
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgpa='kubectl get pods --all-namespaces'
alias kgs='kubectl get svc'
alias kgd='kubectl get deployments'
alias kgn='kubectl get nodes'
alias kga='kubectl get all'
alias kdp='kubectl describe pod'
alias kds='kubectl describe svc'
alias kdd='kubectl describe deployment'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias kex='kubectl exec -it'
alias kaf='kubectl apply -f'
alias kdf='kubectl delete -f'
alias kctx='kubectl config use-context'
alias kns='kubectl config set-context --current --namespace'

# ─────────────────────────────────────────────────────────────────────────────
# USEFUL FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

# Create directory and cd into it
mkcd() {
    mkdir -p "$1" && cd "$1"
}

# Extract any archive
extract() {
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.bz2)   tar xjf "$1"     ;;
            *.tar.gz)    tar xzf "$1"     ;;
            *.tar.xz)    tar xJf "$1"     ;;
            *.bz2)       bunzip2 "$1"     ;;
            *.rar)       unrar e "$1"     ;;
            *.gz)        gunzip "$1"      ;;
            *.tar)       tar xf "$1"      ;;
            *.tbz2)      tar xjf "$1"     ;;
            *.tgz)       tar xzf "$1"     ;;
            *.zip)       unzip "$1"       ;;
            *.Z)         uncompress "$1"  ;;
            *.7z)        7z x "$1"        ;;
            *)           echo "'$1' cannot be extracted" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Quick git commit with message
gcm() {
    git add -A && git commit -m "$*"
}

# Quick push to current branch
gpush() {
    git push origin "$(git branch --show-current)"
}

# Clone and cd into repo
gclone() {
    git clone "$1" && cd "$(basename "$1" .git)"
}

# Find and replace in files
replace() {
    find . -type f -name "$1" -exec sed -i "s/$2/$3/g" {} +
}

# Quick find
ff() {
    find . -name "*$1*"
}

# Search in files
search() {
    grep -rn "$1" --include="$2" .
}

# Kill process on port
killport() {
    lsof -i :"$1" | awk 'NR!=1 {print $2}' | xargs kill -9
}

# Get public IP
myip() {
    curl -s ifconfig.me
}

# Weather
weather() {
    curl -s "wttr.in/${1:-}"
}

# Create a new git repo and push to GitHub
ginit() {
    git init
    git add -A
    git commit -m "Initial commit"
    if [ -n "$1" ]; then
        gh repo create "$1" --public --source=. --push
    fi
}

# Docker shell into container
dsh() {
    docker exec -it "$1" /bin/bash || docker exec -it "$1" /bin/sh
}

# Show all colors
colors() {
    for i in {0..255}; do
        printf "\e[48;5;${i}m %3d \e[0m" "$i"
        [ $((($i + 1) % 16)) -eq 0 ] && echo
    done
}

# ─────────────────────────────────────────────────────────────────────────────
# ENVIRONMENT VARIABLES
# ─────────────────────────────────────────────────────────────────────────────
export EDITOR='nano'
export VISUAL='code'
export PAGER='less'
export LESS='-R'
export LANG='en_US.UTF-8'
export LC_ALL='en_US.UTF-8'

# Path additions
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/bin:$PATH"

# Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Python
export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1

# Go
export GOPATH="$HOME/go"
export PATH="$GOPATH/bin:$PATH"

# Rust
[ -f "$HOME/.cargo/env" ] && source "$HOME/.cargo/env"

# ─────────────────────────────────────────────────────────────────────────────
# WELCOME MESSAGE
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${NORD8}"
echo '╭──────────────────────────────────────────────────────────╮'
echo '│  🚀 Welcome back! Terminal ready.                        │'
echo '│  Type "help-me" for custom command reference             │'
echo '╰──────────────────────────────────────────────────────────╯'
echo -e "${RESET}"

# Quick help
help-me() {
    echo -e "${NORD8}╭──────────────────────────────────────────────────────────────╮${RESET}"
    echo -e "${NORD8}│${RESET} ${BOLD}Custom Terminal Commands Reference${RESET}                        ${NORD8}│${RESET}"
    echo -e "${NORD8}╰──────────────────────────────────────────────────────────────╯${RESET}"
    echo ""
    echo -e "${NORD14}Git:${RESET}       gs (status) | ga (add) | gc (commit) | gp (push)"
    echo -e "${NORD14}           gl (log) | gco (checkout) | gcob (new branch)"
    echo ""
    echo -e "${NORD13}NPM:${RESET}       ni (install) | nr (run) | nrd (dev) | nrb (build)"
    echo -e "${NORD13}Yarn:${RESET}      ya (add) | yd (dev) | yb (build)"
    echo ""
    echo -e "${NORD8}Python:${RESET}    venv (create) | va (activate) | py (python3)"
    echo -e "${NORD8}           pir (pip install -r) | pyt (pytest)"
    echo ""
    echo -e "${NORD15}Docker:${RESET}    dps (ps) | dcu (compose up) | dcd (compose down)"
    echo -e "${NORD15}           dex (exec) | dlog (logs) | dprune (cleanup)"
    echo ""
    echo -e "${NORD9}Utils:${RESET}     mkcd | extract | ff (find) | killport | myip"
    echo ""
    echo -e "${NORD7}AI Tools:${RESET}  cc (claude) | ai (aider) | ghcs (copilot suggest)"
    echo -e "${NORD7}           Type 'ai-help' for full AI commands reference"
    echo ""
}

# ─────────────────────────────────────────────────────────────────────────────
# SOURCE AI ALIASES
# ─────────────────────────────────────────────────────────────────────────────
if [ -f ~/.ai_aliases ]; then
    source ~/.ai_aliases
fi

# Source secrets (API keys) if exists
if [ -f ~/.bash_secrets ]; then
    source ~/.bash_secrets
fi

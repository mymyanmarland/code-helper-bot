import { useState, useCallback, useRef } from 'react';

interface FileSystemNode {
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FileSystemNode };
}

interface TerminalState {
  history: string[];
  commandHistory: string[];
  historyIndex: number;
  currentPath: string[];
  user: string;
  hostname: string;
}

const initialFileSystem: FileSystemNode = {
  type: 'directory',
  children: {
    home: {
      type: 'directory',
      children: {
        user: {
          type: 'directory',
          children: {
            documents: {
              type: 'directory',
              children: {
                'readme.txt': {
                  type: 'file',
                  content: 'Welcome to your custom Linux Terminal!\nFeel free to explore and customize.',
                },
                'notes.md': {
                  type: 'file',
                  content: '# My Notes\n\n- Learn Linux commands\n- Practice terminal navigation\n- Have fun!',
                },
              },
            },
            downloads: {
              type: 'directory',
              children: {},
            },
            projects: {
              type: 'directory',
              children: {
                'hello.sh': {
                  type: 'file',
                  content: '#!/bin/bash\necho "Hello, World!"',
                },
              },
            },
            '.bashrc': {
              type: 'file',
              content: '# ~/.bashrc\nexport PS1="\\u@\\h:\\w$ "\nalias ll="ls -la"',
            },
          },
        },
      },
    },
    etc: {
      type: 'directory',
      children: {
        'hostname': {
          type: 'file',
          content: 'linux-terminal',
        },
        'os-release': {
          type: 'file',
          content: 'NAME="Custom Linux"\nVERSION="1.0"\nID=customlinux',
        },
      },
    },
    var: {
      type: 'directory',
      children: {
        log: {
          type: 'directory',
          children: {
            'system.log': {
              type: 'file',
              content: '[INFO] System initialized\n[INFO] Terminal ready',
            },
          },
        },
      },
    },
    tmp: {
      type: 'directory',
      children: {},
    },
  },
};

const WELCOME_BANNER = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗                    ║
║   ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝                    ║
║   ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝                     ║
║   ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗                     ║
║   ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗                    ║
║   ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝                    ║
║                                                              ║
║   Custom Terminal Emulator v1.0                              ║
║   Type 'help' for available commands                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`;

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    history: [WELCOME_BANNER],
    commandHistory: [],
    historyIndex: -1,
    currentPath: ['home', 'user'],
    user: 'user',
    hostname: 'linux-terminal',
  });

  const fileSystemRef = useRef<FileSystemNode>(initialFileSystem);

  const getNode = useCallback((path: string[]): FileSystemNode | null => {
    let current = fileSystemRef.current;
    for (const segment of path) {
      if (current.type !== 'directory' || !current.children?.[segment]) {
        return null;
      }
      current = current.children[segment];
    }
    return current;
  }, []);

  const resolvePath = useCallback((inputPath: string, currentPath: string[]): string[] => {
    if (inputPath.startsWith('/')) {
      const segments = inputPath.split('/').filter(Boolean);
      return segments;
    }

    const segments = inputPath.split('/').filter(Boolean);
    const result = [...currentPath];

    for (const segment of segments) {
      if (segment === '..') {
        if (result.length > 0) result.pop();
      } else if (segment !== '.') {
        result.push(segment);
      }
    }

    return result;
  }, []);

  const getPrompt = useCallback(() => {
    const pathStr = state.currentPath.length === 0 
      ? '/' 
      : state.currentPath[0] === 'home' && state.currentPath[1] === state.user
        ? '~' + (state.currentPath.length > 2 ? '/' + state.currentPath.slice(2).join('/') : '')
        : '/' + state.currentPath.join('/');
    return `${state.user}@${state.hostname}:${pathStr}$`;
  }, [state.currentPath, state.user, state.hostname]);

  const executeCommand = useCallback((input: string) => {
    const trimmedInput = input.trim();
    const prompt = getPrompt();
    
    if (!trimmedInput) {
      setState(prev => ({
        ...prev,
        history: [...prev.history, `${prompt} `],
      }));
      return;
    }

    const [command, ...args] = trimmedInput.split(/\s+/);
    const argString = args.join(' ');

    let output: string[] = [`${prompt} ${trimmedInput}`];

    switch (command.toLowerCase()) {
      case 'help':
        output.push(`
Available Commands:
  help              Show this help message
  clear             Clear the terminal screen
  echo [text]       Display text
  pwd               Print working directory
  ls [path]         List directory contents
  cd [path]         Change directory
  cat [file]        Display file contents
  mkdir [name]      Create a directory
  touch [name]      Create an empty file
  rm [name]         Remove a file
  whoami            Display current user
  date              Display current date/time
  uname [-a]        Display system information
  history           Show command history
  neofetch          Display system info with ASCII art
  cowsay [text]     Make a cow say something
  fortune           Display a random fortune
  exit              Exit message
`);
        break;

      case 'clear':
        setState(prev => ({
          ...prev,
          history: [],
          commandHistory: [...prev.commandHistory, trimmedInput],
          historyIndex: -1,
        }));
        return;

      case 'echo':
        output.push(argString || '');
        break;

      case 'pwd':
        output.push('/' + state.currentPath.join('/'));
        break;

      case 'ls': {
        const targetPath = args[0] 
          ? resolvePath(args[0], state.currentPath)
          : state.currentPath;
        const node = getNode(targetPath);
        
        if (!node) {
          output.push(`ls: cannot access '${args[0]}': No such file or directory`);
        } else if (node.type !== 'directory') {
          output.push(args[0]);
        } else {
          const entries = Object.entries(node.children || {});
          if (entries.length === 0) {
            // Empty directory
          } else {
            const formatted = entries.map(([name, child]) => 
              child.type === 'directory' ? `\x1b[1;34m${name}/\x1b[0m` : name
            ).join('  ');
            output.push(formatted);
          }
        }
        break;
      }

      case 'cd': {
        if (!args[0] || args[0] === '~') {
          setState(prev => ({
            ...prev,
            currentPath: ['home', prev.user],
            history: [...output],
            commandHistory: [...prev.commandHistory, trimmedInput],
            historyIndex: -1,
          }));
          return;
        }

        const targetPath = resolvePath(
          args[0].replace(/^~/, `/home/${state.user}`), 
          state.currentPath
        );
        const node = getNode(targetPath);

        if (!node) {
          output.push(`cd: ${args[0]}: No such file or directory`);
        } else if (node.type !== 'directory') {
          output.push(`cd: ${args[0]}: Not a directory`);
        } else {
          setState(prev => ({
            ...prev,
            currentPath: targetPath,
            history: [...output],
            commandHistory: [...prev.commandHistory, trimmedInput],
            historyIndex: -1,
          }));
          return;
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output.push('cat: missing file operand');
          break;
        }
        const targetPath = resolvePath(args[0], state.currentPath);
        const node = getNode(targetPath);

        if (!node) {
          output.push(`cat: ${args[0]}: No such file or directory`);
        } else if (node.type === 'directory') {
          output.push(`cat: ${args[0]}: Is a directory`);
        } else {
          output.push(node.content || '');
        }
        break;
      }

      case 'mkdir': {
        if (!args[0]) {
          output.push('mkdir: missing operand');
          break;
        }
        const parentPath = state.currentPath;
        const parentNode = getNode(parentPath);
        if (parentNode?.type === 'directory' && parentNode.children) {
          if (parentNode.children[args[0]]) {
            output.push(`mkdir: cannot create directory '${args[0]}': File exists`);
          } else {
            parentNode.children[args[0]] = { type: 'directory', children: {} };
            output.push(`Directory '${args[0]}' created`);
          }
        }
        break;
      }

      case 'touch': {
        if (!args[0]) {
          output.push('touch: missing file operand');
          break;
        }
        const parentNode = getNode(state.currentPath);
        if (parentNode?.type === 'directory' && parentNode.children) {
          if (!parentNode.children[args[0]]) {
            parentNode.children[args[0]] = { type: 'file', content: '' };
          }
        }
        break;
      }

      case 'rm': {
        if (!args[0]) {
          output.push('rm: missing operand');
          break;
        }
        const parentNode = getNode(state.currentPath);
        if (parentNode?.type === 'directory' && parentNode.children) {
          if (!parentNode.children[args[0]]) {
            output.push(`rm: cannot remove '${args[0]}': No such file or directory`);
          } else if (parentNode.children[args[0]].type === 'directory') {
            output.push(`rm: cannot remove '${args[0]}': Is a directory`);
          } else {
            delete parentNode.children[args[0]];
          }
        }
        break;
      }

      case 'whoami':
        output.push(state.user);
        break;

      case 'date':
        output.push(new Date().toString());
        break;

      case 'uname':
        if (args[0] === '-a') {
          output.push('CustomLinux linux-terminal 5.15.0-custom #1 SMP Web Browser x86_64 GNU/Linux');
        } else {
          output.push('CustomLinux');
        }
        break;

      case 'history':
        state.commandHistory.forEach((cmd, i) => {
          output.push(`  ${i + 1}  ${cmd}`);
        });
        break;

      case 'neofetch':
        output.push(`
        .--.          ${state.user}@${state.hostname}
       |o_o |         -----------------
       |:_/ |         OS: Custom Linux 1.0
      //   \\ \\        Host: Web Browser
     (|     | )       Kernel: 5.15.0-custom
    /'\\_   _/\`\\       Shell: bash 5.1.16
    \\___)=(___/       Terminal: Web Terminal
                      CPU: JavaScript Engine
                      Memory: Unlimited
`);
        break;

      case 'cowsay': {
        const text = argString || 'Moo!';
        const border = '-'.repeat(text.length + 2);
        output.push(`
 ${border}
< ${text} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`);
        break;
      }

      case 'fortune':
        const fortunes = [
          'The best way to predict the future is to create it.',
          'Code is like humor. When you have to explain it, it\'s bad.',
          'First, solve the problem. Then, write the code.',
          'Experience is the name everyone gives to their mistakes.',
          'The only way to learn a new programming language is by writing programs in it.',
          'Simplicity is the soul of efficiency.',
          'Talk is cheap. Show me the code.',
        ];
        output.push(fortunes[Math.floor(Math.random() * fortunes.length)]);
        break;

      case 'exit':
        output.push('logout');
        output.push('Thanks for using Custom Linux Terminal!');
        break;

      default:
        output.push(`${command}: command not found`);
    }

    setState(prev => ({
      ...prev,
      history: [...prev.history, ...output],
      commandHistory: [...prev.commandHistory, trimmedInput],
      historyIndex: -1,
    }));
  }, [state, getPrompt, getNode, resolvePath]);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    const { commandHistory, historyIndex } = state;
    
    if (commandHistory.length === 0) return '';

    let newIndex: number;
    if (direction === 'up') {
      newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 
        ? -1 
        : Math.min(commandHistory.length - 1, historyIndex + 1);
      if (historyIndex === commandHistory.length - 1) {
        setState(prev => ({ ...prev, historyIndex: -1 }));
        return '';
      }
    }

    setState(prev => ({ ...prev, historyIndex: newIndex }));
    return commandHistory[newIndex] || '';
  }, [state]);

  return {
    history: state.history,
    prompt: getPrompt(),
    executeCommand,
    navigateHistory,
  };
};

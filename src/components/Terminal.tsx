import React, { useState, useRef, useEffect } from 'react';
import { useTerminal } from '@/hooks/useTerminal';

const Terminal: React.FC = () => {
  const { history, prompt, executeCommand, navigateHistory } = useTerminal();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCommand = navigateHistory('up');
      setInput(prevCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = navigateHistory('down');
      setInput(nextCommand);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion could be added here
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setInput('');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      executeCommand('clear');
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const renderLine = (line: string, index: number) => {
    // Handle directory highlighting (blue color)
    const processedLine = line.replace(
      /\x1b\[1;34m([^\x1b]+)\x1b\[0m/g,
      '<span class="text-terminal-directory font-bold">$1</span>'
    );

    return (
      <div 
        key={index} 
        className="terminal-line whitespace-pre-wrap break-all"
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
  };

  return (
    <div 
      className="terminal-container"
      onClick={handleTerminalClick}
    >
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button terminal-button-close" />
          <span className="terminal-button terminal-button-minimize" />
          <span className="terminal-button terminal-button-maximize" />
        </div>
        <div className="terminal-title">user@linux-terminal: ~</div>
        <div className="w-14" />
      </div>
      
      <div 
        ref={terminalRef}
        className="terminal-body"
      >
        {history.map((line, index) => renderLine(line, index))}
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">{prompt}</span>
          <span className="terminal-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
            <span className="terminal-cursor" />
          </span>
        </form>
      </div>
    </div>
  );
};

export default Terminal;

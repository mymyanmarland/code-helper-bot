import React from 'react';
import { motion } from 'framer-motion';

const AIBackground: React.FC = () => {
  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  // Generate grid lines
  const gridLines = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    isHorizontal: i < 10,
    position: (i % 10) * 10 + 5,
  }));

  // Generate neural nodes
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: Math.random() * 60 + 40,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, hsl(var(--terminal-prompt) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(var(--terminal-maximize) / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(var(--terminal-directory) / 0.05) 0%, transparent 70%),
            hsl(var(--terminal-bg))
          `
        }}
      />

      {/* Animated gradient orbs */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            background: `radial-gradient(circle, hsl(var(--terminal-prompt) / 0.2) 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.5, 0.3, 0.3],
          }}
          transition={{
            duration: 15 + node.id * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {gridLines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.isHorizontal ? "0%" : `${line.position}%`}
            y1={line.isHorizontal ? `${line.position}%` : "0%"}
            x2={line.isHorizontal ? "100%" : `${line.position}%`}
            y2={line.isHorizontal ? `${line.position}%` : "100%"}
            stroke="hsl(var(--terminal-border))"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{
              duration: 2,
              delay: line.id * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'hsl(var(--terminal-fg))',
            boxShadow: `0 0 ${particle.size * 2}px hsl(var(--terminal-fg) / 0.5)`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Connection lines between nodes */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.slice(0, 4).map((node, i) => {
          const nextNode = nodes[(i + 1) % 4];
          return (
            <motion.line
              key={`connection-${i}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${nextNode.x}%`}
              y2={`${nextNode.y}%`}
              stroke="hsl(var(--terminal-prompt))"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                strokeDashoffset: [0, 100],
              }}
              transition={{
                duration: 5,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
              strokeDasharray="5 10"
            />
          );
        })}
      </svg>

      {/* Pulsing center glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--terminal-fg) / 0.05) 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(var(--terminal-fg)) 2px,
            hsl(var(--terminal-fg)) 4px
          )`,
        }}
      />
    </div>
  );
};

export default AIBackground;

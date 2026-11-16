import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`relative rounded-2xl bg-gradient-to-br from-[#0f1b3d]/60 via-[#0a1128]/80 to-[#020617]/90 backdrop-blur-xl border p-6 transition-all duration-300 ${
        glow
          ? 'border-cyan-400/40 shadow-[0_0_30px_rgba(0,212,255,0.15)]'
          : 'border-cyan-500/10'
      } ${
        hover
          ? 'hover:border-cyan-400/40 hover:shadow-[0_8px_30px_rgba(0,212,255,0.1)]'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Corner aesthetic notches for aerospace UI feel */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/40 pointer-events-none rounded-tl" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40 pointer-events-none rounded-tr" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/40 pointer-events-none rounded-bl" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/40 pointer-events-none rounded-br" />

      {children}
    </motion.div>
  );
}

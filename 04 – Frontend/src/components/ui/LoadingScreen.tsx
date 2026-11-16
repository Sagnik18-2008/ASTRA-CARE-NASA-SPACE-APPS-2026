import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`${sizeMap[size]} border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,212,255,0.4)]`}
    />
  );
}

export default function LoadingScreen({ message = 'Synchronizing Deep Space Telemetry...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl bg-slate-900/40 border border-cyan-500/20 backdrop-blur-xl max-w-sm w-full mx-4"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.3)]">
            <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 animate-ping opacity-30" />
        </div>

        <div className="text-2xl font-black tracking-widest text-white mb-2">
          ASTRA<span className="text-cyan-400 ml-1 glow-text">CARE</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <LoadingSpinner size="sm" />
          <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase">
            {message}
          </span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}

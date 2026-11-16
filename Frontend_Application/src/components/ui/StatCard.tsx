import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'cyan' | 'green' | 'amber' | 'red';
  subtext?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = 'cyan',
  subtext,
}: StatCardProps) {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-400/50',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-400/30',
      glow: 'shadow-[0_0_20px_rgba(0,212,255,0.08)]',
      valColor: 'text-cyan-300',
    },
    green: {
      border: 'border-emerald-500/20 hover:border-emerald-400/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30',
      glow: 'shadow-[0_0_20px_rgba(52,211,153,0.08)]',
      valColor: 'text-emerald-300',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-400/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-400/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
      valColor: 'text-amber-300',
    },
    red: {
      border: 'border-rose-500/20 hover:border-rose-400/50',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-400/30',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.08)]',
      valColor: 'text-rose-300',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl bg-[#0a1128]/70 border ${scheme.border} p-5 backdrop-blur-md transition-all duration-300 ${scheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`p-2.5 rounded-xl border ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${scheme.valColor}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-slate-400 font-medium">{unit}</span>
        )}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1 font-mono">
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
              {trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
              <span className={trend === 'up' ? 'text-cyan-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}>
                {trendValue || trend}
              </span>
            </div>
          )}
          {subtext && <span className="text-slate-500 font-mono text-[11px]">{subtext}</span>}
        </div>
      )}
    </motion.div>
  );
}

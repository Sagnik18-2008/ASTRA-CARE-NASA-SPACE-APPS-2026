import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}
    >
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-[11px] font-mono tracking-widest uppercase text-cyan-300 mb-3 shadow-[0_0_15px_rgba(0,212,255,0.1)] ${isCenter ? 'mx-auto' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-light">
          {subtitle}
        </p>
      )}

      <div className={`mt-5 flex items-center gap-2 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
        <div className="w-12 h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
      </div>
    </motion.div>
  );
}

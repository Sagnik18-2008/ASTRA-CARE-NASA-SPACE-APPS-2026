import { getSeverityColor, getSeverityBg } from '../../utils/helpers';

interface AlertBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md';
  className?: string;
}

export default function AlertBadge({ severity, size = 'sm', className = '' }: AlertBadgeProps) {
  const textColor = getSeverityColor(severity);
  const bgAndBorder = getSeverityBg(severity);

  const dotColor = {
    critical: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    high: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    medium: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    low: 'bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.8)]',
  }[severity] || 'bg-slate-400';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider font-semibold backdrop-blur-sm ${bgAndBorder} ${textColor} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${severity === 'critical' || severity === 'high' ? 'animate-ping' : ''}`} />
      <span>{severity}</span>
    </span>
  );
}

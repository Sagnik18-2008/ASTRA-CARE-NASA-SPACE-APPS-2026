export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-amber-400';
    case 'low': return 'text-cyan-400';
    default: return 'text-slate-400';
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 border-red-500/30';
    case 'high': return 'bg-orange-500/20 border-orange-500/30';
    case 'medium': return 'bg-amber-500/20 border-amber-500/30';
    case 'low': return 'bg-cyan-500/20 border-cyan-500/30';
    default: return 'bg-slate-500/20 border-slate-500/30';
  }
}

export function getRiskColor(score: number): string {
  if (score <= 25) return '#22d3ee';
  if (score <= 50) return '#34d399';
  if (score <= 75) return '#f59e0b';
  return '#f43f5e';
}

export function getRiskLabel(score: number): string {
  if (score <= 25) return 'Low Risk';
  if (score <= 50) return 'Moderate';
  if (score <= 75) return 'Elevated';
  return 'High Risk';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

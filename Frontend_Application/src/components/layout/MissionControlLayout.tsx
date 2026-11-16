import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Radio, 
  Activity, 
  UserCheck, 
  Dna, 
  BrainCircuit, 
  FileText, 
  LineChart, 
  ExternalLink,
  Compass,
  AlertTriangle,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { dashboardService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import type { SystemDashboardStats } from '../../types';

interface NavRoute {
  name: string;
  path: string;
  icon: typeof Activity;
  badge?: string;
}

const MISSION_ROUTES: NavRoute[] = [
  { name: 'Mission Overview', path: '/app/overview', icon: Compass },
  { name: 'Astronaut Digital Twin', path: '/app/digital-twin', icon: UserCheck, badge: '3D' },
  { name: 'Biomarker Intelligence', path: '/app/biomarkers', icon: Dna },
  { name: 'AI Intelligence Centre', path: '/app/ai-intelligence', icon: BrainCircuit, badge: 'ML' },
  { name: 'Medical Records', path: '/app/medical-records', icon: FileText },
  { name: 'Alert Centre', path: '/app/alerts', icon: Bell },
  { name: 'Mission Analytics', path: '/app/analytics', icon: LineChart },
];

export default function MissionControlLayout() {
  const [utcTime, setUtcTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { data: stats, loading: statsLoading, error: apiError } = useApi<SystemDashboardStats>(
    () => dashboardService.getStats()
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Aerospace Command Bar */}
      <header className="h-16 border-b border-cyan-500/20 bg-[#060d24]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Platform Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.25)]">
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center text-base font-black tracking-widest text-white leading-none">
                <span>ASTRA</span>
                <span className="text-cyan-400 ml-1 glow-text">CARE</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 ml-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  MISSION CONTROL
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 block mt-0.5">
                ASTRONAUT HEALTH DATA
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Telemetry Status Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Supabase Connection State */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${apiError ? 'bg-rose-400' : stats ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className="text-slate-400">BACKEND:</span>
            <span className={apiError ? 'text-rose-400' : stats ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {apiError ? 'UNAVAILABLE' : statsLoading ? 'CONNECTING' : stats ? 'CONNECTED' : 'UNKNOWN'}
            </span>
          </div>

          {/* Active Alerts Pill */}
          {stats && stats.active_alerts > 0 && (
            <Link
              to="/app/alerts"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 transition-colors shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{stats.active_alerts} ALERTS</span>
            </Link>
          )}

          {/* UTC Mission Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">{utcTime || '00:00:00 UTC'}</span>
          </div>

          {/* Return to Public Portal */}
          <Link
            to="/"
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Mission Control Shell: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Aerospace Mission Sidebar */}
        <aside
          className={`w-64 border-r border-cyan-500/20 bg-[#060d24]/95 flex flex-col justify-between py-6 px-3 z-30 transition-transform duration-300 fixed lg:static top-16 bottom-0 left-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {/* Mission Header Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 mb-1">
                <span>ASTRA-CARE DATA</span>
                <span className={apiError ? 'text-rose-400' : stats ? 'text-emerald-400' : 'text-slate-500'}>
                  {apiError ? 'UNAVAILABLE' : stats ? 'CONNECTED' : '—'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">MISSION MONITORING</h4>
              <p className="text-[11px] text-cyan-400/80 font-mono mt-0.5">
                ASTRONAUTS: {stats?.total_astronauts ?? '—'}
              </p>
            </div>

            {/* Navigation Section */}
            <nav className="space-y-1">
              <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-2">
                MISSION SYSTEMS
              </span>
              {MISSION_ROUTES.map((route) => {
                const Icon = route.icon;
                return (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,212,255,0.2)] font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{route.name}</span>
                    </div>
                    {route.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                        {route.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>HEALTH RECORDS:</span>
              <span className="text-cyan-400">{stats?.total_health_records ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>BIOMARKERS:</span>
              <span className="text-emerald-400">{stats?.total_biomarkers ?? '—'}</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { 
  Users, 
  ChevronRight,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import SpaceScene from '../../components/3d/SpaceScene';
import { astronautService, dashboardService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import { getInitials } from '../../utils/helpers';
import type { Astronaut, SystemDashboardStats } from '../../types';

function isPlaceholderAstronaut(astronaut: Astronaut) {
  return [astronaut.full_name, astronaut.astronaut_code, astronaut.mission]
    .some((value) => value?.trim().toLowerCase() === 'string');
}

export default function MissionOverviewScreen() {
  const { data: astronauts, loading: loadingCrew, error: crewError } = useApi<Astronaut[]>(
    () => astronautService.getAll()
  );

  const { data: stats, loading: loadingStats, error: statsError } = useApi<SystemDashboardStats>(
    () => dashboardService.getStats()
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Real-time 3D Earth Orbit Preview */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0a1128]/95 via-[#060d24]/90 to-[#020617] p-6 lg:p-10 shadow-[0_0_40px_rgba(0,212,255,0.12)]">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-35 pointer-events-none hidden lg:block">
          <SpaceScene enableControls={false} autoRotateSpeed={0.4} cameraDistance={5.8} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stats ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              BACKEND STATUS: {stats ? 'CONNECTED' : 'UNAVAILABLE'}
            </span>
            <span className="text-xs font-mono text-slate-400">DATA SOURCE: {stats ? 'DATABASE SUMMARY' : '—'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Astronaut Health Mission Control
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-light mb-8">
            Mission health records and biomarker data retrieved from the ASTRA-CARE backend. Values shown below reflect records currently available from the connected database.
          </p>
          <p className="mb-4 text-[11px] text-slate-400">
            Counts reflect stored rows and may include test or placeholder records when present.
          </p>

          {(crewError || statsError) && (
            <p role="alert" className="mb-4 text-xs text-rose-300">
              {crewError || statsError}
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 font-mono">
            <div>
              <span className="text-[10px] uppercase text-slate-400">ASTRONAUTS</span>
              <p className="text-2xl font-bold text-cyan-300 mt-1">{stats?.total_astronauts ?? '—'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400">HEALTH LOGS</span>
              <p className="text-2xl font-bold text-white mt-1">{stats?.total_health_records ?? '—'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400">BIOMARKERS</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.total_biomarkers ?? '—'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400">OPEN ALERTS</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">{stats?.active_alerts ?? '—'}</p>
            </div>
          </div>
          {loadingStats && <p className="mt-3 text-xs text-slate-500">Loading database statistics…</p>}
        </div>
      </div>

      {/* Flight Crew Telemetry Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Astronaut Records & Digital Twins
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              SELECT AN ASTRONAUT TO ENGAGE INTERACTIVE 3D ANATOMICAL ANALYSIS
            </p>
          </div>
        </div>

        {loadingCrew && <p className="text-sm text-slate-400">Loading astronaut records…</p>}
        {!loadingCrew && !crewError && astronauts?.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            No astronaut records are currently available.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astronauts?.map((ast) => (
            <GlassCard key={ast.id} className="p-6 flex flex-col justify-between group hover:border-cyan-400/50">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold font-mono text-xl shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                    {getInitials(ast.full_name || ast.name || ast.astronaut_code || 'Astronaut')}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold ${
                    isPlaceholderAstronaut(ast)
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {isPlaceholderAstronaut(ast) ? 'PLACEHOLDER RECORD' : 'DATABASE RECORD'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {ast.full_name || ast.name || ast.astronaut_code || `Astronaut #${ast.id}`}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  ID: #{ast.id}{ast.astronaut_code ? ` • CODE: ${ast.astronaut_code}` : ''}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-2">
                  Mission: {ast.mission || ast.mission_name || 'Not recorded'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link
                  to={`/app/digital-twin?astronaut=${ast.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-300 text-black text-xs font-mono font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
                >
                  <span>Launch 3D Digital Twin</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

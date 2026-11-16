import { useMemo, useState } from 'react';
import { BarChart2, Heart, RefreshCw, Users } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { astronautService, dashboardService, healthRecordService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import type { Astronaut, HealthRecord, SystemDashboardStats } from '../../types';

export function MissionAnalyticsScreen() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<number | string>('');
  const { data: astronauts, loading: loadingAstronauts, error: astronautError } =
    useApi<Astronaut[]>(() => astronautService.getAll());
  const { data: stats, loading: loadingStats, error: statsError } =
    useApi<SystemDashboardStats>(() => dashboardService.getStats());

  const activeAstronautId = selectedAstronautId || astronauts?.[0]?.id || '';

  const {
    data: records,
    loading: loadingRecords,
    error: recordError,
    refetch,
  } = useApi<HealthRecord[]>(
    () => activeAstronautId ? healthRecordService.getAll(activeAstronautId) : Promise.resolve([]),
    [activeAstronautId],
  );
  const chartData = useMemo(() => [...(records || [])].reverse()
    .filter((record) => record.recorded_at || record.record_date)
    .map((record) => ({
      timestamp: record.recorded_at || record.record_date || '',
      heart_rate: record.heart_rate,
      spo2: record.spo2 ?? record.oxygen_saturation,
    })), [records]);
  const latest = records?.[0];
  const errors = [astronautError, statsError, recordError].filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            <BarChart2 className="w-4 h-4" /> Database-backed summary
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Mission Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Charts show recorded measurements only; no projections or clinical assessments are generated.</p>
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Select astronaut"
            value={activeAstronautId}
            onChange={(event) => setSelectedAstronautId(event.target.value)}
            disabled={!astronauts?.length}
            className="bg-slate-900 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs text-white"
          >
            {astronauts?.map((astronaut) => <option key={astronaut.id} value={astronaut.id}>{astronaut.full_name || astronaut.name || `Astronaut #${astronaut.id}`}</option>)}
          </select>
          <button onClick={() => void refetch()} disabled={loadingRecords} aria-label="Refresh records" className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loadingRecords ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {errors.length > 0 && <p role="alert" className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">{errors[0]}</p>}
      {(loadingAstronauts || loadingStats || loadingRecords) && <p className="text-xs text-slate-400">Loading database analytics…</p>}
      {!loadingAstronauts && !astronautError && astronauts?.length === 0 && <p className="p-5 rounded-xl border border-slate-800 text-sm text-slate-400">No astronaut records are available.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Users className="w-4 h-4 text-cyan-400" />Astronauts</div>
          <p className="text-2xl font-bold text-white mt-2">{stats?.total_astronauts ?? '—'}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Health records</span>
          <p className="text-2xl font-bold text-white mt-2">{stats?.total_health_records ?? '—'}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Biomarker records</span>
          <p className="text-2xl font-bold text-white mt-2">{stats?.total_biomarkers ?? '—'}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Heart className="w-4 h-4 text-rose-400" />Latest heart rate</div>
          <p className="text-2xl font-bold text-white mt-2">{latest?.heart_rate === undefined ? '—' : `${latest.heart_rate} bpm`}</p>
        </div>
      </div>

      <section className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
        <h2 className="text-sm font-semibold text-white uppercase font-mono mb-1">Recorded vital measurements</h2>
        <p className="text-xs text-slate-500 mb-4">Only timestamped heart-rate and SpO₂ measurements are plotted, using separate axes.</p>
        <div className="h-72">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="heart-rate" stroke="#f43f5e" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="spo2" orientation="right" stroke="#06b6d4" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0a1026', borderColor: '#06b6d4', borderRadius: '8px' }} />
                <Legend />
                <Line yAxisId="heart-rate" type="monotone" dataKey="heart_rate" name="Heart rate (bpm)" stroke="#f43f5e" connectNulls={false} />
                <Line yAxisId="spo2" type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#06b6d4" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : recordError ? (
            <div className="h-full flex items-center justify-center text-xs text-rose-300">
              Chart unavailable because health records could not be loaded.
            </div>
          ) : !loadingRecords ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No timestamped health records are available for this astronaut.
            </div>
          ) : null}
        </div>
      </section>

      <p className="text-[11px] text-slate-500">
        Backend statistics summarize stored records. They are not estimates of mission safety, astronaut condition, radiation exposure, or model performance.
      </p>
    </div>
  );
}

export default MissionAnalyticsScreen;

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface VitalDataPoint {
  date: string;
  heart_rate?: number;
  oxygen_saturation?: number;
  body_temperature?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
}

interface VitalSignsChartProps {
  data: VitalDataPoint[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a1128]/95 border border-cyan-500/30 rounded-xl p-3 shadow-[0_4px_20px_rgba(0,212,255,0.15)] backdrop-blur-md text-xs font-mono">
        <p className="text-slate-400 mb-2 border-b border-slate-700/60 pb-1 font-semibold">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {entry.value}
                {entry.name.includes('Heart') ? ' bpm' : entry.name.includes('Oxygen') ? ' %' : ' °C'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function VitalSignsChart({ data }: VitalSignsChartProps) {
  const [activeMetric, setActiveMetric] = useState<'all' | 'hr' | 'spo2' | 'temp'>('all');

  // Format date labels
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="w-full">
      {/* Metric Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-3 border-b border-slate-800">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Physiological Chrono-Log
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-700/60 text-xs font-mono">
          <button
            onClick={() => setActiveMetric('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('hr')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'hr'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setActiveMetric('spo2')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'spo2'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SpO2
          </button>
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeMetric === 'temp'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Temp
          </button>
        </div>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="formattedDate"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '16px', fontSize: '11px', fontFamily: 'monospace' }}
            />

            {(activeMetric === 'all' || activeMetric === 'hr') && (
              <Line
                type="monotone"
                dataKey="heart_rate"
                name="Heart Rate"
                stroke="#00d4ff"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00d4ff', stroke: '#020617', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#00d4ff', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'spo2') && (
              <Line
                type="monotone"
                dataKey="oxygen_saturation"
                name="Oxygen Saturation"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#34d399', stroke: '#020617', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'temp') && (
              <Line
                type="monotone"
                dataKey="body_temperature"
                name="Body Temp"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#f59e0b', stroke: '#020617', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

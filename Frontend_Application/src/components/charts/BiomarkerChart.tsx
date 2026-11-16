import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Biomarker } from '../../types';

interface BiomarkerChartProps {
  biomarkers: Biomarker[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: Biomarker }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#0a1128]/95 border border-cyan-500/30 rounded-xl p-3 shadow-[0_4px_20px_rgba(0,212,255,0.15)] backdrop-blur-md text-xs font-mono">
        <p className="font-bold text-white text-sm mb-1">{item.marker_name}</p>
        <div className="space-y-1 text-slate-300">
          <p className="flex justify-between gap-4">
            <span>Value:</span>
            <span className="font-bold text-cyan-300">
              {item.marker_value} {item.unit}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function BiomarkerChart({ biomarkers }: BiomarkerChartProps) {
  const chartData = biomarkers.map((record) => ({
    ...record,
    chart_label: record.timepoint || record.recorded_at || `Record #${record.id}`,
  }));

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          <XAxis
            dataKey="chart_label"
            stroke="#64748b"
            fontSize={10}
            fontFamily="monospace"
            angle={-30}
            textAnchor="end"
            tickLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            fontFamily="monospace"
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="marker_value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

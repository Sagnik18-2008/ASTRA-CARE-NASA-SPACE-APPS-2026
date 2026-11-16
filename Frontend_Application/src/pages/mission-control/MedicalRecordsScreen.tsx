import { useMemo, useState } from 'react';
import { Activity, FileText, Heart, Plus, RefreshCw, Search, Thermometer, X } from 'lucide-react';
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
import { astronautService, healthRecordService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import { getApiErrorMessage } from '../../services/api';
import type { Astronaut, HealthRecord, HealthRecordCreatePayload } from '../../types';

function displayMeasurement(value: number | undefined, unit: string) {
  return value === undefined || value === null ? '—' : `${value} ${unit}`;
}

export function MedicalRecordsScreen() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<number | string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRecords, setCreatedRecords] = useState<HealthRecord[]>([]);
  const [form, setForm] = useState({ heart_rate: '', spo2: '', body_temperature: '', source: '', notes: '' });

  const { data: astronauts, loading: loadingAstronauts, error: astronautError } =
    useApi<Astronaut[]>(() => astronautService.getAll());
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

  const allRecords = useMemo(() => {
    const items = new Map((records || []).map((record) => [String(record.id), record]));
    createdRecords
      .filter((record) => String(record.astronaut_id) === String(activeAstronautId))
      .forEach((record) => items.set(String(record.id), record));
    return Array.from(items.values()).sort((left, right) =>
      (right.recorded_at || right.record_date || '').localeCompare(left.recorded_at || left.record_date || ''),
    );
  }, [records, createdRecords, activeAstronautId]);
  const latest = allRecords[0];
  const filteredRecords = useMemo(() => allRecords.filter((record) =>
    `${record.source || ''} ${record.notes || ''}`.toLowerCase().includes(searchQuery.toLowerCase()),
  ), [allRecords, searchQuery]);
  const chartData = useMemo(() => [...allRecords].reverse()
    .filter((record) => record.recorded_at || record.record_date)
    .map((record) => ({
      time: new Date(record.recorded_at || record.record_date || '').toLocaleString(),
      heart_rate: record.heart_rate,
      spo2: record.spo2 ?? record.oxygen_saturation,
    })), [allRecords]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeAstronautId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload: HealthRecordCreatePayload = {
        astronaut_id: Number(activeAstronautId),
        ...(form.heart_rate !== '' ? { heart_rate: Number(form.heart_rate) } : {}),
        ...(form.spo2 !== '' ? { spo2: Number(form.spo2) } : {}),
        ...(form.body_temperature !== '' ? { body_temperature: Number(form.body_temperature) } : {}),
        ...(form.source.trim() ? { source: form.source.trim() } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      };
      const created = await healthRecordService.create(payload);
      setCreatedRecords((previous) => [created, ...previous]);
      setModalOpen(false);
      setForm({ heart_rate: '', spo2: '', body_temperature: '', source: '', notes: '' });
      await refetch();
    } catch (error: unknown) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            <FileText className="w-4 h-4" /> Health records
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Medical & Telemetry Records</h1>
          <p className="text-sm text-slate-400 mt-1">Values and timestamps are displayed from stored records; test/placeholder entries may be present, and no clinical status is inferred.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Select astronaut"
            value={activeAstronautId}
            onChange={(event) => setSelectedAstronautId(event.target.value)}
            disabled={!astronauts?.length}
            className="bg-slate-900 border border-cyan-500/20 rounded-lg px-3 py-2 text-xs text-white"
          >
            {astronauts?.map((astronaut) => (
              <option key={astronaut.id} value={astronaut.id}>
                {astronaut.full_name || astronaut.name || `Astronaut #${astronaut.id}`}
              </option>
            ))}
          </select>
          <button onClick={() => void refetch()} disabled={loadingRecords} aria-label="Refresh records" className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loadingRecords ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setSubmitError(null); setModalOpen(true); }} disabled={!selectedAstronautId} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add record
          </button>
        </div>
      </header>

      {(astronautError || recordError) && (
        <p role="alert" className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
          {astronautError || recordError}
        </p>
      )}
      {loadingAstronauts && <p className="text-xs text-slate-400">Loading astronaut records…</p>}
      {loadingRecords && <p className="text-xs text-slate-400">Loading health records…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Heart className="w-4 h-4 text-rose-400" />Heart rate</div>
          <p className="text-2xl font-bold text-white mt-2">{displayMeasurement(latest?.heart_rate, 'bpm')}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Activity className="w-4 h-4 text-cyan-400" />Oxygen saturation</div>
          <p className="text-2xl font-bold text-white mt-2">{displayMeasurement(latest?.spo2 ?? latest?.oxygen_saturation, '%')}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-slate-400"><Thermometer className="w-4 h-4 text-amber-400" />Body temperature</div>
          <p className="text-2xl font-bold text-white mt-2">{displayMeasurement(latest?.body_temperature, '(unit not recorded)')}</p>
        </div>
      </div>

      <section className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
        <h2 className="text-sm font-semibold text-white uppercase font-mono mb-1">Recorded heart rate and SpO₂</h2>
        <p className="text-xs text-slate-500 mb-4">Only records with a stored timestamp are plotted; axes display the values as recorded.</p>
        <div className="h-64">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
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
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No timestamped measurements are available to chart.
            </div>
          )}
        </div>
      </section>

      <section className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-white uppercase font-mono">Health record history</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search source or notes" className="pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-3">ID</th><th className="py-3 px-3">Recorded at</th><th className="py-3 px-3">Heart rate</th><th className="py-3 px-3">SpO₂</th><th className="py-3 px-3">Temperature</th><th className="py-3 px-3">Source</th><th className="py-3 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-cyan-950/20">
                  <td className="py-3 px-3 text-cyan-400">#{record.id}</td>
                  <td className="py-3 px-3 text-slate-300">{record.recorded_at ? new Date(record.recorded_at).toLocaleString() : 'Unavailable'}</td>
                  <td className="py-3 px-3 text-white">{record.heart_rate ?? '—'}</td>
                  <td className="py-3 px-3 text-white">{record.spo2 ?? record.oxygen_saturation ?? '—'}</td>
                  <td className="py-3 px-3 text-white">{record.body_temperature ?? '—'}</td>
                  <td className="py-3 px-3 text-slate-300">{record.source || 'Not recorded'}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={record.notes || ''}>{record.notes || '—'}</td>
                </tr>
              ))}
              {!loadingRecords && filteredRecords.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">{recordError ? 'Health records could not be loaded.' : 'No health records match this selection.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-cyan-500/30 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">Add health record</h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close dialog" className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="mt-3 text-xs text-slate-400">Enter a real measurement. Blank fields are omitted, not replaced with defaults.</p>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              {([
                ['heart_rate', 'Heart rate'],
                ['spo2', 'SpO₂'],
                ['body_temperature', 'Body temperature (unit as defined by your data source)'],
              ] as const).map(([field, label]) => (
                <label key={field} className="block text-xs text-slate-400">
                  {label}
                  <input type="number" step="any" value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
                </label>
              ))}
              <label className="block text-xs text-slate-400">
                Source
                <input value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </label>
              <label className="block text-xs text-slate-400">
                Notes
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={3} className="mt-1 w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white" />
              </label>
              {submitError && <p role="alert" className="text-xs text-rose-300">{submitError}</p>}
              <div className="flex justify-end gap-2 border-t border-slate-800 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs text-slate-300">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50">{isSubmitting ? 'Saving…' : 'Save record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecordsScreen;

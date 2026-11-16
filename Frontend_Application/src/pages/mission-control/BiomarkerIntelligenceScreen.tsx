import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  FlaskConical, 
  Plus, 
  Search, 
  X,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import BiomarkerChart from '../../components/charts/BiomarkerChart';
import { biomarkerService, astronautService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import { getApiErrorMessage } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Biomarker, BiomarkerCreatePayload, Astronaut } from '../../types';

export default function BiomarkerIntelligenceScreen() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<number | string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBiomarkers, setCreatedBiomarkers] = useState<Biomarker[]>([]);

  const [newAnalyte, setNewAnalyte] = useState('');
  const [newConcentration, setNewConcentration] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newTimepoint, setNewTimepoint] = useState('');

  const { data: astronauts, loading: loadingAstronauts, error: astronautError } = useApi<Astronaut[]>(
    () => astronautService.getAll()
  );

  const activeAstronautId = selectedAstronautId || astronauts?.[0]?.id || '';

  const { data: biomarkers, loading: loadingBiomarkers, error: biomarkerError, refetch } = useApi<Biomarker[]>(
    () => activeAstronautId ? biomarkerService.getAll(activeAstronautId) : Promise.resolve([]),
    [activeAstronautId]
  );

  const allBiomarkers = useMemo(() => {
    const records = new Map((biomarkers || []).map((record) => [String(record.id), record]));
    createdBiomarkers
      .filter((record) => String(record.astronaut_id) === String(activeAstronautId))
      .forEach((record) => records.set(String(record.id), record));
    return Array.from(records.values());
  }, [biomarkers, createdBiomarkers, activeAstronautId]);

  const filteredBiomarkers = useMemo(() => {
    let list = allBiomarkers;
    if (searchQuery) {
      list = list.filter((b) => 
        (b.analyte || b.marker_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [allBiomarkers, searchQuery]);
  const chartableBiomarkers = filteredBiomarkers.filter((record) =>
    (record.concentration ?? record.marker_value) !== undefined
    && (record.concentration ?? record.marker_value) !== null
    && Boolean(record.unit)
    && Boolean(record.analyte || record.marker_name),
  );
  const chartUnits = new Set(chartableBiomarkers.map((record) => record.unit));
  const chartAnalytes = new Set(chartableBiomarkers.map((record) => record.analyte || record.marker_name));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: BiomarkerCreatePayload = {
        astronaut_id: Number(activeAstronautId),
        analyte: newAnalyte,
        concentration: parseFloat(newConcentration),
        unit: newUnit,
        ...(newTimepoint.trim() ? { timepoint: newTimepoint.trim() } : {}),
      };

      const created = await biomarkerService.create(payload);
      setCreatedBiomarkers((previous) => [created, ...previous]);
      setModalOpen(false);
      setNewAnalyte('');
      setNewConcentration('');
      setNewUnit('');
      setNewTimepoint('');
      await refetch();
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Command Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <Dna className="w-4 h-4" />
            <span>MULTI-OMICS & LIQUID BIOPSY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Biomarker Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Astronaut Selector */}
          <select
            value={activeAstronautId}
            onChange={(e) => setSelectedAstronautId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 focus:outline-none"
          >
            {astronauts?.map((ast) => (
              <option key={ast.id} value={ast.id}>
                {ast.name || ast.full_name} (ID: #{ast.id})
              </option>
            ))}
          </select>

          {/* New Sample Log Action Button */}
          <button
            onClick={() => setModalOpen(true)}
            disabled={!selectedAstronautId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Biomarker</span>
          </button>
        </div>
      </div>

      {/* Biomarker Visualization Chart */}
      <GlassCard className="p-6" glow>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              Raw Readings (one analyte and unit)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Values retrieved from the selected astronaut's biomarker records. No clinical interpretation is applied.
            </p>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            biomarkerError ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
            biomarkers ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' :
            'bg-slate-500/10 border-slate-500/30 text-slate-300'
          }`}>
            {biomarkerError ? 'API ERROR' : loadingBiomarkers ? 'LOADING' : 'DATABASE RECORDS'}
          </span>
        </div>
        {biomarkerError && <p role="alert" className="mb-3 text-xs text-rose-300">{biomarkerError}</p>}
        {loadingBiomarkers && <p className="mb-3 text-xs text-slate-400">Loading biomarker records…</p>}
        {loadingBiomarkers && <p className="py-12 text-center text-xs text-slate-400">Loading chart data…</p>}
        {!loadingBiomarkers && !biomarkerError && chartUnits.size === 1 && chartAnalytes.size === 1 && <BiomarkerChart biomarkers={chartableBiomarkers} />}
        {(chartUnits.size > 1 || chartAnalytes.size > 1) && (
          <p className="py-12 text-center text-xs text-amber-300">
            Multiple analytes or units are present and are not combined on one chart. Search for one analyte to view its raw values.
          </p>
        )}
        {!loadingBiomarkers && !biomarkerError && chartUnits.size === 0 && (
          <p className="py-12 text-center text-xs text-slate-400">
            No concentration values with recorded units are available to chart.
          </p>
        )}
        {biomarkerError && <p className="py-12 text-center text-xs text-rose-300">Chart unavailable because biomarker records could not be loaded.</p>}
      </GlassCard>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search analyte or marker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredBiomarkers.length} records
        </span>
      </div>
      {astronautError && <p role="alert" className="text-xs text-rose-300">{astronautError}</p>}
      {loadingAstronauts && <p className="text-xs text-slate-400">Loading astronaut records…</p>}

      {/* Biomarker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBiomarkers.map((bm) => (
          <GlassCard key={bm.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  {bm.timepoint || 'Timepoint not recorded'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-slate-800 text-slate-300">
                  RECORDED
                </span>
              </div>

              <h4 className="text-lg font-bold text-white font-mono">
                {bm.analyte || bm.marker_name}
              </h4>

              <div className="mt-4 flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-black text-white">
                  {bm.concentration ?? bm.marker_value ?? '—'}
                </span>
                <span className="text-xs text-cyan-300 font-semibold">{bm.unit || 'Unit not recorded'}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{bm.recorded_at ? formatDate(bm.recorded_at) : 'Recorded time unavailable'}</span>
              <span className="flex items-center gap-2">
                Dataset: {bm.source_dataset || 'Not recorded'}
                {bm.source_dataset?.toLowerCase().includes('test') && (
                  <strong className="text-amber-300">TEST SOURCE</strong>
                )}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
      {!loadingBiomarkers && !biomarkerError && filteredBiomarkers.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
          No biomarker records are available for this astronaut.
        </div>
      )}

      {/* Log Sample Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#0a1128] border border-cyan-500/40 p-6 sm:p-8 font-mono shadow-[0_0_40px_rgba(0,212,255,0.2)]"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Log Biomarker Record</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">ANALYTE NAME</label>
                  <input
                    type="text"
                    required
                    value={newAnalyte}
                    onChange={(e) => setNewAnalyte(e.target.value)}
                    placeholder="e.g. CRP, CREATININE, CALCIUM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">CONCENTRATION</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newConcentration}
                      onChange={(e) => setNewConcentration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">UNIT</label>
                    <input
                      type="text"
                      required
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="e.g. mg/L, µg/dL, ng/mL"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">TIMEPOINT (OPTIONAL TEXT)</label>
                  <input
                    type="text"
                    value={newTimepoint}
                    onChange={(e) => setNewTimepoint(e.target.value)}
                    placeholder="Optional recorded timepoint"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {submitError && <p role="alert" className="text-xs text-rose-300">{submitError}</p>}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-black text-xs font-bold uppercase tracking-wider disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit to Database'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

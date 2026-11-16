import { useMemo, useState } from 'react';
import { BrainCircuit, History, AlertTriangle, Database } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { aiAnalysisService, astronautService, biomarkerService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import { formatDateTime } from '../../utils/helpers';
import type { AnalysisResult, Astronaut, Biomarker } from '../../types';

const FEATURE_NAMES = [
  'AGP',
  'ALBUMIN',
  'ALBUMIN/GLOBULIN RATIO',
  'ALKALINE PHOSPHATASE',
  'ALT',
  'AST',
  'BILIRUBIN; TOTAL',
  'BUN/CREATININE RATIO',
  'CALCIUM',
  'CARBON DIOXIDE',
  'CHLORIDE',
  'CREATININE',
  'CRP',
  'Fetuin A36',
  'Fibrinogen',
  'GLOBULIN',
  'GLUCOSE',
  'Haptoglobin',
  'L-Selectin',
  'PF4',
  'POTASSIUM',
  'PROTEIN; TOTAL',
  'SAP',
  'SODIUM',
  'UREA NITROGEN (BUN)',
  'a-2 Macroglobulin',
  'eGFR AFRICAN AMERICAN',
  'eGFR NON-AFR. AMERICAN',
];

export default function AIIntelligenceScreen() {
  const [selectedAstronautId, setSelectedAstronautId] = useState<number | string>('');
  const { data: astronauts, loading: loadingAstronauts, error: astronautError } =
    useApi<Astronaut[]>(() => astronautService.getAll());

  const activeAstronautId = selectedAstronautId || astronauts?.[0]?.id || '';

  const {
    data: biomarkers,
    loading: loadingBiomarkers,
    error: biomarkerError,
  } = useApi<Biomarker[]>(
    () => activeAstronautId ? biomarkerService.getAll(activeAstronautId) : Promise.resolve([]),
    [activeAstronautId],
  );
  const {
    data: historyResults,
    loading: loadingHistory,
    error: historyError,
  } = useApi<AnalysisResult[]>(
    () => activeAstronautId ? aiAnalysisService.getByAstronaut(activeAstronautId) : Promise.resolve([]),
    [activeAstronautId],
  );

  const featureEvidence = useMemo(() => FEATURE_NAMES.map((feature) => {
    const records = (biomarkers || []).filter((record) =>
      (record.analyte || record.marker_name) === feature
      && (record.concentration ?? record.marker_value) !== undefined
      && (record.concentration ?? record.marker_value) !== null,
    );
    return { feature, records };
  }), [biomarkers]);

  const recordedFeatureCount = biomarkers
    ? featureEvidence.filter(({ records }) => records.length > 0).length
    : null;
  const missingFeatures = biomarkers
    ? featureEvidence.filter(({ records }) => records.length === 0)
    : [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-cyan-400">
            <BrainCircuit className="w-4 h-4" />
            <span>EXPLORATORY UNSUPERVISED ANALYSIS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Intelligence Centre
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Runtime pipeline: median imputation, log1p, StandardScaler, and KMeans. PCA is not part of live inference.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-400">
          SUBJECT:
          <select
            value={activeAstronautId}
            onChange={(event) => setSelectedAstronautId(event.target.value)}
            disabled={!astronauts?.length}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 focus:outline-none"
          >
            {astronauts?.map((astronaut) => (
              <option key={astronaut.id} value={astronaut.id}>
                {astronaut.full_name || astronaut.name || `Astronaut #${astronaut.id}`} (ID: #{astronaut.id})
              </option>
            ))}
          </select>
        </label>
      </div>

      {(astronautError || biomarkerError || historyError) && (
        <div role="alert" className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300">
          {astronautError || biomarkerError || historyError}
        </div>
      )}
      {loadingAstronauts && <p className="text-xs text-slate-400">Loading astronaut records…</p>}
      {!loadingAstronauts && !astronautError && astronauts?.length === 0 && (
        <p className="p-5 rounded-xl border border-slate-800 text-sm text-slate-400">
          No astronaut records are available.
        </p>
      )}

      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Database coverage for the 28 model features
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Exact analyte-name matches only. Measurements are shown as stored; no unit conversion or timepoint merging is applied.
            </p>
          </div>
          <span className="text-xs text-cyan-300">{recordedFeatureCount === null ? '—' : recordedFeatureCount} / 28 names recorded</span>
        </div>

        <div className="mb-5 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200">
          <div className="flex gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Predictions are disabled for database records
          </div>
          <p className="mt-2 leading-relaxed text-amber-100/80">
            The current biomarker API has no sample or collection ID, and its records do not establish that all 28
            measurements came from one specimen with verified units and provenance. Missing values will not be
            imputed for a health prediction. Existing KMeans clusters are exploratory groupings, not diagnoses,
            clinical risk probabilities, or validated medical conclusions.
          </p>
        </div>

        {loadingBiomarkers && <p className="mb-4 text-xs text-slate-400">Loading biomarker records…</p>}
        {!loadingBiomarkers && !biomarkerError && (biomarkers?.length ?? 0) === 0 && (
          <p className="mb-4 text-xs text-slate-400">No biomarker records are available for this astronaut.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featureEvidence.map(({ feature, records }) => (
            <div key={feature} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-200 break-words">{feature}</span>
                <span className={`shrink-0 text-[9px] uppercase ${
                  biomarkers ? records.length ? 'text-amber-300' : 'text-slate-500' : 'text-slate-500'
                }`}>
                  {biomarkers ? records.length ? 'Unverified' : 'Missing' : 'Not checked'}
                </span>
              </div>
              {biomarkers && records.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {records.map((record) => (
                    <p key={record.id} className="text-[10px] text-slate-400 break-words">
                      {record.concentration ?? record.marker_value} {record.unit || '(unit not recorded)'}
                      {record.timepoint ? ` · ${record.timepoint}` : ''}
                    </p>
                  ))}
                  <p className="text-[9px] text-amber-300/80">Sample, unit, and source not verified</p>
                </div>
              ) : biomarkers ? (
                <p className="mt-2 text-[10px] text-slate-500">No exact-name value in the retrieved records</p>
              ) : (
                <p className="mt-2 text-[10px] text-slate-500">Coverage is unknown until records load</p>
              )}
            </div>
          ))}
        </div>

        {biomarkers && missingFeatures.length > 0 && (
          <p className="mt-5 text-xs text-slate-400">
            Missing exact-name measurements: {missingFeatures.map(({ feature }) => feature).join(', ')}
          </p>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            Saved analysis history
          </h2>
          <span className="text-xs text-slate-400">{historyResults?.length ?? 0} entries</span>
        </div>
        <p className="mb-4 text-[11px] text-slate-500">
          History entries are displayed as returned by the database and may include test or manually saved records.
        </p>

        {loadingHistory && <p className="py-5 text-center text-xs text-slate-400">Loading analysis history…</p>}
        {!loadingHistory && !historyError && historyResults?.length ? (
          <div className="space-y-2">
            {historyResults.map((result) => (
              <div
                key={result.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white">{result.model_name || 'Recorded model'}</span>
                  {(result.model_name || '').toLowerCase().includes('test') && (
                    <span className="text-[9px] uppercase text-amber-300">Test record</span>
                  )}
                  <span className="text-slate-400">
                    {result.prediction ? `Stored output: ${result.prediction}` : result.result_type || 'Analysis record'}
                  </span>
                </div>
                <span className="text-slate-500 text-[10px]">
                  {result.created_at ? formatDateTime(result.created_at) : 'Timestamp unavailable'}
                </span>
              </div>
            ))}
          </div>
        ) : !loadingHistory && !historyError ? (
          <p className="py-8 text-center text-slate-500 text-xs">
            No saved analysis records are available for this astronaut.
          </p>
        ) : null}
      </GlassCard>
    </div>
  );
}

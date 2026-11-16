import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserCheck, Heart, Wind, Thermometer } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import DigitalTwin3D from '../../components/3d/DigitalTwin3D';
import { astronautService, healthRecordService } from '../../services/endpoints';
import { useApi } from '../../hooks/useApi';
import type { Astronaut, BodySystemKey, HealthRecord } from '../../types';

const BODY_SYSTEMS: Record<BodySystemKey, { name: string; label: string; description: string }> = {
  cardiovascular: {
    name: 'Cardiovascular System',
    label: 'HEART & CIRCULATION',
    description: 'This anatomical view is illustrative. Only measurements listed from the selected astronaut’s database records are individualized; no physiological assessment is inferred.',
  },
  musculoskeletal: {
    name: 'Musculoskeletal System',
    label: 'SKELETAL & MUSCLE',
    description: 'The model highlights major skeletal structures for navigation. Bone-density and muscle measurements are not displayed in this view.',
  },
  neuro_ocular: {
    name: 'Neuro-Ocular System',
    label: 'BRAIN & EYES',
    description: 'The model highlights the head and ocular region for navigation. Intracranial-pressure and vision measurements are not displayed in this view.',
  },
  respiratory: {
    name: 'Respiratory System',
    label: 'LUNGS & BREATHING',
    description: 'The model highlights the lungs for navigation. Respiratory-rate measurements are not displayed in this view.',
  },
  endocrine: {
    name: 'Endocrine System',
    label: 'ENDOCRINE',
    description: 'The model highlights endocrine structures for navigation. Hormone measurements are not displayed in this view.',
  },
};

const SYSTEM_KEYS = Object.keys(BODY_SYSTEMS) as BodySystemKey[];

function displayedValue(value: number | undefined, unit: string) {
  return value === undefined || value === null ? '—' : `${value} ${unit}`;
}

export default function AstronautDigitalTwinScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSystemKey, setSelectedSystemKey] = useState<BodySystemKey>('cardiovascular');
  const { data: astronauts, loading: loadingAstronauts, error: astronautError } =
    useApi<Astronaut[]>(() => astronautService.getAll());

  const activeAstronautId = searchParams.get('astronaut') || astronauts?.[0]?.id || '';

  const currentAstronaut = useMemo(
    () => astronauts?.find((astronaut) => String(astronaut.id) === String(activeAstronautId)),
    [astronauts, activeAstronautId],
  );
  const { data: records, loading: loadingRecords, error: recordError } =
    useApi<HealthRecord[]>(
      () => activeAstronautId ? healthRecordService.getAll(activeAstronautId) : Promise.resolve([]),
      [activeAstronautId],
    );

  const latestRecord = records?.[0];
  const currentSystem = BODY_SYSTEMS[selectedSystemKey];
  const isPlaceholderAstronaut = currentAstronaut && [
    currentAstronaut.full_name,
    currentAstronaut.astronaut_code,
    currentAstronaut.mission,
  ].some((value) => value?.trim().toLowerCase() === 'string');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <UserCheck className="w-4 h-4" />
            <span>ANATOMICAL VISUALIZATION & DATABASE RECORDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Astronaut Digital Twin
          </h1>
        </div>
        <label className="flex items-center gap-2 text-xs font-mono text-slate-400">
          ASTRONAUT:
          <select
            value={activeAstronautId}
            onChange={(event) => setSearchParams({ astronaut: event.target.value })}
            disabled={!astronauts?.length}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 focus:outline-none"
          >
            {astronauts?.map((astronaut) => (
              <option key={astronaut.id} value={astronaut.id}>
                {astronaut.full_name || astronaut.name || `Astronaut #${astronaut.id}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(astronautError || recordError) && (
        <p role="alert" className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300">
          {astronautError || recordError}
        </p>
      )}
      {loadingAstronauts && <p className="text-sm text-slate-400">Loading astronaut records…</p>}
      {!loadingAstronauts && !astronautError && astronauts?.length === 0 && (
        <p className="p-5 rounded-xl border border-slate-800 text-sm text-slate-400">No astronaut records are available.</p>
      )}

      <p className="text-xs text-slate-400">
        3D anatomy is an illustrative navigation aid, not a medical model. Health values below are shown as stored; units are not inferred.
        {currentAstronaut ? ` Selected record: ${currentAstronaut.full_name || currentAstronaut.name || `Astronaut #${currentAstronaut.id}`}.` : ''}
      </p>
      {isPlaceholderAstronaut && (
        <p className="text-xs text-amber-300">The selected astronaut record contains placeholder text in one or more identity fields.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <DigitalTwin3D
            selectedSystem={selectedSystemKey}
            onSelectSystem={setSelectedSystemKey}
            heartRate={latestRecord?.heart_rate}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
            {SYSTEM_KEYS.map((key) => {
              const system = BODY_SYSTEMS[key];
              const selected = selectedSystemKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSystemKey(key)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-slate-500 uppercase">{system.label}</div>
                  <div className="text-xs mt-0.5 truncate">{system.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 sm:p-8" glow>
            <div className="pb-4 mb-5 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{currentSystem.label}</span>
              <h2 className="text-2xl font-bold text-white mt-1">{currentSystem.name}</h2>
            </div>

            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Latest health record {latestRecord?.recorded_at ? `· ${latestRecord.recorded_at}` : ''}
            </h3>
            {latestRecord && <p className="mb-3 text-[10px] text-slate-500">Source: {latestRecord.source || 'not recorded'}</p>}
            {loadingRecords && <p className="mb-3 text-xs text-slate-400">Loading health records…</p>}
            {!loadingRecords && !recordError && !latestRecord && (
              <p className="mb-3 text-xs text-slate-400">No health records are available for this astronaut.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 font-mono">
                <Heart className="w-4 h-4 text-rose-400 mb-2" />
                <span className="text-[10px] text-slate-400 block">Heart rate</span>
                <span className="text-lg font-bold text-white">{displayedValue(latestRecord?.heart_rate, 'bpm')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 font-mono">
                <Wind className="w-4 h-4 text-cyan-400 mb-2" />
                <span className="text-[10px] text-slate-400 block">SpO₂</span>
                <span className="text-lg font-bold text-white">{displayedValue(latestRecord?.spo2 ?? latestRecord?.oxygen_saturation, '%')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 font-mono">
                <Thermometer className="w-4 h-4 text-amber-400 mb-2" />
                <span className="text-[10px] text-slate-400 block">Body temperature</span>
                <span className="text-lg font-bold text-white">{displayedValue(latestRecord?.body_temperature, '(unit not recorded)')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">Visualization note</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {currentSystem.description}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

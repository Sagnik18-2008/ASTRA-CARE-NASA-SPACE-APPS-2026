import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dna, ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';

const SAMPLE_MARKERS = [
  { name: 'Cortisol (Circadian/Adrenal)', value: '18.5 µg/dL', normal: '6.0 - 23.0', status: 'Optimal', risk: 'normal', pct: 65 },
  { name: 'C-Reactive Protein (CRP)', value: '3.8 mg/L', normal: '0.0 - 3.0', status: 'Elevated', risk: 'elevated', pct: 82 },
  { name: 'Serum 25(OH)D (Vitamin D)', value: '22 ng/mL', normal: '30 - 100', status: 'Deficient', risk: 'low', pct: 28 },
  { name: 'Serum Creatinine (Renal)', value: '1.3 mg/dL', normal: '0.7 - 1.3', status: 'Upper Threshold', risk: 'elevated', pct: 75 },
  { name: 'Hemoglobin (Oxygen Transport)', value: '14.2 g/dL', normal: '12.0 - 17.0', status: 'Nominal', risk: 'normal', pct: 55 },
];

export default function BiomarkerIntelligenceSection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00d4ff05_1px,transparent_1px),linear-gradient(to_bottom,#00d4ff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="MOLECULAR TELEMETRY"
          title="Predictive Biomarker Intelligence"
          subtitle="Real-time multi-omic tracking decodes subtle sub-cellular stress before clinical symptoms arise in microgravity."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
          {/* Left: Scientific explanation & highlights */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              Sub-Clinical Detection at the Molecular Level
            </h3>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              In deep space, gross vital signs often lag cellular damage by days. ASTRA-CARE continuously monitors liquid biopsy and dry-spot biomarker profiles to identify micro-damage pathways:
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-cyan-950 border border-cyan-400/40 text-cyan-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Inflammatory Cytokine Cascade:</span>
                  <p className="text-xs text-slate-400 mt-0.5">Flags latent viral activation and microvascular inflammation.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-cyan-950 border border-cyan-400/40 text-cyan-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Bone & Calcium Dynamics:</span>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time quantification of hydroxyproline and bone alkaline phosphatase.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-cyan-950 border border-cyan-400/40 text-cyan-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Radiation Oxidative Stress:</span>
                  <p className="text-xs text-slate-400 mt-0.5">Quantifies 8-OHdG levels to evaluate DNA double-strand repair efficiency.</p>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/biomarkers"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <span>Access Complete Biomarker Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Live Interactive Biomarker Telemetry Card */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6 sm:p-8" glow>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
                    <Dna className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase font-mono">
                      Bio-Marker Telemetry Matrix
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      Commander Elena Vasquez • Artemis IV
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                  REAL-TIME
                </div>
              </div>

              {/* Biomarker Bars */}
              <div className="space-y-4">
                {SAMPLE_MARKERS.map((bm) => (
                  <div key={bm.name} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-white">{bm.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-cyan-300 font-bold">{bm.value}</span>
                        <span className="text-slate-500 text-[10px]">({bm.normal})</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bm.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          bm.risk === 'elevated'
                            ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                            : bm.risk === 'low'
                            ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                            : 'bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.5)]'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[10px] font-mono">
                      <span className="text-slate-400">Status: {bm.status}</span>
                      <span className={
                        bm.risk === 'elevated'
                          ? 'text-amber-400 font-semibold'
                          : bm.risk === 'low'
                          ? 'text-sky-300 font-semibold'
                          : 'text-emerald-400 font-semibold'
                      }>
                        {bm.risk.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

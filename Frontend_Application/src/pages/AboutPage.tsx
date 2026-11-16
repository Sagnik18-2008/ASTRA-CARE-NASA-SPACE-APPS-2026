import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Orbit, 
  Dna, 
  BrainCircuit, 
  ShieldCheck, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Globe2, 
  Users 
} from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import SpaceScene from '../components/3d/SpaceScene';

const STEPS = [
  {
    step: '01',
    title: 'Continuous Biosignal Ingestion',
    icon: Activity,
    description: 'Autonomous non-invasive sensor telemetry streams 100 Hz multi-lead electrocardiography, photoplethysmography, acoustic respiratory dynamics, and core temperature.',
  },
  {
    step: '02',
    title: 'Liquid Biopsy & Multi-Omics',
    icon: Dna,
    description: 'Onboard automated microfluidic cartridges analyze capillary blood and salivary specimens for circulating cell-free DNA, bone turnover markers, and inflammatory cytokines.',
  },
  {
    step: '03',
    title: 'ASTRA-AI Clinical Inference',
    icon: BrainCircuit,
    description: 'Edge-native neural networks synthesize physiological kinetic time-series with molecular assays, predicting clinical pathologies 14 days prior to manifest impairment.',
  },
  {
    step: '04',
    title: 'Closed-Loop Countermeasures',
    icon: ShieldCheck,
    description: 'Generates real-time personalized prescriptions: targeted resistance ergometry protocols, circadian spectrum phototherapy, and automated dispensary dosing.',
  },
];

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#020617] pt-28 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="AEROSPACE MEDICINE PIONEERING"
          title="About ASTRA-CARE"
          subtitle="Engineering the autonomous biological life-support and clinical intelligence systems required for humanity's multi-planetary expansion."
        />

        {/* Cinematic Aerospace Hero Banner with 3D Earth */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#0f1b3d]/90 via-[#0a1128]/95 to-[#020617] p-8 lg:p-14 mb-16 shadow-[0_0_50px_rgba(0,212,255,0.15)]">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 pointer-events-none">
            <SpaceScene enableControls={false} autoRotateSpeed={0.3} cameraDistance={5.5} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-xs font-mono text-cyan-300 uppercase tracking-widest inline-block mb-4">
              THE VISION
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Human Health.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">
                Beyond Earth.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              As humanity ventures beyond Low Earth Orbit toward the Moon, Mars, and deep interplanetary space, the luxury of immediate terrestrial medical evacuation vanishes. Communication latency stretches up to 24 minutes each way.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-8">
              ASTRA-CARE was developed to bridge this existential gap: providing an autonomous, flight-ready clinical AI cockpit capable of safeguarding astronaut physiology without ground reliance.
            </p>

            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-105 transition-all"
              >
                <span>Launch Clinical Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Step Technical Methodology */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              CLINICAL PIPELINE
            </span>
            <h3 className="text-3xl font-bold text-white mt-2">
              How ASTRA-CARE Operates
            </h3>
            <p className="text-sm text-slate-400 font-light mt-2">
              From raw telemetry acquisition to autonomous pharmacological mitigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <GlassCard key={step.step} className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-mono text-cyan-400/40">
                        {step.step}
                      </span>
                      <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <GlassCard className="p-8">
            <Cpu className="w-8 h-8 text-cyan-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Edge-First Autonomy</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Engineered to operate fully disconnected from terrestrial networks. The onboard ASTRA-AI model functions without Earth connectivity during orbital occultations.
            </p>
          </GlassCard>

          <GlassCard className="p-8">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Flight Surgeon Parity</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Diagnostic thresholds and clinical countermeasure protocols are calibrated against NASA Human Research Program (HRP) and ESA space medicine standards.
            </p>
          </GlassCard>

          <GlassCard className="p-8">
            <Globe2 className="w-8 h-8 text-sky-400 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Multi-Planetary Scalability</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Architected for modular deployment across lunar gateway stations, pressurized rovers, deep-space transit vehicles, and permanent Martian bases.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

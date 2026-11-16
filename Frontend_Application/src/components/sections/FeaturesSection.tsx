import { motion } from 'framer-motion';
import { 
  Activity, 
  BrainCircuit, 
  Dna, 
  BellRing, 
  ShieldCheck, 
  Satellite, 
  Microscope,
  Cpu
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';

interface Feature {
  icon: typeof Activity;
  title: string;
  badge: string;
  description: string;
  highlight: string;
}

const FEATURES: Feature[] = [
  {
    icon: Activity,
    title: 'Continuous Vital Bio-Telemetry',
    badge: '100 Hz Streaming',
    description: 'High-frequency telemetry tracking cardiovascular kinetics, beat-to-beat variability, pulse oximetry, respiratory rhythm, and central core temperature.',
    highlight: 'Real-time microgravity hemodynamic adaptation tracking',
  },
  {
    icon: Dna,
    title: 'Molecular Biomarker Intelligence',
    badge: 'Multi-Omics',
    description: 'Autonomous microfluidic analysis for inflammatory cytokines, endocrine stress markers, renal metabolites, and cellular DNA damage indicators.',
    highlight: 'Sub-clinical detection 14 days before symptom manifestation',
  },
  {
    icon: BrainCircuit,
    title: 'ASTRA-AI Diagnostic Engine',
    badge: 'Edge Neural Mesh',
    description: 'Pre-trained neural models analyzing multi-modal astronaut bio-signatures to detect cardiac anomalies, fatigue states, and bone demineralization.',
    highlight: 'Autonomous clinical triage without ground station latency',
  },
  {
    icon: BellRing,
    title: 'Autonomous Alert Triage',
    badge: 'Four-Tier Severity',
    description: 'Multi-criteria physiological threat evaluation categorizing emergent health events with automated pharmacological countermeasure protocols.',
    highlight: 'Zero false-positive algorithmic noise filtering',
  },
  {
    icon: Satellite,
    title: 'Relay & Edge Supabase Sync',
    badge: 'Mesh Architecture',
    description: 'Dual-mode architecture operating fully offline during lunar/orbital occultation, auto-synchronizing encrypted health blocks upon Earth line-of-sight.',
    highlight: 'Zero telemetry packet loss across occultation zones',
  },
  {
    icon: ShieldCheck,
    title: 'Flight Surgeon Clinical Cockpit',
    badge: 'Mission Control',
    description: 'Synchronized telemetry display allowing terrestrial flight surgeons to review crew records, simulate treatment scenarios, and update care plans.',
    highlight: 'Full longitudinal health records across multi-year flights',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="AEROSPACE ARCHITECTURE"
          title="Integrated Clinical Telemetry Architecture"
          subtitle="A unified digital medical ecosystem engineered for deep-space habitats, orbital vehicles, and surface exploration outposts."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col justify-between group hover:border-cyan-400/50">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-400/80 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-cyan-300">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{feature.highlight}</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

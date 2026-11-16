import { motion } from 'framer-motion';
import { 
  Zap, 
  Orbit, 
  Brain, 
  Eye, 
  WifiOff, 
  ShieldAlert 
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';

interface Challenge {
  id: string;
  icon: typeof Zap;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  impact: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'radiation',
    icon: Zap,
    title: 'Cosmic & Solar Radiation',
    metric: '1.2 mSv/day',
    metricLabel: 'Lunar Surface Exposure',
    description: 'Galactic cosmic rays and solar particle events penetrate spacecraft hulls, causing DNA double-strand breaks and elevated oncogenic risks.',
    impact: 'ASTRA-CARE calculates real-time ionizing dose accumulation and predicts chromosomal mutation probability.',
  },
  {
    id: 'microgravity',
    icon: Orbit,
    title: 'Musculoskeletal Atrophy',
    metric: '1.5% / month',
    metricLabel: 'Bone Mineral Density Loss',
    description: 'The absence of gravity eliminates musculoskeletal mechanical loading, triggering osteoclast activation and rapid calcium demineralization.',
    impact: 'Continuous bone density projection models trigger targeted resistance training protocols and nutritional adjustments.',
  },
  {
    id: 'sans',
    icon: Eye,
    title: 'Cephalad Fluid Shift (SANS)',
    metric: '2.0 L',
    metricLabel: 'Headward Fluid Migration',
    description: 'Microgravity redistributes bodily fluids toward the upper torso and head, altering intracranial pressure and compressing the optic disc.',
    impact: 'Non-invasive ocular vascular monitoring detects optic disc edema before visual acuity declines.',
  },
  {
    id: 'telemetry',
    icon: WifiOff,
    title: 'Communication Blackouts',
    metric: 'Up to 24 min',
    metricLabel: 'Mars Telemetry Latency',
    description: 'Deep-space distance precludes real-time tele-health from Earth flight surgeons during acute medical emergencies.',
    impact: 'Onboard autonomous edge AI diagnoses conditions and guides crew medical officers without Earth telemetry.',
  },
  {
    id: 'circadian',
    icon: Brain,
    title: 'Circadian Dysregulation',
    metric: '16 Sunsets / day',
    metricLabel: 'LEO Lighting Cycles',
    description: 'Loss of natural 24-hour diurnal solar cycles disrupts melatonin synthesis, causing sleep fragmentation and cognitive degradation.',
    impact: 'Actigraphy analysis and biomarker circadian phase-mapping optimize spectrum lighting and rest scheduling.',
  },
  {
    id: 'immune',
    icon: ShieldAlert,
    title: 'Immune System Dysregulation',
    metric: '40% Drop',
    metricLabel: 'T-Cell Proliferation',
    description: 'Space radiation and chronic confinement stress suppress cellular immunity, reactivating latent viral vectors like Epstein-Barr.',
    impact: 'Cytokine profiling and WBC monitoring flag early viral reactivation and systemic immune impairment.',
  },
];

export default function ChallengesSection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="PHYSIOLOGICAL THREAT VECTOR"
          title="The Hostile Deep Space Environment"
          subtitle="Beyond the protective cocoon of Earth's magnetosphere and atmosphere, the human body confronts unprecedented biological hazards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {CHALLENGES.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col justify-between group">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-400/30 group-hover:border-cyan-400/80 group-hover:bg-cyan-900/60 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.15)]">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-cyan-300">
                          {challenge.metric}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">
                          {challenge.metricLabel}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {challenge.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Mitigation badge */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-cyan-400/90 font-mono bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/10">
                    <span className="text-white font-semibold">ASTRA-CARE Countermeasure:</span>{' '}
                    {challenge.impact}
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

import { motion } from 'framer-motion';
import { 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Orbit, 
  Server,
  Layers,
  Code2
} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import GlassCard from '../ui/GlassCard';

const TECH_STACK = [
  {
    icon: Cpu,
    category: 'AI INFERENCE ENGINE',
    title: 'ASTRA-AI Neural Core',
    description: 'Ultra-low latency transformer model fine-tuned on spaceflight physiological datasets and microgravity bio-simulations.',
    specs: ['92% Diagnostic Confidence', '<15ms Edge Latency', 'Offline Autonomous Fallback'],
  },
  {
    icon: Database,
    category: 'STORAGE & SYNC',
    title: 'Supabase Vector & Relational Tier',
    description: 'Postgres multi-region replication paired with pgvector for astronaut clinical history embeddings and anomaly retrieval.',
    specs: ['Real-time WebSockets', 'AES-256 Flight Encryption', 'Automated Schema Sync'],
  },
  {
    icon: Server,
    category: 'API BACKEND',
    title: 'FastAPI Aerospace Server',
    description: 'Asynchronous Python microservices serving real-time telemetry streaming, biomarker calculations, and automated alerts.',
    specs: ['High-throughput Async/Await', 'OpenAPI v3 Telemetry Schema', 'Supabase Client Integration'],
  },
  {
    icon: Layers,
    category: 'VISUALIZATION ENGINE',
    title: 'WebGL / Three.js 3D Core',
    description: 'Interactive hardware-accelerated 3D orbital visualization, procedural atmospheric scattering, and physiological graphing.',
    specs: ['React Three Fiber', 'Smooth 60 FPS Shaders', 'Adaptive Low-Spec Fallback'],
  },
];

export default function TechSection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="AEROSPACE ARCHITECTURE"
          title="Engineered for Deep-Space Reliability"
          subtitle="A high-performance technical stack designed to function across ground stations, orbital stations, and edge spacecraft computers."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {TECH_STACK.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="h-full p-8 group hover:border-cyan-400/40">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/70 transition-all shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20">
                      {tech.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {tech.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">
                    {tech.description}
                  </p>

                  <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {tech.specs.map((spec) => (
                      <div key={spec} className="px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300/90 text-center">
                        {spec}
                      </div>
                    ))}
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

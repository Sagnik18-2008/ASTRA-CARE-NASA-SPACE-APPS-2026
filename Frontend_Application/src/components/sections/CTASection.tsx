import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, ShieldCheck, Orbit } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-600/15 via-blue-700/10 to-teal-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#0f1b3d]/70 via-[#0a1128]/90 to-[#020617] border border-cyan-500/30 p-8 sm:p-14 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,212,255,0.12)]"
        >
          {/* Aesthetic corner markers */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none rounded-br-lg" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-xs font-mono uppercase tracking-widest text-cyan-300 mb-6">
            <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            READY FOR DEEP-SPACE DEPLOYMENT
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            Safeguarding Astronaut Health
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300">
              Across the Cosmos.
            </span>
          </h2>

          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed mb-10">
            Access real-time biometrics, examine multi-omic biomarker trends, and review autonomous AI clinical assessments for the Artemis IV crew.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app/digital-twin"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.5)] hover:shadow-[0_0_35px_rgba(0,212,255,0.8)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              <Activity className="w-4 h-4" />
              <span>Enter Astronaut Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/app/overview"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-cyan-300 bg-space-900/60 hover:bg-cyan-500/10 border border-cyan-400/30 hover:border-cyan-400/80 rounded-xl backdrop-blur-md transition-all w-full sm:w-auto"
            >
              <span>View Artemis IV Roster</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              FLIGHT PROTOCOL APPROVED
            </span>
            <span>•</span>
            <span className="text-cyan-400">REST API READY</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

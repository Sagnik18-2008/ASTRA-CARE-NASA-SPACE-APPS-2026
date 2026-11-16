import { motion } from 'framer-motion';

export default function Fallback3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#020617] ${className}`}>
      {/* Radial glow background */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-blue-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Holographic Aerospace Sphere System */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* Outer Orbit Track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-400/25"
        />

        {/* Inclined Elliptical Orbit Track */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-20px] rounded-full border border-cyan-500/30 transform -rotate-45"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateY(15deg)' }}
        >
          {/* Orbital Satellite Node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,212,255,1)]" />
        </motion.div>

        {/* Central Planet Sphere */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#02132b] via-[#092b52] to-[#04618e] shadow-[0_0_60px_rgba(0,212,255,0.3),inset_-20px_-20px_40px_rgba(2,6,23,0.95)] border border-cyan-400/40 flex items-center justify-center overflow-hidden"
        >
          {/* Latitude Lines */}
          <div className="absolute w-full h-[1px] bg-cyan-400/20 top-1/4" />
          <div className="absolute w-full h-[1px] bg-cyan-400/30 top-1/2" />
          <div className="absolute w-full h-[1px] bg-cyan-400/20 top-3/4" />

          {/* Longitude ellipse */}
          <div className="absolute inset-x-8 inset-y-0 rounded-full border border-cyan-400/20" />

          {/* Glowing Atmospheric Rim */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,212,255,0.5)]" />
        </motion.div>

        {/* Ping Telemetry Radar Pulse */}
        <motion.div
          animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-64 h-64 rounded-full border border-cyan-400/50 pointer-events-none"
        />

        {/* Coordinate Readout Badge */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-slate-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          ORBIT: 408 KM | 27,600 KM/H
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  Orbit, 
  RotateCw,
  Compass,
  Radio,
  ChevronDown,
  Maximize2
} from 'lucide-react';

interface HeroSectionProps {
  isInteractiveMode?: boolean;
  onToggleInteractive?: () => void;
}

export default function HeroSection({
  isInteractiveMode = false,
  onToggleInteractive,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 z-10 pointer-events-none">
      {/* Platform context banner & interactive mode control */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap gap-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0a1128]/85 border border-cyan-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.2)]"
        >
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
            ASTRA-CARE • RESEARCH PLATFORM
          </span>
          <span className="text-cyan-500/60 hidden sm:inline">|</span>
          <span className="text-xs font-mono text-slate-300 hidden sm:inline">
            NASA OSD-575 • 28 MODEL FEATURES
          </span>
        </motion.div>

        {/* 3D Interactive Orbit Mode Toggle Button */}
        {onToggleInteractive && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onToggleInteractive}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-lg ${
              isInteractiveMode
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_25px_rgba(0,212,255,0.7)] scale-105'
                : 'bg-slate-900/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/60'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isInteractiveMode ? 'animate-spin' : ''}`} />
            <span>{isInteractiveMode ? 'FREE ORBIT CAM: ACTIVE (DRAG/ZOOM)' : 'CLICK TO ROTATE 3D EARTH'}</span>
            <Maximize2 className="w-3 h-3 ml-1 opacity-70" />
          </motion.button>
        )}
      </div>

      {/* Main Hero Storytelling Layout (Left-Aligned to leave Earth as Centerpiece) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        <div className="lg:col-span-7 xl:col-span-6 text-left space-y-6 pointer-events-auto">
          {/* Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400 font-semibold"
          >
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-POWERED ASTRONAUT HEALTH PLATFORM</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-none"
          >
            <span>ASTRA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-teal-300 ml-3 drop-shadow-[0_0_35px_rgba(0,212,255,0.5)]">
              CARE
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-2xl font-mono uppercase tracking-widest text-cyan-300/90 font-medium"
          >
            HUMAN HEALTH. BEYOND EARTH.
          </motion.p>

          {/* Narrative Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-xl backdrop-blur-xs"
          >
            ASTRA-CARE brings astronaut health records, biomarker research data, and an exploratory machine-learning workflow into one interface. It is a research and demonstration platform, not a clinical diagnostic system.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <Link
              to="/app/digital-twin"
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.45)] hover:shadow-[0_0_45px_rgba(0,212,255,0.75)] hover:scale-105 active:scale-95 transition-all"
            >
              <Activity className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
              <span>Launch Astronaut Console</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              to="/app/overview"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 bg-[#0a1128]/80 hover:bg-cyan-500/20 border border-cyan-400/40 hover:border-cyan-400 rounded-xl backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.25)]"
            >
              <Compass className="w-4 h-4" />
              <span>Mission Telemetry</span>
            </Link>
          </motion.div>
        </div>

        {/* Platform architecture summary */}
        <div className="lg:col-span-5 xl:col-span-6 pointer-events-auto hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="ml-auto max-w-sm rounded-2xl bg-[#0a1128]/70 border border-cyan-500/30 p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,212,255,0.12)] font-mono text-xs text-slate-300 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-cyan-400 font-bold">
              <span className="flex items-center gap-2">
                <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
                PLATFORM OVERVIEW
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                RESEARCH
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">FRONTEND:</span>
                <span className="text-white font-bold">REACT + VITE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BACKEND:</span>
                <span className="text-cyan-300 font-bold">FASTAPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DATABASE:</span>
                <span className="text-cyan-300 font-bold">SUPABASE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RESEARCH INPUT:</span>
                <span className="text-white font-bold">OSD-575</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">LIVE MODEL:</span>
                <span className="text-cyan-400 font-bold">EXPLORATORY KMEANS</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
              <span>NO LIVE TELEMETRY DISPLAYED HERE</span>
              <span className="text-cyan-400/80">3D VISUALIZATION</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-mono text-slate-400 pt-6 border-t border-cyan-500/20 pointer-events-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            RESEARCH DATA CONSOLE
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">SCROLL DOWN TO ORBIT</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-400 animate-bounce">
          <span className="hidden sm:inline">EXPLORE SYSTEM</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}

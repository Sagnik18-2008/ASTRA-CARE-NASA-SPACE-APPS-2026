import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Orbit, 
  FileCode, 
  ExternalLink,
  ChevronRight,
  Radio
} from 'lucide-react';

export default function Footer() {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-[#020617] border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden text-slate-400">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,212,255,0.25)]">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-xl font-black tracking-widest text-white">ASTRA</span>
                <span className="text-xl font-black tracking-widest text-cyan-400 ml-1">CARE</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-Powered Astronaut Health Monitoring Platform. Pioneering autonomous biomonitoring, predictive physiological modeling, and molecular medicine for long-duration deep space exploration.
            </p>

            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-cyan-500/20 text-xs font-mono text-cyan-300">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>MISSION CLOCK:</span>
              <span className="text-white font-semibold">{utcTime || '00:00:00 UTC'}</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-2">
              <Orbit className="w-3.5 h-3.5" />
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Home
                </Link>
              </li>
              <li>
                <Link to="/mission" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Mission Telemetry
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Astronaut Dashboard
                </Link>
              </li>
              <li>
                <Link to="/health-records" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Health Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Intelligence */}
          <div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Intelligence
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/biomarkers" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Biomarker Analytics
                </Link>
              </li>
              <li>
                <Link to="/ai-analysis" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> AI Diagnostic Engine
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Health Alert Triage
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-500/60" /> Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Telemetry & API */}
          <div>
            <h4 className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Interface
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="http://127.0.0.1:8000/docs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-slate-300"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  FastAPI OpenAPI
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  SUPABASE CLOUD SYNC
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AES-256 BIO-ENCRYPTED
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div>
            <span className="text-slate-400 font-semibold text-white">ASTRA-CARE</span> © 2026. HUMAN HEALTH. BEYOND EARTH.
          </div>
          <div className="flex items-center gap-6">
            <span>FLIGHT READY GRADE</span>
            <span>•</span>
            <span>REST API v2.4</span>
            <span>•</span>
            <span className="text-cyan-400/80">ORBITAL BIO-TELEMETRY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

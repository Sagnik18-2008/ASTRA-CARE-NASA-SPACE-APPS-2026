import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Menu, 
  X, 
  Compass, 
  LayoutDashboard, 
  FileText, 
  Dna, 
  BrainCircuit, 
  Bell, 
  Info,
  Radio
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: typeof Activity;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/', icon: Compass },
  { name: 'Mission', path: '/app/overview', icon: Radio },
  { name: 'Digital Twin', path: '/app/digital-twin', icon: LayoutDashboard },
  { name: 'Biomarkers', path: '/app/biomarkers', icon: Dna },
  { name: 'AI Intelligence', path: '/app/ai-intelligence', icon: BrainCircuit },
  { name: 'Medical Records', path: '/app/medical-records', icon: FileText },
  { name: 'Alerts', path: '/app/alerts', icon: Bell },
  { name: 'About', path: '/about', icon: Info },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020617]/85 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,212,255,0.05)] py-3'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-400/30 group-hover:border-cyan-400/80 transition-all duration-300 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
              <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center text-lg font-black tracking-widest leading-none">
                <span className="text-white">ASTRA</span>
                <span className="text-cyan-400 ml-1.5 glow-text">CARE</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-cyan-300/60 block mt-1">
                AEROSPACE BIO-TELEMETRY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 bg-space-900/40 p-1.5 rounded-full border border-cyan-500/10 backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,212,255,0.25)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action / Status Bar */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-cyan-400">DATA CONSOLE</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">RESEARCH</span>
            </div>

            <Link
              to="/app/overview"
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:scale-105 active:scale-95"
            >
              <span>Mission Control</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-3">
            <Link
              to="/app/overview"
              className="px-3 py-1.5 text-xs font-semibold text-black bg-cyan-400 rounded-md"
            >
              Console
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden bg-[#020617]/95 border-b border-cyan-500/20 backdrop-blur-xl px-4 py-6"
          >
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                          : 'bg-space-900/40 text-slate-300 hover:text-white hover:bg-space-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ORBITAL v2.4
              </span>
              <span className="text-cyan-400">SYNC: 100%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 tracking-wider">
              <span className="text-white">ASTRA</span>
              <span className="glow-text">CARE</span>
            </div>
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-cyan-400/80">Initializing Telemetry...</p>
          </div>
        </div>
      }>
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);

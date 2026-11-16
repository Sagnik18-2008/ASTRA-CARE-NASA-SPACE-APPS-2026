import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MissionControlLayout from './components/layout/MissionControlLayout';

// Public Landing & About Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Mission Control Application Screens
const MissionOverviewScreen = lazy(() => import('./pages/mission-control/MissionOverviewScreen'));
const AstronautDigitalTwinScreen = lazy(() => import('./pages/mission-control/AstronautDigitalTwinScreen'));
const BiomarkerIntelligenceScreen = lazy(() => import('./pages/mission-control/BiomarkerIntelligenceScreen'));
const AIIntelligenceScreen = lazy(() => import('./pages/mission-control/AIIntelligenceScreen'));
const MedicalRecordsScreen = lazy(() => import('./pages/mission-control/MedicalRecordsScreen'));
const AlertCentreScreen = lazy(() => import('./pages/mission-control/AlertCentreScreen'));
const MissionAnalyticsScreen = lazy(() => import('./pages/mission-control/MissionAnalyticsScreen'));

// Aerospace Loading Fallback
function AerospaceLoader() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-200">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-500/40 border-l-transparent animate-spin" />
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00d4ff]" />
      </div>
      <p className="mt-4 text-xs font-mono uppercase tracking-widest text-cyan-400">
        INITIALIZING ASTRA-CARE FLIGHT BUS...
      </p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<AerospaceLoader />}>
      <Routes>
        {/* Public Experience */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Astronaut Mission Control Command Deck */}
        <Route path="/app" element={<MissionControlLayout />}>
          <Route index element={<Navigate to="/app/overview" replace />} />
          <Route path="overview" element={<MissionOverviewScreen />} />
          <Route path="digital-twin" element={<AstronautDigitalTwinScreen />} />
          <Route path="biomarkers" element={<BiomarkerIntelligenceScreen />} />
          <Route path="ai-intelligence" element={<AIIntelligenceScreen />} />
          <Route path="medical-records" element={<MedicalRecordsScreen />} />
          <Route path="alerts" element={<AlertCentreScreen />} />
          <Route path="analytics" element={<MissionAnalyticsScreen />} />
        </Route>

        {/* Legacy & Backward-Compatible Redirects */}
        <Route path="/mission" element={<Navigate to="/app/overview" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/digital-twin" replace />} />
        <Route path="/health-records" element={<Navigate to="/app/medical-records" replace />} />
        <Route path="/biomarkers" element={<Navigate to="/app/biomarkers" replace />} />
        <Route path="/ai-analysis" element={<Navigate to="/app/ai-intelligence" replace />} />
        <Route path="/alerts" element={<Navigate to="/app/alerts" replace />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;

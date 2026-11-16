import { useState } from 'react';
import SpaceScene from '../components/3d/SpaceScene';
import HeroSection from '../components/sections/HeroSection';
import ChallengesSection from '../components/sections/ChallengesSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import BiomarkerIntelligenceSection from '../components/sections/BiomarkerIntelligenceSection';
import TechSection from '../components/sections/TechSection';
import CTASection from '../components/sections/CTASection';

export default function HomePage() {
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);

  const toggleInteractiveMode = () => {
    setIsInteractiveMode((prev) => !prev);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 
        PERSISTENT 3D SPACE ENVIRONMENT 
        Fixed across the full viewport background. 
        Smoothly responds to scroll position and interactive user dragging.
      */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-auto">
        <SpaceScene
          enableScrollTransitions={!isInteractiveMode}
          isInteractiveMode={isInteractiveMode}
          onToggleInteractive={toggleInteractiveMode}
        />
      </div>

      {/* Subtle Atmospheric Vignette over 3D canvas */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-[#020617]/35 via-transparent to-[#020617]/80" />

      {/* Scrollable Aerospace Content Layer */}
      <div className="relative z-10 w-full flex flex-col">
        <HeroSection
          isInteractiveMode={isInteractiveMode}
          onToggleInteractive={toggleInteractiveMode}
        />

        <div className="bg-[#020617]/75 backdrop-blur-md border-t border-cyan-500/10">
          <ChallengesSection />
        </div>

        <div className="bg-[#020617]/80 backdrop-blur-md border-t border-cyan-500/10">
          <FeaturesSection />
        </div>

        <div className="bg-[#020617]/80 backdrop-blur-md border-t border-cyan-500/10">
          <BiomarkerIntelligenceSection />
        </div>

        <div className="bg-[#020617]/85 backdrop-blur-md border-t border-cyan-500/10">
          <TechSection />
        </div>

        <div className="bg-[#020617]/90 backdrop-blur-md border-t border-cyan-500/10">
          <CTASection />
        </div>
      </div>
    </div>
  );
}

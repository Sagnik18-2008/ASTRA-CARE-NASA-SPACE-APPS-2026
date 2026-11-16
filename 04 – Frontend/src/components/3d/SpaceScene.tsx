import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import Stars from './Stars';
import Nebula from './Nebula';
import Spacecraft from './Spacecraft';
import AstronautModel from './AstronautModel';
import Fallback3D from './Fallback3D';

interface SpaceSceneProps {
  className?: string;
  enableScrollTransitions?: boolean;
  isInteractiveMode?: boolean;
  onToggleInteractive?: () => void;
  enableControls?: boolean;
  autoRotateSpeed?: number;
  cameraDistance?: number;
}

// Function to test WebGL availability
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Scroll-Driven Cinematic Camera Movement Controller
function CinematicCameraController({
  scrollProgress,
  isInteractive,
}: {
  scrollProgress: number;
  isInteractive: boolean;
}) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(1.0, 0.3, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0.4, 0, 0));

  useFrame((_, delta) => {
    // If the user is actively orbiting in interactive mode, let OrbitControls drive camera
    if (isInteractive) return;

    // Define cinematic waypoints based on scroll progress (0.0 to 1.0)
    if (scrollProgress < 0.25) {
      // 1. Hero: Center-right Earth, large and prominent
      const t = scrollProgress / 0.25;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(1.1, 0.8, t),
        THREE.MathUtils.lerp(0.2, 0.5, t),
        THREE.MathUtils.lerp(4.4, 4.6, t)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.4, 0.2, t),
        THREE.MathUtils.lerp(0.0, 0.1, t),
        0
      );
    } else if (scrollProgress < 0.55) {
      // 2. Challenges: Camera glides to the left, viewing the dark terminator limb
      const t = (scrollProgress - 0.25) / 0.3;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.8, -1.2, t),
        THREE.MathUtils.lerp(0.5, 0.8, t),
        THREE.MathUtils.lerp(4.6, 4.8, t)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.2, -0.3, t),
        THREE.MathUtils.lerp(0.1, 0.2, t),
        0
      );
    } else if (scrollProgress < 0.8) {
      // 3. Features & Biomarkers: High inclination polar orbital perspective
      const t = (scrollProgress - 0.55) / 0.25;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(-1.2, 0.0, t),
        THREE.MathUtils.lerp(0.8, 2.2, t),
        THREE.MathUtils.lerp(4.8, 4.2, t)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(-0.3, 0.0, t),
        THREE.MathUtils.lerp(0.2, 0.0, t),
        0
      );
    } else {
      // 4. Tech & CTA: Deep space horizon vista
      const t = (scrollProgress - 0.8) / 0.2;
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.0, 0.6, t),
        THREE.MathUtils.lerp(2.2, -0.4, t),
        THREE.MathUtils.lerp(4.2, 5.0, t)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.0, 0.2, t),
        THREE.MathUtils.lerp(0.0, -0.1, t),
        0
      );
    }

    // Smooth inertia camera lerp damping
    camera.position.lerp(targetCamPos.current, delta * 2.5);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

export default function SpaceScene({
  className = '',
  enableScrollTransitions = true,
  isInteractiveMode = false,
  enableControls = true,
  autoRotateSpeed = 0.35,
  cameraDistance = 4.4,
}: SpaceSceneProps) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    if (!enableScrollTransitions) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      setScrollProgress(Math.min(Math.max(scrollY / maxScroll, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollTransitions]);

  if (!hasWebGL) {
    return <Fallback3D className={className} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Suspense fallback={<Fallback3D className={className} />}>
        <Canvas
          camera={{ position: [1.1, 0.2, 4.4], fov: 46 }}
          dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className={isInteractiveMode ? 'cursor-grab active:cursor-grabbing pointer-events-auto' : 'pointer-events-auto'}
        >
          {/* Subtle Deep Space Ambient Light */}
          <ambientLight intensity={0.25} />

          {/* Key Sun Directional Light (Powerful solar illumination from top-right) */}
          <directionalLight
            position={[12, 6, 8]}
            intensity={3.4}
            color="#ffffff"
            castShadow
          />

          {/* Subtle Electric Cyan Secondary Aerospace Rim Light */}
          <directionalLight
            position={[-8, -4, 4]}
            intensity={0.8}
            color="#00d4ff"
          />

          {/* Deep Navy/Indigo Space Bounce Light */}
          <pointLight
            position={[-10, 8, -6]}
            intensity={1.2}
            color="#1e1b4b"
          />

          {/* 3D Scene Core Entities */}
          <Earth radius={2.4} rotationSpeed={0.0009} />
          <Spacecraft orbitRadius={3.7} speed={0.18} inclination={Math.PI / 4.5} />
          <AstronautModel scale={0.48} position={[-1.25, 0.45, 2.1]} rotation={[0.2, 0.55, -0.15]} />
          <Nebula />
          <Stars count={3500} />

          {/* Cinematic Camera Controller */}
          <CinematicCameraController
            scrollProgress={scrollProgress}
            isInteractive={isInteractiveMode}
          />

          {/* Orbit Controls (Full interactive 3D rotation, inspection, and zoom) */}
          <OrbitControls
            enabled={true}
            enableZoom={isInteractiveMode}
            enablePan={false}
            autoRotate={!isInteractiveMode}
            autoRotateSpeed={0.35}
            minDistance={3.0}
            maxDistance={7.5}
            dampingFactor={0.06}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={(Math.PI * 5) / 6}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

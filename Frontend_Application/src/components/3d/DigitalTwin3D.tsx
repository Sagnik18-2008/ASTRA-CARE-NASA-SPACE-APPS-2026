import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BodySystemKey } from '../../types';

interface DigitalTwin3DProps {
  selectedSystem: BodySystemKey;
  onSelectSystem: (system: BodySystemKey) => void;
  heartRate?: number;
}

function AnatomicalAvatar({
  selectedSystem,
  onSelectSystem,
  heartRate,
}: {
  selectedSystem: BodySystemKey;
  onSelectSystem: (system: BodySystemKey) => void;
  heartRate?: number;
}) {
  const heartRef = useRef<THREE.Mesh>(null);
  const lungsRef = useRef<THREE.Group>(null);
  const fluidArrowsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (heartRef.current) {
      const bpmFreq = heartRate ? (heartRate / 60) * Math.PI * 2 : 0;
      const pulse = heartRate ? 1 + Math.sin(t * bpmFreq) * 0.12 : 1;
      heartRef.current.scale.set(pulse, pulse, pulse);
    }

    if (lungsRef.current) {
      // 14 breaths per minute
      const breath = 1 + Math.sin(t * 1.5) * 0.05;
      lungsRef.current.scale.set(breath, breath, breath);
    }

    if (fluidArrowsRef.current) {
      // Upward cephalad fluid migration indicator
      fluidArrowsRef.current.position.y = ((t * 0.4) % 0.8) - 0.4;
    }
  });

  const isCardio = selectedSystem === 'cardiovascular';
  const isMusculo = selectedSystem === 'musculoskeletal';
  const isNeuro = selectedSystem === 'neuro_ocular';
  const isResp = selectedSystem === 'respiratory';
  const isEndo = selectedSystem === 'endocrine';

  return (
    <group position={[0, -0.6, 0]}>
      {/* ─── Holographic Human Outer Silhouette ─── */}
      <group>
        {/* Head */}
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial
            color="#0ea5e9"
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>

        {/* Torso Envelope */}
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.34, 0.28, 1.1, 24]} />
          <meshStandardMaterial
            color="#0284c7"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>

        {/* Pelvis & Legs Envelope */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.28, 0.24, 0.4, 16]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.12} wireframe />
        </mesh>

        <mesh position={[-0.2, 0.1, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.9, 16]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.1} wireframe />
        </mesh>
        <mesh position={[0.2, 0.1, 0]}>
          <cylinderGeometry args={[0.11, 0.08, 0.9, 16]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.1} wireframe />
        </mesh>
      </group>

      {/* ─── 1. CARDIOVASCULAR SYSTEM ─── */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem('cardiovascular');
        }}
      >
        {/* Heart Node */}
        <mesh ref={heartRef} position={[-0.04, 1.58, 0.12]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial
            color={isCardio ? '#f43f5e' : '#f43f5e'}
            emissive={isCardio ? '#e11d48' : '#be123c'}
            emissiveIntensity={isCardio ? 2.5 : 1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Aortic Arch & Major Vessels */}
        <mesh position={[-0.04, 1.72, 0.08]}>
          <torusGeometry args={[0.06, 0.015, 12, 24, Math.PI]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>

        {/* Cephalad Fluid Shift Flow Indicators (Microgravity upward arrows) */}
        <group ref={fluidArrowsRef} position={[0.16, 1.45, 0.1]}>
          <mesh>
            <coneGeometry args={[0.03, 0.08, 8]} />
            <meshBasicMaterial color={isCardio ? '#00ffff' : '#0284c7'} />
          </mesh>
        </group>

        {/* Heart Interactive Pin Label */}
        {isCardio && (
          <Html position={[-0.25, 1.6, 0.15]} center distanceFactor={6}>
            <div className="px-2 py-0.5 rounded bg-rose-950/90 border border-rose-500 text-[10px] font-mono text-rose-300 font-bold whitespace-nowrap shadow-[0_0_12px_rgba(244,63,94,0.8)]">
              {heartRate === undefined ? 'HEART · NO READING' : `HEART · ${heartRate} BPM`}
            </div>
          </Html>
        )}
      </group>

      {/* ─── 2. NEURAL & OCULAR SYSTEM (SANS) ─── */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem('neuro_ocular');
        }}
      >
        {/* Brain Cortex */}
        <mesh position={[0, 2.34, 0]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color={isNeuro ? '#38bdf8' : '#0284c7'}
            emissive={isNeuro ? '#00f0ff' : '#0369a1'}
            emissiveIntensity={isNeuro ? 2.2 : 0.6}
            wireframe
          />
        </mesh>

        {/* Optic Nerves & Ocular Globes */}
        <mesh position={[-0.08, 2.3, 0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.08, 2.3, 0.2]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {isNeuro && (
          <Html position={[0.3, 2.35, 0]} center distanceFactor={6}>
            <div className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-[0_0_12px_rgba(0,212,255,0.8)]">
              BRAIN & OCULAR REGION
            </div>
          </Html>
        )}
      </group>

      {/* ─── 3. RESPIRATORY SYSTEM ─── */}
      <group
        ref={lungsRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem('respiratory');
        }}
      >
        {/* Left Lung */}
        <mesh position={[-0.12, 1.55, 0.02]}>
          <capsuleGeometry args={[0.08, 0.22, 12, 16]} />
          <meshStandardMaterial
            color={isResp ? '#34d399' : '#059669'}
            emissive={isResp ? '#10b981' : '#047857'}
            emissiveIntensity={isResp ? 2.0 : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Right Lung */}
        <mesh position={[0.12, 1.55, 0.02]}>
          <capsuleGeometry args={[0.08, 0.22, 12, 16]} />
          <meshStandardMaterial
            color={isResp ? '#34d399' : '#059669'}
            emissive={isResp ? '#10b981' : '#047857'}
            emissiveIntensity={isResp ? 2.0 : 0.5}
            transparent
            opacity={0.8}
          />
        </mesh>

        {isResp && (
          <Html position={[0.3, 1.55, 0]} center distanceFactor={6}>
            <div className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-400 text-[10px] font-mono text-emerald-300 font-bold whitespace-nowrap shadow-[0_0_12px_rgba(52,211,153,0.8)]">
              LUNGS
            </div>
          </Html>
        )}
      </group>

      {/* ─── 4. MUSCULOSKELETAL SYSTEM ─── */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem('musculoskeletal');
        }}
      >
        {/* Vertebral Column / Spine */}
        <mesh position={[0, 1.45, -0.06]}>
          <cylinderGeometry args={[0.03, 0.04, 0.9, 12]} />
          <meshStandardMaterial
            color={isMusculo ? '#fbbf24' : '#d97706'}
            emissive={isMusculo ? '#f59e0b' : '#b45309'}
            emissiveIntensity={isMusculo ? 2.2 : 0.6}
          />
        </mesh>

        {/* Pelvic Girdle */}
        <mesh position={[0, 0.85, 0]}>
          <torusGeometry args={[0.18, 0.025, 8, 16]} />
          <meshStandardMaterial color={isMusculo ? '#fbbf24' : '#78350f'} />
        </mesh>

        {/* Femur Bones (Left & Right) */}
        <mesh position={[-0.18, 0.35, 0]} rotation={[0, 0, -0.08]}>
          <cylinderGeometry args={[0.025, 0.022, 0.55, 8]} />
          <meshStandardMaterial color={isMusculo ? '#fbbf24' : '#78350f'} />
        </mesh>
        <mesh position={[0.18, 0.35, 0]} rotation={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.025, 0.022, 0.55, 8]} />
          <meshStandardMaterial color={isMusculo ? '#fbbf24' : '#78350f'} />
        </mesh>

        {isMusculo && (
          <Html position={[-0.35, 0.85, 0]} center distanceFactor={6}>
            <div className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-400 text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-[0_0_12px_rgba(245,158,11,0.8)]">
              SKELETAL SYSTEM
            </div>
          </Html>
        )}
      </group>

      {/* ─── 5. ENDOCRINE & ADRENAL SYSTEM ─── */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem('endocrine');
        }}
      >
        {/* Adrenal Gland Nodes (Above kidneys) */}
        <mesh position={[-0.1, 1.25, -0.04]}>
          <coneGeometry args={[0.035, 0.06, 8]} />
          <meshStandardMaterial
            color={isEndo ? '#a855f7' : '#7e22ce'}
            emissive={isEndo ? '#c084fc' : '#6b21a8'}
            emissiveIntensity={isEndo ? 2.5 : 0.6}
          />
        </mesh>
        <mesh position={[0.1, 1.25, -0.04]}>
          <coneGeometry args={[0.035, 0.06, 8]} />
          <meshStandardMaterial
            color={isEndo ? '#a855f7' : '#7e22ce'}
            emissive={isEndo ? '#c084fc' : '#6b21a8'}
            emissiveIntensity={isEndo ? 2.5 : 0.6}
          />
        </mesh>

        {isEndo && (
          <Html position={[0.25, 1.25, 0]} center distanceFactor={6}>
            <div className="px-2 py-0.5 rounded bg-purple-950/90 border border-purple-400 text-[10px] font-mono text-purple-300 font-bold whitespace-nowrap shadow-[0_0_12px_rgba(168,85,247,0.8)]">
              ENDOCRINE SYSTEM
            </div>
          </Html>
        )}
      </group>

      {/* Cyber Platform Grid Base */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.85, 32]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function DigitalTwin3D({
  selectedSystem,
  onSelectSystem,
  heartRate = 72,
}: DigitalTwin3DProps) {
  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl bg-[#0a1128]/80 border border-cyan-500/20 overflow-hidden backdrop-blur-xl">
      {/* HUD System Instruction Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ASTRONAUT 3D DIGITAL TWIN
        </div>
        <p className="text-[11px] text-slate-400">
          CLICK ANY SYSTEM NODE TO INSPECT SUB-CELLULAR TELEMETRY
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 0.8, 3.2], fov: 45 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-3, -2, -2]} intensity={1.2} color="#00d4ff" />

        <Suspense fallback={null}>
          <AnatomicalAvatar
            selectedSystem={selectedSystem}
            onSelectSystem={onSelectSystem}
            heartRate={heartRate}
          />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1.8}
          maxDistance={5.0}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI * 3) / 4}
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  );
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AstronautModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function AstronautModel({
  scale = 0.55,
  position = [-1.2, 0.4, 2.2],
  rotation = [0.2, 0.6, -0.15],
}: AstronautModelProps) {
  const astronautGroupRef = useRef<THREE.Group>(null);
  const tetherCurveRef = useRef<THREE.Line>(null);
  const visorRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (astronautGroupRef.current) {
      // Zero-G floating harmonic micro-movement
      astronautGroupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.08;
      astronautGroupRef.current.position.x = position[0] + Math.cos(t * 0.5) * 0.04;
      astronautGroupRef.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.06;
      astronautGroupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.3) * 0.08;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <group ref={astronautGroupRef}>
        {/* ─── 1. Helmet & Gold Reflective Visor ─── */}
        <group position={[0, 1.25, 0]}>
          {/* Outer Helmet Shell */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>

          {/* Golden Solar Visor (Reflective Astronaut Shield) */}
          <mesh ref={visorRef} position={[0, 0.02, 0.16]} rotation={[0.1, 0, 0]}>
            <sphereGeometry args={[0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.98}
              roughness={0.04}
              emissive="#78350f"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Helmet Ring Seal */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.28, 0.3, 0.08, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Helmet Headlamps (Left & Right) */}
          <mesh position={[-0.32, 0.1, 0.1]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.32, 0.1, 0.1]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* ─── 2. Upper Torso / Hard Upper Torso (HUT) ─── */}
        <group position={[0, 0.65, 0]}>
          {/* Main Torso */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.32, 0.72, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.15} />
          </mesh>

          {/* Chest Control Module (DCM Unit) */}
          <mesh position={[0, 0.08, 0.32]}>
            <boxGeometry args={[0.28, 0.22, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Telemetry Display Screen */}
          <mesh position={[0, 0.1, 0.38]}>
            <planeGeometry args={[0.18, 0.08]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>

          {/* ASTRA-CARE Mission Badge on Chest */}
          <mesh position={[-0.18, 0.18, 0.3]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
            <meshBasicMaterial color="#00d4ff" />
          </mesh>
        </group>

        {/* ─── 3. PLSS Backpack (Portable Life Support System) ─── */}
        <group position={[0, 0.72, -0.34]}>
          {/* Main Backpack Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.85, 0.34]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
          </mesh>

          {/* Dual Oxygen Storage Cylinders */}
          <mesh position={[-0.18, 0.05, -0.1]}>
            <cylinderGeometry args={[0.09, 0.09, 0.75, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.18, 0.05, -0.1]}>
            <cylinderGeometry args={[0.09, 0.09, 0.75, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* RCS Micro-Thrusters (Left & Right Top Nozzles) */}
          <mesh position={[-0.32, 0.38, 0]}>
            <coneGeometry args={[0.04, 0.08, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.32, 0.38, 0]}>
            <coneGeometry args={[0.04, 0.08, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* ─── 4. Arms & EVA Gloves ─── */}
        {/* Left Arm (Relaxed floating reaching outward) */}
        <group position={[-0.48, 0.85, 0]} rotation={[0.4, 0, 0.6]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.52, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          {/* Forearm & Glove */}
          <group position={[0, -0.42, 0.1]} rotation={[0.5, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.09, 0.45, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <sphereGeometry args={[0.095, 16, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* Right Arm (Slightly curved toward visor) */}
        <group position={[0.48, 0.85, 0]} rotation={[-0.2, 0, -0.45]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.1, 0.52, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          <group position={[0, -0.42, 0.1]} rotation={[0.8, -0.3, 0]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.09, 0.45, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.28, 0]}>
              <sphereGeometry args={[0.095, 16, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* ─── 5. Lower Torso & Space Boots ─── */}
        <group position={[0, 0.18, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.28, 0.3, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group position={[-0.18, -0.2, 0]} rotation={[-0.2, 0, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.11, 0.62, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          <group position={[0, -0.5, 0.1]} rotation={[0.4, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.1, 0.55, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            {/* Lunar Boot */}
            <mesh position={[0, -0.34, 0.08]}>
              <boxGeometry args={[0.18, 0.14, 0.32]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.18, -0.2, 0]} rotation={[0.3, 0, -0.15]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.11, 0.62, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          <group position={[0, -0.48, -0.1]} rotation={[-0.3, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.11, 0.1, 0.55, 16]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.34, 0.08]}>
              <boxGeometry args={[0.18, 0.14, 0.32]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* ─── 6. Umbilical Life-Support Tether (Connecting to Habitat) ─── */}
        <group position={[-0.15, 0.6, -0.45]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 3.5, 16]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#0088cc"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

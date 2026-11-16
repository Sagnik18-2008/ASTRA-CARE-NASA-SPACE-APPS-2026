import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpacecraftProps {
  orbitRadius?: number;
  speed?: number;
  inclination?: number;
}

export default function Spacecraft({
  orbitRadius = 3.6,
  speed = 0.2,
  inclination = Math.PI / 5,
}: SpacecraftProps) {
  const satelliteGroupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const laserRef = useRef<THREE.Line>(null);

  // Generate 3D Orbit Elliptical Path Geometry
  const orbitPathPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * orbitRadius;
      const z = Math.sin(theta) * orbitRadius;
      const y = Math.sin(theta) * Math.sin(inclination) * 1.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [orbitRadius, inclination]);

  const orbitLineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(orbitPathPoints);
    return geo;
  }, [orbitPathPoints]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    
    // Orbital motion
    const x = Math.cos(t) * orbitRadius;
    const z = Math.sin(t) * orbitRadius;
    const y = Math.sin(t) * Math.sin(inclination) * 1.2;

    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.position.set(x, y, z);
      
      // Orient satellite: always align solar arrays and aim antenna towards Earth center [0,0,0]
      satelliteGroupRef.current.lookAt(0, 0, 0);
      satelliteGroupRef.current.rotateX(Math.PI / 2);
    }

    if (beaconRef.current) {
      // Periodic strobe flash
      const strobe = Math.sin(clock.getElapsedTime() * 8);
      beaconRef.current.intensity = strobe > 0.4 ? 3.0 : 0.2;
    }
  });

  return (
    <group>
      {/* 1. Orbit Trajectory Trace Ring */}
      <primitive object={new THREE.Line(
        orbitLineGeometry,
        new THREE.LineBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
        })
      )} />

      {/* 2. Orbiting Satellite Mesh */}
      <group ref={satelliteGroupRef}>
        {/* Main Avionics / Habitat Core (Gold Multi-Layer Insulation Foil) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.35, 0.22]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.25}
            emissive="#78350f"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Secondary Science Module (Titanium White) */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* High-Gain Parabolic Earth Communications Dish */}
        <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.08, 16, 1, true]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Antenna Feed Horn */}
        <mesh position={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>

        {/* Left Solar Panel Array Wing */}
        <group position={[-0.48, 0, 0]}>
          {/* Panel Structure */}
          <mesh>
            <boxGeometry args={[0.65, 0.22, 0.02]} />
            <meshStandardMaterial
              color="#0369a1"
              metalness={0.85}
              roughness={0.15}
              emissive="#0284c7"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* Cyan Energy Grid Lines */}
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.62, 0.2]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Right Solar Panel Array Wing */}
        <group position={[0.48, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 0.22, 0.02]} />
            <meshStandardMaterial
              color="#0369a1"
              metalness={0.85}
              roughness={0.15}
              emissive="#0284c7"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.62, 0.2]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Telemetry Status Beacon Strobe */}
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
        <pointLight
          ref={beaconRef}
          color="#00ffcc"
          distance={2.5}
          decay={2}
          intensity={2}
        />

        {/* Optical Telemetry Laser Downlink toward Earth */}
        <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 1.6, 8]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

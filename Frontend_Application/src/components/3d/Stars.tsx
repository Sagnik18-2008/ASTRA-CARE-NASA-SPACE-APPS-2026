import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarsBackgroundProps {
  count?: number;
}

export default function Stars({ count = 3500 }: StarsBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const spectralClasses = [
      new THREE.Color('#ffffff'), // O/A-Type Pure Brilliant White
      new THREE.Color('#e0f2fe'), // B-Type Ice Blue
      new THREE.Color('#38bdf8'), // Electric Cyan
      new THREE.Color('#fef08a'), // G-Type Solar Yellow
      new THREE.Color('#fed7aa'), // K-Type Light Orange
      new THREE.Color('#bae6fd'), // Light Azure
    ];

    for (let i = 0; i < count; i++) {
      // Distribute on large outer celestial sphere (radius 50 to 140)
      const radius = 55 + Math.random() * 85;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = spectralClasses[Math.floor(Math.random() * spectralClasses.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      siz[i] = 0.8 + Math.random() * 2.2;
    }

    return [pos, col, siz];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      // Gentle celestial sphere drift
      pointsRef.current.rotation.y += delta * 0.008;
      pointsRef.current.rotation.x += delta * 0.003;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Nebula() {
  const [positions, colors, scales] = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);

    // Aerospace Cosmic Nebula Palette: Deep cosmic cyan, stellar violet, midnight blue
    const palette = [
      new THREE.Color('#083358'),
      new THREE.Color('#0d2040'),
      new THREE.Color('#034f6e'),
      new THREE.Color('#1e1b4b'),
      new THREE.Color('#022c43'),
    ];

    for (let i = 0; i < count; i++) {
      // Cluster along an interstellar background plane
      const theta = Math.random() * Math.PI * 2;
      const r = 25 + Math.random() * 45;
      
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = -30 - Math.random() * 40; // Behind Earth

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sca[i] = 12.0 + Math.random() * 20.0;
    }

    return [pos, col, sca];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={24.0}
        vertexColors
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

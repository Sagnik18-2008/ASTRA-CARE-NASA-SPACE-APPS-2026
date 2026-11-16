import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import earthDayUrl from '../../assets/textures/earth_day.jpg';
import earthNormalUrl from '../../assets/textures/earth_normal.jpg';
import earthSpecularUrl from '../../assets/textures/earth_specular.jpg';
import earthCloudsUrl from '../../assets/textures/earth_clouds.png';
import earthLightsUrl from '../../assets/textures/earth_lights.png';

interface EarthProps {
  radius?: number;
  rotationSpeed?: number;
}

// Ground Station Coordinates (Lat, Long converted to 3D Sphere Vector)
const GROUND_STATIONS = [
  { name: 'Houston Mission Control', lat: 29.7, lon: -95.3, code: 'MCC-H' },
  { name: 'Kennedy Space Center', lat: 28.5, lon: -80.6, code: 'KSC-FL' },
  { name: 'ESA Operations Darmstadt', lat: 49.8, lon: 8.6, code: 'ESOC' },
  { name: 'Tsukuba Space Center', lat: 36.0, lon: 140.1, code: 'TKSC' },
  { name: 'Canberra Deep Space Station', lat: -35.4, lon: 148.9, code: 'CDSCC' },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function Earth({ radius = 2.4, rotationSpeed = 0.001 }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const stationsGroupRef = useRef<THREE.Group>(null);

  // Load NASA Textures
  const { dayMap, normalMap, specularMap, cloudsMap, lightsMap } = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const day = loader.load(earthDayUrl);
    day.colorSpace = THREE.SRGBColorSpace;
    day.anisotropy = 8;

    const normal = loader.load(earthNormalUrl);
    const specular = loader.load(earthSpecularUrl);
    
    const clouds = loader.load(earthCloudsUrl);
    clouds.colorSpace = THREE.SRGBColorSpace;

    const lights = loader.load(earthLightsUrl);
    lights.colorSpace = THREE.SRGBColorSpace;

    return {
      dayMap: day,
      normalMap: normal,
      specularMap: specular,
      cloudsMap: clouds,
      lightsMap: lights,
    };
  }, []);

  // Custom Atmospheric Glow Shader (Rayleigh scattering rim)
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          // Fresnel rim effect with sharp limb falloff
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          float intensity = pow(rim, 3.2) * 1.8;
          
          // Pure electric aerospace ice-blue cyan Rayleigh gradient
          vec3 atmosphereColor = mix(vec3(0.0, 0.75, 1.0), vec3(0.4, 0.9, 1.0), rim);
          gl_FragColor = vec4(atmosphereColor, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Realistic NASA Earth Surface Material with Night City Lights
  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: dayMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.65,
      metalness: 0.1,
      roughnessMap: specularMap, // High specular gloss on oceans, matte on continents
      emissiveMap: lightsMap,    // Realistic nocturnal city clusters
      emissive: new THREE.Color('#ffdf90'),
      emissiveIntensity: 1.6,
    });
  }, [dayMap, normalMap, specularMap, lightsMap]);

  // Telemetry pins on key ground stations
  const stationPins = useMemo(() => {
    return GROUND_STATIONS.map((station) => {
      const pos = latLonToVector3(station.lat, station.lon, radius * 1.002);
      const normal = pos.clone().normalize();
      return { ...station, pos, normal };
    });
  }, [radius]);

  // Smooth rotation
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05 * (rotationSpeed / 0.001);
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster for dynamic atmospheric motion
      cloudsRef.current.rotation.y += delta * 0.065 * (rotationSpeed / 0.001);
    }
    if (stationsGroupRef.current && earthRef.current) {
      stationsGroupRef.current.rotation.y = earthRef.current.rotation.y;
    }
  });

  return (
    <group>
      {/* 1. Main Earth Solid Body with NASA Blue Marble Textures */}
      <mesh ref={earthRef} receiveShadow castShadow>
        <sphereGeometry args={[radius, 128, 128]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* 2. Swirling Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[radius * 1.015, 96, 96]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.7}
          blending={THREE.NormalBlending}
          depthWrite={false}
          roughness={0.9}
        />
      </mesh>

      {/* 3. Outer Brilliant Atmospheric Cyan Glow Halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.15, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* 4. Active Ground Stations Telemetry Pins & Beacons */}
      <group ref={stationsGroupRef}>
        {stationPins.map((station) => (
          <group key={station.name} position={station.pos}>
            {/* Surface Anchor Dot */}
            <mesh>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshBasicMaterial color="#00ffcc" />
            </mesh>

            {/* Pulsing Concentric Radar Ring */}
            <mesh position={[0, 0, 0.01]} lookAt={() => station.normal}>
              <ringGeometry args={[0.035, 0.045, 32]} />
              <meshBasicMaterial color="#00d4ff" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>

            {/* Vertical Telemetry Laser Beam */}
            <mesh position={[station.normal.x * 0.1, station.normal.y * 0.1, station.normal.z * 0.1]}>
              <cylinderGeometry args={[0.004, 0.004, 0.2, 8]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.65} />
            </mesh>
          </group>
        ))}

        {/* Equatorial Telemetry Orbit Coordinate Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.355, 128]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

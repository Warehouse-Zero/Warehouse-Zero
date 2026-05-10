import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeStore } from '../../stores/themeStore';

interface ModelViewerProps {
  src?: string;
  color?: string;
}

function DemoModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.8}
        roughness={0.2}
        emissive="#6366f1"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function ModelViewer({ src, color = '#6366f1' }: ModelViewerProps) {
  const { mode } = useThemeStore();

  return (
    <div className={`relative w-full aspect-square rounded-xl overflow-hidden ${
      mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <color attach="background" args={[mode === 'dark' ? '#0a0a0f' : '#f8fafc']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <DemoModel />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute top-4 right-4 pointer-events-none">
        <div className={`px-3 py-2 rounded-lg text-xs backdrop-blur-sm ${
          mode === 'dark' ? 'bg-black/50 text-white/60' : 'bg-white/50 text-gray-600'
        }`}>
          拖拽旋转 · 滚轮缩放
        </div>
      </div>
    </div>
  );
}

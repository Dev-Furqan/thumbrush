"use client";

import { Float, Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Mesh } from "three";
import { cn } from "@/lib/utils";

function FloatingMark() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.24;
    mesh.current.rotation.y += 0.006;
  });

  const cards = useMemo(
    () => [
      ["THUMB", [-1.85, 1.05, 0], "#ff1744"],
      ["CTR", [1.45, 0.62, -0.6], "#ff5b78"],
      ["CLICK", [-1.5, -1.18, -0.2], "#ff1744"],
    ],
    [],
  );

  return (
    <>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
        <mesh ref={mesh} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial color="#ff1744" emissive="#4a0010" metalness={0.42} roughness={0.22} />
        </mesh>
      </Float>
      {cards.map(([label, position, color]) => (
        <Float key={label as string} speed={1.8} rotationIntensity={0.28} floatIntensity={0.55}>
          <Html position={position as [number, number, number]} transform distanceFactor={4.6}>
            <div className="rounded-lg border border-red-500/35 bg-black/80 px-4 py-3 text-xs font-black text-white shadow-[0_0_28px_rgba(255,23,68,0.18)] backdrop-blur">
              <span style={{ color: color as string }}>{label as string}</span>
            </div>
          </Html>
        </Float>
      ))}
    </>
  );
}

export function Hero3D({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-[300px] w-full opacity-90 md:h-[400px] md:opacity-100 lg:h-[520px]", className)}>
      <Canvas camera={{ position: [0, 0, 6.5], fov: 39 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 4]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color="#ff1744" />
        <Suspense fallback={null}>
          <FloatingMark />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} />
      </Canvas>
      <div className="absolute inset-0 grid place-items-center text-sm text-white/55 [@supports(display:grid)]:hidden">
        Thumbrush
      </div>
    </div>
  );
}

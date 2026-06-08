"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
  SoftShadows,
} from "@react-three/drei";
import * as THREE from "three";
import CartModel, { type ViewMode } from "@/components/three/CartModel";
import type { CartParams } from "@/lib/cart3d";

export default function CartViewer({ params, mode }: { params: CartParams; mode: ViewMode }) {
  // Pull the camera back on narrow screens so the whole cart fits in frame.
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = () => setCompact(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const camPos: [number, number, number] = compact ? [5.2, 2.5, 6.4] : [4.0, 1.9, 4.6];

  return (
    <Canvas
      key={compact ? "compact" : "wide"}
      shadows
      dpr={[1, 2]}
      camera={{ position: camPos, fov: compact ? 32 : 36 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      className="!touch-none"
    >
      <SoftShadows size={26} samples={12} focus={0.85} />

      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#dfe7da", "#4a3f2c", 0.4]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 3, -5]} intensity={0.5} color="#ffe7c4" />

      {/* In-memory studio environment (no external HDR) — gives metal + wood real reflections */}
      <Environment resolution={256}>
        <group rotation={[0, 0, 0]}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} scale={[10, 4, 1]} color="#fff3e2" />
          <Lightformer form="rect" intensity={1.1} position={[-5, 2, -1]} rotation-y={Math.PI / 3} scale={[5, 5, 1]} color="#dde6ff" />
          <Lightformer form="rect" intensity={1.4} position={[5, 3, 1]} rotation-y={-Math.PI / 3} scale={[5, 5, 1]} color="#ffe6c8" />
          <Lightformer form="ring" intensity={0.6} position={[0, 6, -5]} scale={3} color="#ffffff" />
        </group>
      </Environment>

      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.15}>
        <CartModel params={params} mode={mode} />
      </Float>

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.6}
        blur={2.8}
        scale={12}
        far={4}
        resolution={1024}
        color="#16160f"
      />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3.4}
        maxDistance={10}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.5}
        makeDefault
      />
    </Canvas>
  );
}

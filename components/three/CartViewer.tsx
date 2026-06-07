"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, ContactShadows } from "@react-three/drei";
import CartModel from "@/components/three/CartModel";
import type { CartParams } from "@/lib/cart3d";

export default function CartViewer({ params }: { params: CartParams }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [3.6, 1.7, 4.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#d6e2d2", "#5b4a32", 0.55]} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 3, -4]} intensity={0.45} color="#ffe7c4" />

      <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.6}>
        <CartModel params={params} />
      </Float>

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.5}
        blur={2.6}
        scale={11}
        far={3.5}
        resolution={512}
      />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3.4}
        maxDistance={7.5}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.04}
        autoRotate
        autoRotateSpeed={0.5}
        makeDefault
      />
    </Canvas>
  );
}

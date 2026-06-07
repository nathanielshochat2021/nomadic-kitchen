"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import type { CartParams } from "@/lib/cart3d";

// Shared palette for non-wood materials
const STEEL = "#c6cace";
const DARK = "#23231f";
const RUBBER = "#191917";

function Handle({ x, y, z, brass }: { x: number; y: number; z: number; brass: boolean }) {
  return (
    <mesh position={[x, y, z]} castShadow>
      <boxGeometry args={[0.34, 0.03, 0.03]} />
      <meshStandardMaterial
        color={brass ? "#c0a062" : STEEL}
        metalness={0.95}
        roughness={brass ? 0.3 : 0.28}
      />
    </mesh>
  );
}

function Burner({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.52, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 18]} />
        <meshStandardMaterial color="#3a3a36" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Wheel({
  x,
  y,
  radius,
  knobby,
}: {
  x: number;
  y: number;
  radius: number;
  knobby: boolean;
}) {
  return (
    <group position={[x, y, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, 0.18, 28]} />
        <meshStandardMaterial color={RUBBER} metalness={0.1} roughness={0.85} />
      </mesh>
      {/* hub */}
      <mesh>
        <cylinderGeometry args={[radius * 0.42, radius * 0.42, 0.2, 20]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} />
      </mesh>
      {knobby && (
        <mesh>
          <torusGeometry args={[radius * 0.78, 0.05, 8, 24]} />
          <meshStandardMaterial color="#0e0e0c" roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

export default function CartModel({ params: p }: { params: CartParams }) {
  const woodProps = useMemo(
    () => ({
      color: p.woodHex,
      roughness: p.finishRoughness,
      clearcoat: p.finishClearcoat,
      clearcoatRoughness: 0.5,
    }),
    [p.woodHex, p.finishRoughness, p.finishClearcoat]
  );

  // Burner layout by cooktop kind
  const burners: number[] =
    p.cooktop === "pro"
      ? [-1.4, -1.05, -0.7, -0.35]
      : p.cooktop === "grill"
      ? [-1.42, -1.05]
      : [-1.4, -0.95, -0.5];

  // Lift the whole cart for trailers
  const lift = p.mobility === "offroad" ? 0.28 : p.mobility === "road" ? 0.12 : 0;
  const wheelR = p.mobility === "offroad" ? 0.46 : 0.34;

  return (
    <group position={[0, lift, 0]}>
      {/* ── Cabinet body ───────────────────────────────────── */}
      <RoundedBox args={[3.2, 0.95, 1.0]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial {...woodProps} />
      </RoundedBox>

      {/* plank seams (subtle) */}
      {[-0.28, 0, 0.28].map((y) => (
        <mesh key={y} position={[0, y, 0.501]}>
          <boxGeometry args={[3.18, 0.006, 0.002]} />
          <meshStandardMaterial color="#00000022" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* ── Stainless countertop ───────────────────────────── */}
      <RoundedBox
        args={[3.34, 0.06, 1.06]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.505, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.32} />
      </RoundedBox>

      {/* lower prep shelf */}
      <mesh position={[0, -0.42, 0.18]} castShadow>
        <boxGeometry args={[2.9, 0.04, 0.5]} />
        <meshPhysicalMaterial {...woodProps} />
      </mesh>

      {/* ── Cooktop panel + burners ────────────────────────── */}
      <mesh position={[-0.9, 0.5, 0]} receiveShadow>
        <boxGeometry args={[1.3, 0.02, 0.82]} />
        <meshStandardMaterial color="#2c2c28" metalness={0.7} roughness={0.45} />
      </mesh>
      {burners.map((x) => (
        <Burner key={x} x={x} z={0} />
      ))}
      {p.cooktop === "grill" && (
        <mesh position={[-0.62, 0.53, 0]} castShadow>
          <boxGeometry args={[0.5, 0.04, 0.62]} />
          <meshStandardMaterial color="#34342f" metalness={0.65} roughness={0.5} />
        </mesh>
      )}

      {/* ── Sink + faucet ──────────────────────────────────── */}
      <mesh position={[0.25, 0.49, 0.0]}>
        <boxGeometry args={[0.46, 0.12, 0.46]} />
        <meshStandardMaterial color="#7f8488" metalness={0.85} roughness={0.4} />
      </mesh>
      <group position={[0.25, 0.55, -0.22]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.2, 12]} />
          <meshStandardMaterial color={p.hardwareBrass ? "#c0a062" : STEEL} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0.06]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
          <meshStandardMaterial color={p.hardwareBrass ? "#c0a062" : STEEL} metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Refrigeration: drawers / cooler ────────────────── */}
      {Array.from({ length: p.fridgeDrawers }).map((_, i) => {
        const y = 0.18 - i * 0.3;
        return (
          <group key={`fr-${i}`}>
            <mesh position={[1.05, y, 0.5]} castShadow>
              <boxGeometry args={[0.78, 0.27, 0.04]} />
              <meshStandardMaterial color="#b9bdc0" metalness={0.88} roughness={0.3} />
            </mesh>
            <Handle x={1.05} y={y + 0.09} z={0.53} brass={p.hardwareBrass} />
          </group>
        );
      })}
      {p.cooler && (
        <mesh position={[1.05, 0.56, 0]} castShadow>
          <boxGeometry args={[0.8, 0.14, 0.7]} />
          <meshStandardMaterial color="#3f4b3a" roughness={0.6} metalness={0.1} />
        </mesh>
      )}

      {/* ── Extra storage drawers (comfort) ────────────────── */}
      {p.extraDrawers &&
        [0.12, -0.18].map((y) => (
          <group key={`dr-${y}`}>
            <mesh position={[-0.25, y, 0.5]} castShadow>
              <boxGeometry args={[0.62, 0.25, 0.03]} />
              <meshPhysicalMaterial {...woodProps} />
            </mesh>
            <Handle x={-0.25} y={y + 0.08} z={0.53} brass={p.hardwareBrass} />
          </group>
        ))}

      {/* cabinet door handles on the right base */}
      <Handle x={1.05} y={-0.28} z={0.53} brass={p.hardwareBrass} />

      {/* ── Cutting board (comfort) ────────────────────────── */}
      {p.cuttingBoard && (
        <mesh position={[0.25, 0.56, 0.28]} rotation={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.46, 0.04, 0.3]} />
          <meshPhysicalMaterial color="#caa06a" roughness={0.5} clearcoat={0.3} clearcoatRoughness={0.4} />
        </mesh>
      )}

      {/* ── Speakers (comfort) ─────────────────────────────── */}
      {p.speakers &&
        [-1.25, -0.78].map((x) => (
          <group key={`sp-${x}`} position={[x, -0.12, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.05, 24]} />
              <meshStandardMaterial color="#1c1c1a" roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 18]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
          </group>
        ))}

      {/* ── Nameplate (personalization) ────────────────────── */}
      {p.nameplate && (
        <mesh position={[0.25, -0.3, 0.505]}>
          <boxGeometry args={[0.5, 0.12, 0.012]} />
          <meshStandardMaterial color={p.hardwareBrass ? "#c0a062" : "#8a8d86"} metalness={0.9} roughness={0.35} />
        </mesh>
      )}

      {/* ── Wind guard (weather) ───────────────────────────── */}
      {p.windGuard && !p.lid && (
        <group>
          <mesh position={[-0.9, 0.7, -0.4]} castShadow>
            <boxGeometry args={[1.3, 0.34, 0.02]} />
            <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} />
          </mesh>
          {[-1.55, -0.25].map((x) => (
            <mesh key={x} position={[x, 0.7, -0.1]} castShadow>
              <boxGeometry args={[0.02, 0.34, 0.62]} />
              <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} />
            </mesh>
          ))}
        </group>
      )}

      {/* ── Hard roll-top lid (weather) ────────────────────── */}
      {p.lid && (
        <RoundedBox
          args={[1.34, 0.22, 0.9]}
          radius={0.1}
          smoothness={4}
          position={[-0.9, 0.66, 0]}
          castShadow
        >
          <meshStandardMaterial color="#9a9ea1" metalness={0.85} roughness={0.3} />
        </RoundedBox>
      )}

      {/* ── Solar panel (power) ────────────────────────────── */}
      {p.solar && (
        <group position={[0.9, 0.78, -0.2]} rotation={[-0.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.03, 0.78]} />
            <meshStandardMaterial color="#16335a" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* cell grid hint */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.16, 0.005, 0.74]} />
            <meshStandardMaterial color="#1d4070" metalness={0.3} roughness={0.35} />
          </mesh>
        </group>
      )}

      {/* ── LED strip (power) ──────────────────────────────── */}
      {p.led && (
        <mesh position={[0, 0.45, 0.52]}>
          <boxGeometry args={[3.2, 0.025, 0.02]} />
          <meshStandardMaterial color="#ffd9a0" emissive="#ffbf73" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      )}

      {/* ── Water tank (water) ─────────────────────────────── */}
      {p.waterTank && (
        <mesh position={[1.78, -0.08, 0]} castShadow>
          <boxGeometry args={[0.34, 0.55, 0.62]} />
          <meshStandardMaterial color="#6d6f54" roughness={0.7} metalness={0.15} />
        </mesh>
      )}

      {/* ── Mobility: casters or trailer ───────────────────── */}
      {p.mobility === "casters" ? (
        [
          [-1.4, 0.38],
          [-1.4, -0.38],
          [1.4, 0.38],
          [1.4, -0.38],
        ].map(([x, z], i) => (
          <group key={i} position={[x, -0.62, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.12, 18]} />
              <meshStandardMaterial color={RUBBER} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.1, 0.12, 0.1]} />
              <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.4} />
            </mesh>
          </group>
        ))
      ) : (
        <group position={[0, -lift, 0]}>
          {/* chassis rails */}
          {[0.34, -0.34].map((z) => (
            <mesh key={z} position={[0, -0.66, z]} castShadow>
              <boxGeometry args={[3.5, 0.08, 0.12]} />
              <meshStandardMaterial color="#2a2c26" metalness={0.5} roughness={0.6} />
            </mesh>
          ))}
          {/* cross member */}
          <mesh position={[0, -0.66, 0]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.8]} />
            <meshStandardMaterial color="#2a2c26" metalness={0.5} roughness={0.6} />
          </mesh>
          {/* tongue + hitch out the left end */}
          <mesh position={[-2.05, -0.66, 0]} castShadow>
            <boxGeometry args={[1.1, 0.08, 0.12]} />
            <meshStandardMaterial color="#2a2c26" metalness={0.5} roughness={0.6} />
          </mesh>
          <mesh position={[-2.6, -0.66, 0]} castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} />
          </mesh>
          <Wheel x={1.55} y={-0.78} radius={wheelR} knobby={p.mobility === "offroad"} />
          <Wheel x={-1.55} y={-0.78} radius={wheelR} knobby={p.mobility === "offroad"} />
        </group>
      )}
    </group>
  );
}

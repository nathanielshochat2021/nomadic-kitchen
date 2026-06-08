"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { CartParams, CooktopKind, Grade } from "@/lib/cart3d";

export type ViewMode = "parked" | "travel";

// Shared palette for non-wood materials
const STEEL = "#c6cace";
const DARK = "#23231f";
const RUBBER = "#191917";
const FRAME = "#2a2c26";

// Ground plane (matches ContactShadows in CartViewer)
const GROUND = -1.15;

/** Engraved nameplate — text rendered to a canvas texture (no external fonts). */
function Nameplate({ text, brass }: { text: string; brass: boolean }) {
  const texture = useMemo(() => {
    const w = 512;
    const h = 120;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = brass ? "#b9974f" : "#8d9095";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 7;
      ctx.strokeRect(7, 7, w - 14, h - 14);
      const t = (text || "").slice(0, 20);
      if (t) {
        ctx.fillStyle = brass ? "#37290f" : "#222529";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let size = 58;
        do {
          ctx.font = `600 ${size}px Georgia, 'Times New Roman', serif`;
          size -= 2;
        } while (ctx.measureText(t).width > w - 48 && size > 18);
        ctx.fillText(t, w / 2, h / 2 + 3);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [text, brass]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0.25, -0.3, 0.508]}>
      <planeGeometry args={[0.62, 0.145]} />
      <meshStandardMaterial map={texture} metalness={0.5} roughness={0.45} />
    </mesh>
  );
}

function Handle({ x, y, z, brass }: { x: number; y: number; z: number; brass: boolean }) {
  return (
    <mesh position={[x, y, z]} castShadow>
      <boxGeometry args={[0.34, 0.03, 0.03]} />
      <meshStandardMaterial color={brass ? "#c0a062" : STEEL} metalness={0.95} roughness={brass ? 0.3 : 0.28} envMapIntensity={1.1} />
    </mesh>
  );
}

function Burner({ x, z, center }: { x: number; z: number; center: string }) {
  return (
    <group position={[x, 0.52, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 18]} />
        <meshStandardMaterial color={center} metalness={0.8} roughness={0.34} envMapIntensity={1.2} />
      </mesh>
    </group>
  );
}

/** Cooktop surface — style changes with grade: hibachi (std) / gas (prem) / Viking-class (pro). */
function Cooktop({ type, grade, brass }: { type: CooktopKind; grade: Grade; brass: boolean }) {
  const cx = -0.9;
  const zoneXs =
    type === "pro" ? [-1.46, -1.12, -0.78, -0.44] : type === "grill" ? [-1.42, -1.06] : [-1.42, -0.9, -0.38];
  const knobColor = brass ? "#c0a062" : "#2b2b2b";

  return (
    <group>
      {/* base tray */}
      <mesh position={[cx, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.34, 0.05, 0.84]} />
        <meshStandardMaterial
          color={grade === "std" ? "#2b2b28" : STEEL}
          metalness={grade === "std" ? 0.4 : 0.85}
          roughness={grade === "std" ? 0.6 : 0.3}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* Standard = hibachi grill top: dark firebox + parallel grate bars */}
      {grade === "std" && (
        <group>
          <mesh position={[cx, 0.5, 0]}>
            <boxGeometry args={[1.22, 0.06, 0.72]} />
            <meshStandardMaterial color="#15140f" roughness={0.85} metalness={0.2} />
          </mesh>
          {[-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3].map((z) => (
            <mesh key={z} position={[cx, 0.55, z]} castShadow>
              <boxGeometry args={[1.18, 0.025, 0.025]} />
              <meshStandardMaterial color="#1d1d1a" metalness={0.4} roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* Premium = open stainless gas burners */}
      {grade === "prem" && zoneXs.map((x) => <Burner key={x} x={x} z={0} center="#9aa0a4" />)}

      {/* Pro / Viking-class = continuous heavy cast-iron grate grid + polished stainless trim */}
      {grade === "pro" && (
        <group>
          <mesh position={[cx, 0.53, 0]}>
            <boxGeometry args={[1.4, 0.02, 0.9]} />
            <meshStandardMaterial color="#d6d9dc" metalness={0.95} roughness={0.18} envMapIntensity={1.3} />
          </mesh>
          {[-0.3, -0.12, 0.06, 0.24].map((z) => (
            <mesh key={`gx${z}`} position={[cx, 0.56, z]} castShadow>
              <boxGeometry args={[1.26, 0.035, 0.035]} />
              <meshStandardMaterial color="#17181a" metalness={0.5} roughness={0.55} />
            </mesh>
          ))}
          {[-1.45, -1.15, -0.85, -0.55, -0.35].map((x) => (
            <mesh key={`gz${x}`} position={[x, 0.56, -0.03]} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.74]} />
              <meshStandardMaterial color="#17181a" metalness={0.5} roughness={0.55} />
            </mesh>
          ))}
        </group>
      )}

      {/* Griddle (grill format) */}
      {type === "grill" && (
        <mesh position={[-0.55, 0.54, 0]} castShadow>
          <boxGeometry args={[0.5, 0.035, 0.66]} />
          <meshStandardMaterial color="#3a3a34" metalness={0.55} roughness={0.5} />
        </mesh>
      )}

      {/* Control knobs on the front face (premium + pro) */}
      {grade !== "std" &&
        zoneXs.map((x) => (
          <group key={`k${x}`} position={[x, 0.45, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.04, 0.05, 16]} />
              <meshStandardMaterial color={knobColor} metalness={0.85} roughness={0.35} envMapIntensity={1.1} />
            </mesh>
          </group>
        ))}
    </group>
  );
}

/** Road wheel — axle runs along Z, so the wheel sits on a LONG side and rolls along X. */
function Wheel({ z, y, radius, knobby }: { z: number; y: number; radius: number; knobby: boolean }) {
  return (
    <group position={[0, y, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, 0.2, 30]} />
        <meshStandardMaterial color={RUBBER} metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius * 0.4, radius * 0.4, 0.22, 20]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} envMapIntensity={1.1} />
      </mesh>
      {knobby && (
        <mesh>
          <torusGeometry args={[radius * 0.8, 0.055, 8, 26]} />
          <meshStandardMaterial color="#0e0e0c" roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

/** Hydraulic leg at a corner — extends to the ground when parked, tucks up when travelling. */
function Leg({ x, z, topLocal, extended, brass }: { x: number; z: number; topLocal: number; extended: boolean; brass: boolean }) {
  const footWorld = GROUND + 0.02;
  const bottomLocal = extended ? footWorld : topLocal - 0.16;
  const len = topLocal - bottomLocal;
  const cy = (topLocal + bottomLocal) / 2;
  return (
    <group position={[x, 0, z]}>
      {/* hydraulic cylinder */}
      <mesh position={[0, cy, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, len, 14]} />
        <meshStandardMaterial color={brass ? "#9c7f44" : "#9a9ea1"} metalness={0.9} roughness={0.3} envMapIntensity={1.1} />
      </mesh>
      {/* foot pad */}
      {extended && (
        <mesh position={[0, bottomLocal + 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.03, 16]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}

export default function CartModel({ params: p, mode }: { params: CartParams; mode: ViewMode }) {
  const woodProps = useMemo(
    () => ({
      color: p.woodHex,
      roughness: p.finishRoughness,
      clearcoat: p.finishClearcoat,
      clearcoatRoughness: 0.5,
      envMapIntensity: 0.5,
    }),
    [p.woodHex, p.finishRoughness, p.finishClearcoat]
  );

  // Re-create the wood material whenever the finish changes. Toggling clearcoat
  // between 0 (matte) and >0 (oil/stain) needs a fresh material, otherwise
  // three.js keeps the old shader and the cabinet renders broken/invisible.
  const woodKey = `${p.woodHex}-${p.finishClearcoat}-${p.finishRoughness}`;

  const wheelR = 0.34;
  const baseY = mode === "parked" ? 0.18 : 0;
  const wheelZ = 0.64;
  const wheelY = -0.78;

  return (
    <group position={[0, baseY, 0]}>
      {/* ── Cabinet body ───────────────────────────────────── */}
      <RoundedBox args={[3.2, 0.95, 1.0]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial key={woodKey} {...woodProps} />
      </RoundedBox>

      {[-0.28, 0, 0.28].map((y) => (
        <mesh key={y} position={[0, y, 0.501]}>
          <boxGeometry args={[3.18, 0.006, 0.002]} />
          <meshStandardMaterial color="#00000022" transparent opacity={0.25} />
        </mesh>
      ))}

      {/* ── Stainless countertop ───────────────────────────── */}
      <RoundedBox args={[3.34, 0.06, 1.06]} radius={0.02} smoothness={4} position={[0, 0.505, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.3} envMapIntensity={1.1} />
      </RoundedBox>

      <mesh position={[0, -0.42, 0.18]} castShadow>
        <boxGeometry args={[2.9, 0.04, 0.5]} />
        <meshPhysicalMaterial key={woodKey} {...woodProps} />
      </mesh>

      {/* ── Cooktop (style varies by grade) ────────────────── */}
      <Cooktop type={p.cooktop} grade={p.cooktopGrade} brass={p.hardwareBrass} />

      {/* ── Sink + faucet ──────────────────────────────────── */}
      <mesh position={[0.25, 0.49, 0.0]}>
        <boxGeometry args={[0.46, 0.12, 0.46]} />
        <meshStandardMaterial color="#7f8488" metalness={0.85} roughness={0.4} envMapIntensity={1.1} />
      </mesh>
      <group position={[0.25, 0.55, -0.22]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.2, 12]} />
          <meshStandardMaterial color={p.hardwareBrass ? "#c0a062" : STEEL} metalness={0.9} roughness={0.3} envMapIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.1, 0.06]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
          <meshStandardMaterial color={p.hardwareBrass ? "#c0a062" : STEEL} metalness={0.9} roughness={0.3} envMapIntensity={1.2} />
        </mesh>
      </group>

      {/* ── Refrigeration: drawers / cooler ────────────────── */}
      {Array.from({ length: p.fridgeDrawers }).map((_, i) => {
        const y = 0.18 - i * 0.3;
        return (
          <group key={`fr-${i}`}>
            <mesh position={[1.05, y, 0.5]} castShadow>
              <boxGeometry args={[0.78, 0.27, 0.04]} />
              <meshStandardMaterial color="#b9bdc0" metalness={0.88} roughness={0.3} envMapIntensity={1.1} />
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
              <meshPhysicalMaterial key={woodKey} {...woodProps} />
            </mesh>
            <Handle x={-0.25} y={y + 0.08} z={0.53} brass={p.hardwareBrass} />
          </group>
        ))}

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

      {/* ── Engraved nameplate (personalization) ───────────── */}
      {p.nameplate && <Nameplate text={p.engraveText} brass={p.hardwareBrass} />}

      {/* ── Wind guard (weather) ───────────────────────────── */}
      {p.windGuard && !p.lid && (
        <group>
          <mesh position={[-0.9, 0.7, -0.4]} castShadow>
            <boxGeometry args={[1.3, 0.34, 0.02]} />
            <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} envMapIntensity={1.1} />
          </mesh>
          {[-1.55, -0.25].map((x) => (
            <mesh key={x} position={[x, 0.7, -0.1]} castShadow>
              <boxGeometry args={[0.02, 0.34, 0.62]} />
              <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} envMapIntensity={1.1} />
            </mesh>
          ))}
        </group>
      )}

      {/* ── Hard roll-top lid (weather) ────────────────────── */}
      {p.lid && (
        <RoundedBox args={[1.34, 0.22, 0.9]} radius={0.1} smoothness={4} position={[-0.9, 0.66, 0]} castShadow>
          <meshStandardMaterial color="#9a9ea1" metalness={0.85} roughness={0.3} envMapIntensity={1.1} />
        </RoundedBox>
      )}

      {/* ── Solar panel (power) ────────────────────────────── */}
      {p.solar && (
        <group position={[0.9, 0.78, -0.2]} rotation={[-0.35, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.03, 0.78]} />
            <meshStandardMaterial color="#16335a" metalness={0.5} roughness={0.2} envMapIntensity={1.1} />
          </mesh>
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

      {/* ── Universal chassis: single axle, long-side wheels, hydraulic legs ── */}
      {/* under-frame */}
      {[0.42, -0.42].map((z) => (
        <mesh key={z} position={[0, -0.55, z]} castShadow>
          <boxGeometry args={[3.1, 0.08, 0.1]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* axle across the short dimension (along Z) */}
      <mesh position={[0, wheelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2 * wheelZ, 14]} />
        <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.5} />
      </mesh>
      <Wheel z={wheelZ} y={wheelY} radius={wheelR} knobby={false} />
      <Wheel z={-wheelZ} y={wheelY} radius={wheelR} knobby={false} />

      {/* Three hydraulic legs: two at the rear corners, one centered on the hitch end */}
      <Leg x={1.5} z={0.42} topLocal={-0.5} extended={mode === "parked"} brass={p.hardwareBrass} />
      <Leg x={1.5} z={-0.42} topLocal={-0.5} extended={mode === "parked"} brass={p.hardwareBrass} />
      <Leg x={-1.5} z={0} topLocal={-0.5} extended={mode === "parked"} brass={p.hardwareBrass} />

      {/* Trailer coupler on the single-leg end — always visible (attaches to a vehicle) */}
      <group>
        {/* central tongue / drawbar */}
        <mesh position={[-1.98, wheelY, 0]} castShadow>
          <boxGeometry args={[0.8, 0.09, 0.1]} />
          <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.6} />
        </mesh>
        {/* A-frame side gussets */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[-1.82, wheelY, s * 0.18]} rotation={[0, s * 0.85, 0]} castShadow>
            <boxGeometry args={[0.42, 0.07, 0.06]} />
            <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
        {/* cast coupler head */}
        <mesh position={[-2.4, wheelY, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.15]} />
          <meshStandardMaterial color="#3b3e41" metalness={0.72} roughness={0.4} envMapIntensity={1.1} />
        </mesh>
        {/* sloped nose */}
        <mesh position={[-2.52, wheelY + 0.05, 0]} rotation={[0, 0, 0.62]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.15]} />
          <meshStandardMaterial color="#3b3e41" metalness={0.72} roughness={0.4} />
        </mesh>
        {/* latch handle */}
        <mesh position={[-2.33, wheelY + 0.12, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.17, 0.03, 0.045]} />
          <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.35} envMapIntensity={1.1} />
        </mesh>
        {/* socket cup (clamps over the ball) */}
        <mesh position={[-2.45, wheelY - 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.062, 0.09, 16]} />
          <meshStandardMaterial color="#2a2c2e" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* chrome tow ball (vehicle side) */}
        <mesh position={[-2.45, wheelY - 0.15, 0]} castShadow>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#d8dade" metalness={0.95} roughness={0.12} envMapIntensity={1.4} />
        </mesh>
        {/* ball mount post */}
        <mesh position={[-2.45, wheelY - 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
          <meshStandardMaterial color="#1c1c1a" metalness={0.5} roughness={0.6} />
        </mesh>
        {/* safety-chain hooks */}
        {[0.075, -0.075].map((z) => (
          <mesh key={z} position={[-2.26, wheelY - 0.05, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.028, 0.009, 8, 12]} />
            <meshStandardMaterial color="#2a2c2e" metalness={0.6} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

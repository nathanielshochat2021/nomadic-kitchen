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

/** A single gas burner: cast-iron pan-support ring with cross-grate and a center cap. */
function GasBurner({ x, z, capColor = "#1d1d1a" }: { x: number; z: number; capColor?: string }) {
  return (
    <group position={[x, 0.525, z]}>
      {/* recessed well */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.015, 28]} />
        <meshStandardMaterial color="#202022" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* cast pan-support ring */}
      <mesh castShadow>
        <torusGeometry args={[0.125, 0.018, 10, 28]} />
        <meshStandardMaterial color="#161618" metalness={0.45} roughness={0.6} />
      </mesh>
      {/* cross supports */}
      {[0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].map((r) => (
        <mesh key={r} rotation={[0, r, 0]} position={[0, 0.005, 0]}>
          <boxGeometry args={[0.25, 0.016, 0.022]} />
          <meshStandardMaterial color="#161618" metalness={0.45} roughness={0.6} />
        </mesh>
      ))}
      {/* burner cap */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.03, 20]} />
        <meshStandardMaterial color={capColor} metalness={0.7} roughness={0.4} envMapIntensity={1.1} />
      </mesh>
    </group>
  );
}

// Burner layouts: a row for premium, a tight square cluster for pro.
function rowLayout(n: number, cx: number): [number, number][] {
  const gap = 0.32;
  return Array.from({ length: n }, (_, i) => [cx + (i - (n - 1) / 2) * gap, 0]);
}
function squareLayout(n: number, cx: number): [number, number][] {
  const rows = Math.ceil(n / 2);
  return Array.from({ length: n }, (_, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    return [cx + (col - 0.5) * 0.46, (row - (rows - 1) / 2) * 0.38];
  });
}

/** Cooktop surface — flat-top (std) / gas burners in a row (prem) / pro rangetop, burners in a square (pro). */
function Cooktop({ type, grade, brass }: { type: CooktopKind; grade: Grade; brass: boolean }) {
  const cx = -0.9;
  const count = type === "pro" ? 4 : type === "grill" ? 2 : 3;
  const knobColor = brass ? "#c0a062" : "#2b2b2b";
  const knobXs = Array.from({ length: count }, (_, i) => cx + (i - (count - 1) / 2) * 0.26);

  return (
    <group>
      {/* stainless surround / tray */}
      <mesh position={[cx, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.34, 0.05, 0.84]} />
        <meshStandardMaterial color={STEEL} metalness={0.88} roughness={0.28} envMapIntensity={1.2} />
      </mesh>

      {/* STD — flat griddle / plancha top */}
      {grade === "std" && (
        <group>
          <mesh position={[cx, 0.535, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.22, 0.03, 0.72]} />
            <meshStandardMaterial color="#73777b" metalness={0.72} roughness={0.42} envMapIntensity={1.1} />
          </mesh>
          {/* grease channel groove along the front */}
          <mesh position={[cx, 0.552, 0.31]}>
            <boxGeometry args={[1.18, 0.012, 0.04]} />
            <meshStandardMaterial color="#34373a" metalness={0.5} roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* PREM — open gas burners in a row */}
      {grade === "prem" &&
        rowLayout(count, cx).map(([x, z], i) => <GasBurner key={i} x={x} z={z} capColor="#3a3d40" />)}

      {/* PRO — polished rangetop, sealed burners in a square + continuous grate frame */}
      {grade === "pro" && (
        <group>
          <mesh position={[cx, 0.522, 0]}>
            <boxGeometry args={[1.24, 0.018, 0.78]} />
            <meshStandardMaterial color="#d7dadd" metalness={0.96} roughness={0.16} envMapIntensity={1.4} />
          </mesh>
          {/* perimeter continuous grate rails */}
          {[0.3, -0.3].map((z) => (
            <mesh key={`gx${z}`} position={[cx, 0.555, z]} castShadow>
              <boxGeometry args={[1.2, 0.03, 0.03]} />
              <meshStandardMaterial color="#17181a" metalness={0.4} roughness={0.6} />
            </mesh>
          ))}
          {squareLayout(count, cx).map(([x, z], i) => (
            <GasBurner key={i} x={x} z={z} capColor="#1d1d1a" />
          ))}
        </group>
      )}

      {/* Griddle station (burner + griddle format) */}
      {type === "grill" && (
        <mesh position={[-0.5, 0.535, 0]} castShadow>
          <boxGeometry args={[0.48, 0.03, 0.66]} />
          <meshStandardMaterial color="#55585c" metalness={0.7} roughness={0.4} envMapIntensity={1.1} />
        </mesh>
      )}

      {/* Control knobs on the front fascia (gas + pro) */}
      {grade !== "std" &&
        knobXs.map((x, i) => (
          <group key={i} position={[x, 0.45, 0.521]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.032, 0.038, 0.05, 18]} />
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

/** Hydraulic leg — drawn only when parked. Extends from the frame down to the ground. */
function Leg({ x, z, topLocal, bottomLocal, brass }: { x: number; z: number; topLocal: number; bottomLocal: number; brass: boolean }) {
  const len = topLocal - bottomLocal;
  const cy = (topLocal + bottomLocal) / 2;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, cy, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, len, 14]} />
        <meshStandardMaterial color={brass ? "#9c7f44" : "#9a9ea1"} metalness={0.9} roughness={0.3} envMapIntensity={1.1} />
      </mesh>
      {/* foot pad */}
      <mesh position={[0, bottomLocal + 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.03, 16]} />
        <meshStandardMaterial color={FRAME} metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function CartModel({ params: p, mode }: { params: CartParams; mode: ViewMode }) {
  const woodProps = useMemo(
    () => ({
      color: p.woodHex,
      roughness: p.finishRoughness,
      metalness: 0,
      envMapIntensity: 0.6,
    }),
    [p.woodHex, p.finishRoughness]
  );

  // Finish is conveyed by color + roughness on a standard material (no clearcoat) —
  // toggling clearcoat 0 -> >0 is what made the cabinet vanish.
  const woodKey = `${p.woodHex}-${p.finishRoughness}`;

  const wheelR = 0.34;
  const baseY = mode === "parked" ? 0.14 : 0;
  const wheelZ = 0.64;
  const wheelY = -0.78;
  // Local y the legs reach so their feet land on the world ground plane.
  const legBottomLocal = GROUND - baseY;

  return (
    <group position={[0, baseY, 0]}>
      {/* ── Cabinet body ───────────────────────────────────── */}
      <RoundedBox args={[3.2, 0.95, 1.0]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial key={woodKey} {...woodProps} />
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
        <meshStandardMaterial key={woodKey} {...woodProps} />
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
              <meshStandardMaterial key={woodKey} {...woodProps} />
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
      {/* Travel: single axle + removable wheels (no legs) */}
      {mode === "travel" && (
        <group>
          <mesh position={[0, wheelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 2 * wheelZ, 14]} />
            <meshStandardMaterial color={FRAME} metalness={0.6} roughness={0.5} />
          </mesh>
          <Wheel z={wheelZ} y={wheelY} radius={wheelR} knobby={false} />
          <Wheel z={-wheelZ} y={wheelY} radius={wheelR} knobby={false} />
        </group>
      )}

      {/* Parked: three hydraulic legs (two at the rear, one centered on the hitch end), wheels off */}
      {mode === "parked" && (
        <group>
          <Leg x={1.5} z={0.42} topLocal={-0.5} bottomLocal={legBottomLocal} brass={p.hardwareBrass} />
          <Leg x={1.5} z={-0.42} topLocal={-0.5} bottomLocal={legBottomLocal} brass={p.hardwareBrass} />
          <Leg x={-1.5} z={0} topLocal={-0.5} bottomLocal={legBottomLocal} brass={p.hardwareBrass} />
        </group>
      )}

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
        {/* chrome tow ball + mount (vehicle side — only while hitched for travel) */}
        {mode === "travel" && (
          <group>
            <mesh position={[-2.45, wheelY - 0.15, 0]} castShadow>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#d8dade" metalness={0.95} roughness={0.12} envMapIntensity={1.4} />
            </mesh>
            <mesh position={[-2.45, wheelY - 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
              <meshStandardMaterial color="#1c1c1a" metalness={0.5} roughness={0.6} />
            </mesh>
          </group>
        )}
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

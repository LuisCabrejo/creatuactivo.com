import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Html } from "@react-three/drei";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; title: string; sub: string; freezeAt: number; titleAt?: number };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const ALERT = "#F43F5E";

function Glow({ position, scale, color, opacity = 1 }: { position: THREE.Vector3; scale: number; color: string; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`); grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

function Gear({ R, tube, teeth, angle, color, emissive, ei }: { R: number; tube: number; teeth: number; angle: number; color: string; emissive: string; ei: number }) {
  return (
    <group rotation={[0, 0, angle]}>
      <mesh>
        <torusGeometry args={[R, tube, 14, 64]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei} metalness={0.7} roughness={0.35} />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (R + tube * 0.6), Math.sin(a) * (R + tube * 0.6), 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[tube * 1.5, tube * 1.5, tube * 1.6]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei} metalness={0.7} roughness={0.35} />
          </mesh>
        );
      })}
      {/* radios internos */}
      {[0, 1, 2].map((i) => (
        <mesh key={`s${i}`} rotation={[0, 0, (i / 3) * Math.PI]}>
          <boxGeometry args={[R * 1.6, tube * 0.8, tube * 0.8]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei * 0.7} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ frame, fps, freezeAt }: { frame: number; fps: number; freezeAt: number }) {
  const inOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // velocidad angular: gira, desacelera tras el freeze hasta detenerse
  const decel = Math.max(0, 1 - (frame - freezeAt) / (0.7 * fps)); // 1→0 en 0.7s tras freeze
  const speed = frame < freezeAt ? 0.09 : 0.09 * Math.max(0, decel);
  // integramos el ángulo de forma estable (acumulado discreto aproximado)
  const angMain = useMemo(() => {
    let a = 0;
    for (let f = 0; f <= frame; f++) {
      const d = f < freezeAt ? 0.09 : 0.09 * Math.max(0, 1 - (f - freezeAt) / (0.7 * fps));
      a += d;
    }
    return a;
  }, [frame, freezeAt, fps]);

  const frozen = frame >= freezeAt;
  // mezcla de color oro→rojo al congelar
  const mix = frozen ? interpolate(frame, [freezeAt, freezeAt + 8], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const gearCol = new THREE.Color(GOLD).lerp(new THREE.Color(ALERT), mix * 0.85).getStyle();
  const gearEm = new THREE.Color("#3a2f15").lerp(new THREE.Color("#3a0f18"), mix).getStyle();
  const orbCol = new THREE.Color(GOLD_HOT).lerp(new THREE.Color(ALERT), mix).getStyle();
  const orbEi = frozen ? interpolate(frame, [freezeAt, freezeAt + 8], [1.5, 0.5], { extrapolateRight: "clamp" }) : 1.5;
  const breath = 0.42 + (frozen ? 0 : 0.025 * Math.sin(frame / 5));

  const flash = frozen ? interpolate(frame, [freezeAt, freezeAt + 7], [1, 0], { extrapolateRight: "clamp" }) : 0;

  const Rbig = 1.05, tubeBig = 0.13;
  const Rsm = 0.6, tubeSm = 0.1;
  // engranaje pequeño engrana arriba-derecha, gira en sentido contrario
  const smX = Rbig + Rsm + tubeBig * 0.4;
  const smPos: [number, number, number] = [smX * 0.62, smX * 0.62, -0.05];

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.3} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 1.4]} intensity={7} distance={6} color={frozen ? ALERT : GOLD_HOT} />

      {/* engranaje pequeño (detrás) */}
      <group position={smPos}>
        <Gear R={Rsm} tube={tubeSm} teeth={12} angle={-angMain * (Rbig / Rsm)} color={gearCol} emissive={gearEm} ei={0.6} />
      </group>

      {/* engranaje grande (motor principal) */}
      <Gear R={Rbig} tube={tubeBig} teeth={20} angle={angMain} color={gearCol} emissive={gearEm} ei={0.7} />

      {/* destello rojo al congelar */}
      {flash > 0 && <Glow position={new THREE.Vector3(0, 0, 0.3)} scale={3.4 * flash} color={ALERT} opacity={flash} />}

      {/* NÚCLEO: orbe dorado = el motor (usted). Al parar, se apaga y enrojece */}
      <Glow position={new THREE.Vector3(0, 0, 0.2)} scale={2.0} color={frozen ? ALERT : GOLD_HOT} opacity={0.5 + 0.5 * (1 - mix)} />
      <mesh position={[0, 0, 0.2]} renderOrder={10}>
        <sphereGeometry args={[breath, 40, 40]} />
        <meshStandardMaterial color={orbCol} emissive={orbCol} emissiveIntensity={orbEi} metalness={0.25} roughness={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

export const MotorCongela3D: React.FC<Props> = ({ eyebrow, title, sub, freezeAt, titleAt }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const titleWords = title.split("\n");
  const tAt = titleAt ?? (freezeAt + 2);   // modo girar-sin-congelar: título temprano
  const ebOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [tAt + 12, tAt + 26], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [tAt + 16, tAt + 34], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 55% 42% at 50% 38%, rgba(197,160,89,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-11%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 5.4], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} freezeAt={freezeAt} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.14 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
        {titleWords.map((w, i) => {
          const start = tAt + i * 8;
          const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const ty = interpolate(frame, [start, start + 12], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{w}</div>;
        })}
        <div style={{ width: lineW, height: 3, backgroundColor: ALERT, margin: "24px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.smoke, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

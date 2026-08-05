import React, { useState, useEffect } from "react";
import { GLTFLoader } from "three-stdlib";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
} from "remotion";
import { BRAND } from "./brand";

// PRUEBA v3: render de VIDEO (no still) + delayRender + cubo de referencia + captura de error.
export const GltfTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const [scene, setScene] = useState<any>(null);
  const [err, setErr] = useState<string>("");
  const [handle] = useState(() => delayRender("gltf"));

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      staticFile("test.glb"),
      (g) => {
        setScene(g.scene);
        continueRender(handle);
      },
      undefined,
      (e) => {
        setErr("LOAD ERROR: " + String((e as any)?.message || e));
        continueRender(handle);
      }
    );
  }, [handle]);

  const rot = interpolate(frame, [0, 120], [0, Math.PI * 2]);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: 38, position: [0, 1.2, 4.6] }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} color={"#e7ecf3"} />
        {/* cubo de referencia dorado (siempre visible) */}
        <mesh position={[-1.7, 0, 0]} rotation={[0, rot, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={"#C5A059"} metalness={0.3} roughness={0.5} />
        </mesh>
        {scene && <primitive object={scene} rotation={[0, rot, 0]} position={[0, -1.1, 0]} scale={1.3} />}
      </ThreeCanvas>
      <AbsoluteFill style={{ color: "#9fe", fontSize: 26, fontFamily: "monospace", padding: 24, pointerEvents: "none" }}>
        {scene ? "MODEL: loaded ✓" : "MODEL: null"}
        {err ? "  " + err.slice(0, 220) : ""}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

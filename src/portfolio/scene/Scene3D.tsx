import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import type { Mode } from "../data/types";
import { setHover, usePortfolioStore } from "../hooks/usePortfolioState";
import { Characters } from "./Characters";
import { Connections, HoverLabel, Workbench } from "./Effects";
import { Furniture, Laptop, Table } from "./Furniture";
import { SceneContext, damp } from "./shared";
import type { SceneLive } from "./shared";

export interface Scene3DProps {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
  reduced: boolean;
  quality: "high" | "low";
  /** False while scrolled out of view: rendering stops. */
  active: boolean;
  onReady: () => void;
  /** Called when the device can't keep up even at reduced quality. */
  onTooSlow: () => void;
}

// ------------------------------------------------------------- camera -----

interface Shot {
  position: [number, number, number];
  target: [number, number, number];
}

const SHOTS: Record<"base" | Mode, Shot> = {
  base: { position: [0.32, 3.15, 7.3], target: [-0.2, 1.24, -0.15] },
  // Tracing leans toward the characters' faces…
  tracing: { position: [0.22, 2.95, 6.95], target: [-0.2, 1.4, -0.3] },
  // …Shaping looks down onto the table and laptop.
  shaping: { position: [0.02, 3.75, 6.5], target: [-0.2, 1.14, -0.3] },
};

/** Minimum width/height ratio the composition needs; narrower canvases pull the camera back. */
const FIT_ASPECT = 1.0;

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();
const tmpHover = new THREE.Vector3();

function CameraRig({ live }: { live: React.MutableRefObject<SceneLive> }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const pointer = useThree((s) => s.pointer);
  const look = useRef(new THREE.Vector3(...SHOTS.base.target));
  const parallax = useRef(new THREE.Vector2());
  const first = useRef(true);

  useFrame((_, dt) => {
    const { selected, hover, reduced } = live.current;
    const shot = SHOTS[selected ?? "base"];
    tmpPos.set(...shot.position);
    tmpTarget.set(...shot.target);
    // Hover previews nudge the camera a quarter of the way.
    if (!selected && hover) {
      tmpPos.lerp(tmpHover.set(...SHOTS[hover].position), 0.25);
      tmpTarget.lerp(tmpHover.set(...SHOTS[hover].target), 0.25);
    }
    const fit = Math.max(1, FIT_ASPECT / (size.width / size.height));
    tmpPos.sub(tmpTarget).multiplyScalar(fit).add(tmpTarget);

    if (!reduced) {
      parallax.current.x = damp(parallax.current.x, pointer.x, 2, dt);
      parallax.current.y = damp(parallax.current.y, pointer.y, 2, dt);
      tmpPos.x += parallax.current.x * 0.35;
      tmpPos.y += parallax.current.y * 0.15;
    }

    // Start slightly further away and settle in.
    if (first.current) {
      first.current = false;
      if (!reduced) camera.position.copy(tmpPos).sub(tmpTarget).multiplyScalar(1.12).add(tmpTarget);
      else camera.position.copy(tmpPos);
      look.current.copy(tmpTarget);
    }
    const k = reduced ? 1 : 1 - Math.exp(-2.2 * Math.min(dt, 0.1));
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpTarget, k);
    camera.lookAt(look.current);
  });
  return null;
}

// ------------------------------------------------------------- scene ------

function Lights({ quality }: { quality: "high" | "low" }) {
  const map = quality === "high" ? 2048 : 1024;
  return (
    <>
      <hemisphereLight args={["#FFF8EE", "#E9DCCB", 0.75]} />
      <directionalLight
        position={[-4, 6.5, 3.2]}
        intensity={1.7}
        color="#FFF1DE"
        castShadow
        shadow-mapSize={[map, map]}
        shadow-camera-left={-3.2}
        shadow-camera-right={3.2}
        shadow-camera-top={3.2}
        shadow-camera-bottom={-3.2}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[1.5, 2.5, 6]} intensity={0.6} color="#FFF0EA" />
      <Environment resolution={128} frames={1} environmentIntensity={0.7}>
        <color attach="background" args={["#F2EADF"]} />
        <Lightformer form="rect" intensity={2.4} color="#FFF4E4" position={[-5, 4, 2]} scale={[5, 5, 1]} target={[0, 0.8, 0]} />
        <Lightformer form="rect" intensity={1} color="#FFE6DA" position={[4, 2.5, 5]} scale={[6, 3, 1]} target={[0, 0.8, 0]} />
        <Lightformer form="circle" intensity={0.8} color="#FFFFFF" position={[0, 6, 0]} scale={3} rotation-x={Math.PI / 2} />
      </Environment>
    </>
  );
}

function SceneContents({ selected, onSelect, reduced, quality, onReady }: Omit<Scene3DProps, "active" | "onTooSlow">) {
  const hover = usePortfolioStore((s) => s.hover);
  const hoverObject = usePortfolioStore((s) => s.hoverObject);
  const clock = useThree((s) => s.clock);
  const invalidate = useThree((s) => s.invalidate);

  const live = useRef<SceneLive>({ selected, hover, hoverObject, reduced, selectedAt: -10, onSelect });
  const prevSelected = useRef(selected);
  if (prevSelected.current !== selected) {
    prevSelected.current = selected;
    live.current.selectedAt = clock.elapsedTime;
  }
  Object.assign(live.current, { selected, hover, hoverObject, reduced, onSelect });

  // With reduced motion the scene renders on demand: redraw on every change.
  useEffect(() => invalidate(), [invalidate, selected, hover, hoverObject, reduced]);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <SceneContext.Provider value={live}>
      <CameraRig live={live} />
      <Lights quality={quality} />

      <Table />
      <Laptop />
      <Furniture />
      <Characters />
      <Connections />
      <Workbench />
      <HoverLabel />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.13} color="#6B5440" />
      </mesh>
      {quality === "high" && (
        <ContactShadows
          position={[0, 0.002, 0]}
          scale={8}
          resolution={512}
          blur={2.6}
          far={1.6}
          opacity={0.42}
          color="#5E4B39"
          frames={90}
        />
      )}
    </SceneContext.Provider>
  );
}

export default function Scene3D({ active, reduced, quality, onTooSlow, ...rest }: Scene3DProps) {
  // Step down once if frames drop; give up on 3D if it is still far too slow.
  const [degraded, setDegraded] = useState(false);
  const level = degraded ? "low" : quality;
  return (
    <Canvas
      shadows={!degraded}
      dpr={degraded ? 1 : [1, quality === "high" ? 1.75 : 1.5]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ fov: 30, near: 0.1, far: 60, position: SHOTS.base.position }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1.06,
      }}
      onPointerMissed={() => setHover(null)}
    >
      <PerformanceMonitor
        bounds={() => [30, 55]}
        flipflops={3}
        onDecline={({ fps }) => {
          if (degraded && fps < 15) onTooSlow();
          setDegraded(true);
        }}
        onFallback={onTooSlow}
      />
      <SceneContents reduced={reduced} quality={level} {...rest} />
    </Canvas>
  );
}

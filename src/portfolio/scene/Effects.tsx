import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Line, QuadraticBezierLine } from "@react-three/drei";
import { MODES } from "../data/modes";
import { ModeIcon } from "../components/ModeIcon";
import { CAST } from "./cast";
import { GEO, MAT, TABLE_TOP, damp, useSceneLive } from "./shared";

type LineRef = React.ElementRef<typeof QuadraticBezierLine>;

/** Which characters "talk" to each other in Tracing mode. */
const PAIRS: [number, number][] = [
  [0, 2],
  [2, 3],
  [3, 1],
  [1, 0],
];
const DOT_COLORS = ["#9B95A6", "#5EA56A", "#EB7983", "#A196DA"];

/**
 * Tracing: dashed arcs between the characters with small "messages"
 * travelling along them — a trace of the conversation.
 */
export function Connections() {
  const live = useSceneLive();
  const amount = useRef(0);
  const lines = useRef<(LineRef | null)[]>([]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const group = useRef<THREE.Group>(null);

  const curves = useMemo(
    () =>
      PAIRS.map(([a, b]) => {
        const start = new THREE.Vector3(...CAST[a].anchor).add(new THREE.Vector3(0, -0.12, 0));
        const end = new THREE.Vector3(...CAST[b].anchor).add(new THREE.Vector3(0, -0.12, 0));
        const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.55, 0));
        return { start, end, mid, curve: new THREE.QuadraticBezierCurve3(start, mid, end) };
      }),
    [],
  );

  useFrame((state, dt) => {
    const { selected, hover, reduced } = live.current;
    const target = selected === "tracing" ? 1 : hover === "tracing" ? 0.45 : 0;
    amount.current = damp(amount.current, target, 3, dt, reduced);
    const a = amount.current;
    if (group.current) group.current.visible = a > 0.01;
    const t = state.clock.elapsedTime;

    lines.current.forEach((line) => {
      if (!line) return;
      line.material.opacity = a * 0.5;
      if (!reduced) line.material.dashOffset -= dt * 0.18;
    });
    dots.current.forEach((dot, i) => {
      if (!dot) return;
      const u = reduced ? 0.5 : (t * 0.22 + i * 0.27) % 1;
      dot.position.copy(curves[i].curve.getPoint(u));
      dot.scale.setScalar(0.035 * a * Math.sin(Math.PI * Math.min(1, u * 1.05)) + 0.0001);
    });
  });

  return (
    <group ref={group} visible={false}>
      {curves.map(({ start, end, mid }, i) => (
        <QuadraticBezierLine
          key={i}
          ref={(el) => (lines.current[i] = el)}
          start={start}
          end={end}
          mid={mid}
          color="#3A3833"
          lineWidth={1.4}
          dashed
          dashSize={0.05}
          gapSize={0.05}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ))}
      {curves.map((_, i) => (
        <mesh key={i} ref={(el) => (dots.current[i] = el)} geometry={GEO.sphere}>
          <meshStandardMaterial color={DOT_COLORS[PAIRS[i][0]]} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

const BLOCKS = [
  { kind: "box", mat: MAT.block.yellow, size: 0.13 },
  { kind: "cone", mat: MAT.block.sage, size: 0.1 },
  { kind: "torus", mat: MAT.block.lavender, size: 0.075 },
  { kind: "sphere", mat: MAT.block.coral, size: 0.075 },
] as const;

const RING_POINTS = Array.from({ length: 97 }, (_, i) => {
  const a = (i / 96) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5);
});

const easeOut = (x: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(x, 0, 1), 3);

/** Shaping: building blocks rise from the table and a dashed "blueprint" ring appears. */
export function Workbench() {
  const live = useSceneLive();
  const amount = useRef(0);
  const group = useRef<THREE.Group>(null);
  const blocks = useRef<(THREE.Mesh | null)[]>([]);
  const ring = useRef<React.ElementRef<typeof Line>>(null);
  const ringGroup = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const { selected, hover, reduced } = live.current;
    const target = selected === "shaping" ? 1 : hover === "shaping" ? 0.35 : 0;
    amount.current = damp(amount.current, target, 3, dt, reduced);
    const a = amount.current;
    if (group.current) group.current.visible = a > 0.01;
    const t = reduced ? 1.2 : state.clock.elapsedTime;

    blocks.current.forEach((m, i) => {
      if (!m) return;
      const grow = easeOut(a * 1.5 - i * 0.12);
      const angle = t * 0.35 + (i * Math.PI) / 2;
      m.position.set(Math.cos(angle) * 0.36 + 0.05, 1.12 + i * 0.05 + Math.sin(t * 1.3 + i) * 0.035, Math.sin(angle) * 0.36 + 0.12);
      m.rotation.set(t * 0.5 + i, t * 0.7 + i, 0);
      m.scale.setScalar(BLOCKS[i].size * grow + 0.0001);
    });
    if (ring.current) ring.current.material.opacity = a * 0.55;
    if (ringGroup.current && !reduced) ringGroup.current.rotation.y = t * 0.15;
  });

  return (
    <group ref={group} visible={false}>
      {BLOCKS.map((b, i) => (
        <mesh key={b.kind} ref={(el) => (blocks.current[i] = el)} material={b.mat} castShadow>
          {b.kind === "box" && <boxGeometry args={[1, 1, 1]} />}
          {b.kind === "cone" && <coneGeometry args={[0.9, 1.6, 32]} />}
          {b.kind === "torus" && <torusGeometry args={[1, 0.42, 20, 40]} />}
          {b.kind === "sphere" && <sphereGeometry args={[1, 32, 20]} />}
        </mesh>
      ))}
      <group ref={ringGroup} position={[0.05, TABLE_TOP + 0.004, 0.12]}>
        <Line
          ref={ring}
          points={RING_POINTS}
          color="#3A3833"
          lineWidth={1.2}
          dashed
          dashSize={0.04}
          gapSize={0.035}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </group>
    </group>
  );
}

const LABEL_ANCHORS: Record<string, [number, number, number]> = {
  ...Object.fromEntries(CAST.map((c) => [c.id, c.anchor])),
  table: [0.5, TABLE_TOP + 0.2, 0.75],
  laptop: [-0.1, TABLE_TOP + 0.62, -0.4],
};

/** Small label next to the hovered object, explaining what selecting it does. */
export function HoverLabel() {
  const live = useSceneLive();
  const { hoverObject, hover, selected } = live.current;
  if (!hoverObject || !hover || !LABEL_ANCHORS[hoverObject]) return null;
  const isCurrent = selected === hover;
  return (
    <Html position={LABEL_ANCHORS[hoverObject]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <span className="scene-chip" data-mode={hover}>
        <ModeIcon mode={hover} />
        <span className="scene-chip__label">{MODES[hover].label}</span>
        <span className="scene-chip__hint">{isCurrent ? "you're here" : "click to explore"}</span>
      </span>
    </Html>
  );
}

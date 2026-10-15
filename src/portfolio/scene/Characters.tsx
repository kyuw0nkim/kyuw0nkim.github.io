import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CAST } from "./cast";
import type { CharacterSpec } from "./cast";
import { GEO, MAT, TABLE_TOP, damp, puffyStar, radiusAt, smoothLathe, useSceneLive, useTarget, wrapAngle, yawTo } from "./shared";

const TABLE_CENTER = new THREE.Vector3(0, TABLE_TOP, 0);

/**
 * Animation + pointer events for one character. Bodies are built from simple
 * primitives so they can later be swapped for GLB models: replace the rig's
 * children with <primitive object={gltf.scene} /> and keep the rig.
 */
function CharacterRig({ spec, index, children }: { spec: CharacterSpec; index: number; children: ReactNode }) {
  const inner = useRef<THREE.Group>(null);
  const live = useSceneLive();
  const handlers = useTarget("tracing", spec.id);
  const anim = useRef({ scale: 0.85, lift: 0, yaw: 0 });
  const phase = index * 1.7;
  const base = useMemo(() => new THREE.Vector3(...spec.position), [spec.position]);

  useFrame((state, dt) => {
    const g = inner.current;
    if (!g) return;
    const { selected, hover, hoverObject, reduced, selectedAt } = live.current;
    const t = state.clock.elapsedTime;
    const a = anim.current;
    const isHovered = hoverObject === spec.id;
    const tracing = selected === "tracing" || hover === "tracing";
    const shaping = selected === "shaping" || hover === "shaping";

    a.scale = damp(a.scale, isHovered ? 1.07 : tracing ? 1.025 : 1, 7, dt, reduced);
    a.lift = damp(a.lift, isHovered ? 0.06 : 0, 7, dt, reduced);

    // A small hop when a mode gets selected, one character after another.
    const since = t - selectedAt - index * 0.09;
    const hop = !reduced && since > 0 && since < 0.5 ? Math.sin((since / 0.5) * Math.PI) * 0.08 : 0;
    // In Tracing, characters take turns "speaking".
    const speaking = selected === "tracing" && !reduced && Math.floor(t / 1.7) % 4 === index;
    const talk = speaking ? Math.abs(Math.sin(t * 8)) * 0.018 : 0;
    const breath = reduced ? 0 : Math.sin(t * 1.5 + phase) * 0.014;

    g.position.y = a.lift + hop + talk;
    g.scale.set(a.scale * (1 - breath * 0.5), a.scale * (1 + breath), a.scale * (1 - breath * 0.5));

    // Turn toward the visitor when hovered, toward the table while shaping.
    let yaw = 0;
    if (isHovered) yaw = wrapAngle(yawTo(base, state.camera.position) - spec.rotationY);
    else if (shaping) yaw = wrapAngle(yawTo(base, TABLE_CENTER) - spec.rotationY);
    a.yaw = damp(a.yaw, THREE.MathUtils.clamp(yaw, -0.55, 0.55), 4, dt, reduced);
    g.rotation.y = a.yaw;
    g.rotation.z = reduced ? 0 : Math.sin(t * 0.7 + phase) * 0.02;
  });

  return (
    <group position={spec.position} rotation-y={spec.rotationY}>
      <group ref={inner} {...handlers}>
        {children}
      </group>
    </group>
  );
}

/** Two dot eyes that blink now and then. */
function Eyes({ y, z, gap, size = 0.042, phase = 0 }: { y: number; z: number; gap: number; size?: number; phase?: number }) {
  const ref = useRef<THREE.Group>(null);
  const live = useSceneLive();
  useFrame((state) => {
    if (!ref.current) return;
    const cycle = (state.clock.elapsedTime + phase * 2.3) % 4.6;
    const blink = !live.current.reduced && cycle < 0.16 ? Math.sin((cycle / 0.16) * Math.PI) : 0;
    ref.current.scale.y = 1 - blink * 0.88;
  });
  return (
    <group ref={ref} position={[0, y, z]}>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={GEO.eye}
          material={MAT.eye}
          position={[(s * gap) / 2, 0, 0]}
          scale={[size, size * 1.2, size * 0.6]}
        />
      ))}
    </group>
  );
}

function Ghost() {
  const { geometry, profile } = useMemo(
    () =>
      smoothLathe([
        [0.001, 0],
        [0.5, 0.0],
        [0.6, 0.06],
        [0.635, 0.24],
        [0.63, 0.6],
        [0.6, 0.92],
        [0.53, 1.18],
        [0.4, 1.4],
        [0.22, 1.54],
        [0.001, 1.59],
      ]),
    [],
  );
  const eyeY = 1.22;
  const eyeGap = 0.25;
  const eyeZ = Math.sqrt(radiusAt(profile, eyeY) ** 2 - (eyeGap / 2) ** 2) - 0.012;
  return (
    <>
      <mesh geometry={geometry} material={MAT.ghost} castShadow />
      <Eyes y={eyeY} z={eyeZ} gap={eyeGap} size={0.045} phase={0} />
      {/* hands resting on the table, behind the laptop */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={GEO.sphere}
          material={MAT.ghost}
          position={[s * 0.4, TABLE_TOP - 0.38 + 0.05, 0.62]}
          scale={[0.11, 0.07, 0.14]}
          castShadow
        />
      ))}
    </>
  );
}

const CLOVER_LOBES: [number, number, number][] = Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 2 + (i * Math.PI * 2) / 6;
  return [Math.cos(a) * 0.36, Math.sin(a) * 0.34, i % 2 ? 0.27 : 0.3];
});

function Clover() {
  const cy = 0.66;
  return (
    <>
      <mesh geometry={GEO.sphere} material={MAT.clover} position={[0, cy, 0.03]} scale={0.4} castShadow />
      {CLOVER_LOBES.map(([x, y, r], i) => (
        <mesh key={i} geometry={GEO.sphere} material={MAT.clover} position={[x, cy + y, -0.06]} scale={r} castShadow />
      ))}
      <Eyes y={cy + 0.06} z={0.405} gap={0.2} phase={1} />
      <mesh geometry={GEO.sphere} material={MAT.nose} position={[0, cy - 0.03, 0.425]} scale={0.036} />
      {/* arms on the table edge */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={GEO.sphere}
          material={MAT.clover}
          position={[s * 0.24, TABLE_TOP - 0.46 + 0.07, 0.44]}
          scale={[0.1, 0.08, 0.17]}
          castShadow
        />
      ))}
    </>
  );
}

function Star() {
  const geometry = useMemo(() => puffyStar(), []);
  const cy = 0.6;
  return (
    <>
      <mesh geometry={geometry} material={MAT.star} position={[0, cy, 0]} castShadow />
      <Eyes y={cy + 0.03} z={0.19} gap={0.17} size={0.04} phase={2} />
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={GEO.sphere}
          material={MAT.star}
          position={[s * 0.25, TABLE_TOP - 0.5 + 0.06, 0.42]}
          scale={[0.1, 0.07, 0.13]}
          castShadow
        />
      ))}
    </>
  );
}

function Lavender() {
  const r = 0.35;
  const sy = 0.9;
  const eyeY = r * sy + 0.06;
  const eyeGap = 0.16;
  const eyeZ = Math.sqrt(r * r - (eyeGap / 2) ** 2 - ((eyeY - r * sy) / sy) ** 2) - 0.01;
  return (
    <>
      <mesh geometry={GEO.sphere} material={MAT.lavender} position={[0, r * sy, 0]} scale={[r, r * sy, r]} castShadow />
      <Eyes y={eyeY} z={eyeZ} gap={eyeGap} size={0.036} phase={3} />
    </>
  );
}

export function Characters() {
  const bodies = [<Ghost key="g" />, <Clover key="c" />, <Star key="s" />, <Lavender key="l" />];
  return (
    <>
      {CAST.map((spec, i) => (
        <CharacterRig key={spec.id} spec={spec} index={i}>
          {bodies[i]}
        </CharacterRig>
      ))}
    </>
  );
}

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { MAT, TABLE_RADIUS, TABLE_TOP, damp, smoothLathe, useSceneLive, useTarget } from "./shared";

/** Round stone table with a soft pedestal — the Shaping workbench. */
export function Table() {
  const handlers = useTarget("shaping", "table");
  const top = useMemo(() => {
    const r = TABLE_RADIUS - 0.045;
    const pts = [new THREE.Vector2(0.001, TABLE_TOP - 0.09)];
    for (let i = 0; i <= 12; i++) {
      const a = -Math.PI / 2 + (i / 12) * Math.PI;
      pts.push(new THREE.Vector2(r + Math.cos(a) * 0.045, TABLE_TOP - 0.045 + Math.sin(a) * 0.045));
    }
    pts.push(new THREE.Vector2(0.001, TABLE_TOP));
    return new THREE.LatheGeometry(pts, 96);
  }, []);
  const pedestal = useMemo(
    () =>
      smoothLathe([
        [0.001, 0],
        [0.6, 0],
        [0.63, 0.03],
        [0.58, 0.08],
        [0.47, 0.17],
        [0.41, 0.34],
        [0.41, 0.52],
        [0.45, 0.64],
        [0.54, TABLE_TOP - 0.09],
        [0.001, TABLE_TOP - 0.09],
      ]).geometry,
    [],
  );
  return (
    <group {...handlers}>
      <mesh geometry={top} material={MAT.stone} castShadow receiveShadow />
      <mesh geometry={pedestal} material={MAT.stoneBase} castShadow receiveShadow />
    </group>
  );
}

/** A plain, logo-free laptop. Its screen lights up in Shaping. */
export function Laptop() {
  const handlers = useTarget("shaping", "laptop");
  const live = useSceneLive();
  const light = useRef<THREE.PointLight>(null);
  const glow = useRef(0.06);

  useFrame((_, dt) => {
    const { selected, hover, reduced } = live.current;
    const target = selected === "shaping" ? 1 : hover === "shaping" ? 0.6 : 0.06;
    glow.current = damp(glow.current, target, 3.5, dt, reduced);
    MAT.screen.emissiveIntensity = glow.current * 1.3;
    if (light.current) light.current.intensity = glow.current * 1.6;
  });

  return (
    <group position={[-0.12, TABLE_TOP, -0.58]} rotation-y={0.1} {...handlers}>
      <RoundedBox args={[0.6, 0.026, 0.42]} radius={0.01} smoothness={3} position={[0, 0.013, 0]} material={MAT.aluminium} castShadow receiveShadow />
      <mesh position={[0, 0.0265, -0.04]} rotation-x={-Math.PI / 2} material={MAT.keyboard}>
        <planeGeometry args={[0.5, 0.2]} />
      </mesh>
      {/* lid, hinged at the edge facing the camera, leaning away from the white character */}
      <group position={[0, 0.026, 0.2]} rotation-x={0.26}>
        <RoundedBox args={[0.6, 0.4, 0.016]} radius={0.008} smoothness={3} position={[0, 0.2, 0]} material={MAT.aluminium} castShadow />
        <mesh position={[0, 0.2, -0.0085]} rotation-y={Math.PI} material={MAT.screen}>
          <planeGeometry args={[0.54, 0.34]} />
        </mesh>
        <mesh position={[0.11, 0.26, 0.0086]} material={MAT.sticker}>
          <circleGeometry args={[0.032, 32]} />
        </mesh>
      </group>
      <pointLight ref={light} position={[0, 0.28, -0.32]} color="#FFE3A0" distance={1.6} decay={2} intensity={0} />
    </group>
  );
}

function Legs({ spread, height, y = 0, radius = 0.032 }: { spread: [number, number]; height: number; y?: number; radius?: number }) {
  return (
    <>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh
          key={`${sx}${sz}`}
          material={MAT.wood}
          position={[sx * spread[0], y + height / 2, sz * spread[1]]}
          rotation={[sz * 0.06, 0, -sx * 0.06]}
          castShadow
        >
          <cylinderGeometry args={[radius * 0.85, radius, height, 16]} />
        </mesh>
      ))}
    </>
  );
}

function Armchair(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[1.12, 0.2, 0.86]} radius={0.08} smoothness={4} position={[0, 0.37, 0]} material={MAT.fabric} castShadow receiveShadow />
      <RoundedBox args={[1.12, 0.74, 0.2]} radius={0.09} smoothness={4} position={[0, 0.72, -0.4]} material={MAT.fabric} castShadow />
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.18, 0.42, 0.82]} radius={0.08} smoothness={4} position={[s * 0.56, 0.56, -0.01]} material={MAT.fabric} castShadow />
      ))}
      <Legs spread={[0.44, 0.32]} height={0.28} />
    </group>
  );
}

function SideChair(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[0.8, 0.14, 0.7]} radius={0.06} smoothness={4} position={[0, 0.43, 0]} material={MAT.fabric} castShadow />
      <RoundedBox args={[0.8, 0.64, 0.14]} radius={0.07} smoothness={4} position={[0, 0.78, -0.33]} material={MAT.fabric} castShadow />
      <Legs spread={[0.32, 0.26]} height={0.37} />
    </group>
  );
}

function Stool(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[0.66, 0.12, 0.66]} radius={0.06} smoothness={4} position={[0, 0.44, 0]} material={MAT.fabric} castShadow receiveShadow />
      <Legs spread={[0.2, 0.2]} height={0.39} radius={0.036} />
    </group>
  );
}

export function Furniture() {
  return (
    <>
      <Armchair position={[-1.47, 0, 0.32]} rotation-y={1.0} />
      <SideChair position={[1.28, 0, -1.0]} rotation-y={-0.8} />
      <Stool position={[1.08, 0, 0.93]} rotation-y={0.3} />
    </>
  );
}

import styles from './Background.module.css'
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Cell(props) {
  const group = useRef();
  useFrame(() => {
    group.current.rotation.x += 0.005
    group.current.rotation.y += 0.005
  })
  const { nodes, materials } = useGLTF("/Cell.gltf");
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sphere01.geometry}
        material={nodes.Sphere01.material}
      />
    </group>
  );
}

useGLTF.preload("/Cell.gltf");

const Background = () => {
  return (
    <Canvas camera={{ position: [100, 100, 20] }} shadowmap="true" className={styles.canvas}>
      <directionalLight
        intensity={1}
        color="red"
        position={[10, 5, 10]}
        castShadow
        shadow-mapSize-height={218}
        shadow-mapSize-width={218}
      />
      <Cell color="red" position={[0, 0, 0]} />
    </Canvas>
  )
}

export default Background
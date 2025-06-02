import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function HumanModel(props) {
  const { nodes, materials } = useGLTF('/human.glb');

  // Log all available nodes and materials to check for missing parts
  console.log("GLTF Node Keys:", Object.keys(nodes)); // Node names
  console.log("GLTF Material Keys:", Object.keys(materials)); // Material names

  // Check if nodes and materials exist before rendering
  if (!nodes || !materials) {
    console.error("Model data is missing or not loaded correctly");
    return <mesh><boxGeometry /><meshStandardMaterial color="red" /></mesh>;  // Placeholder for debugging
  }

  return (
    <group {...props} dispose={null}>
      {/* Check if the necessary nodes exist and render them */}
      {nodes["bishop"] && nodes["bishop"].geometry ? (
        <mesh geometry={nodes["bishop"].geometry} material={materials["skin"]} />
      ) : (
        <mesh><boxGeometry /><meshStandardMaterial color="green" /></mesh> // Debug placeholder
      )}

      {nodes["bishop_hair_0"] && nodes["bishop_hair_0"].geometry ? (
        <mesh geometry={nodes["bishop_hair_0"].geometry} material={materials["hair"]} />
      ) : (
        <mesh><boxGeometry /><meshStandardMaterial color="blue" /></mesh> // Debug placeholder
      )}

      {nodes["bishop_clothing_0"] && nodes["bishop_clothing_0"].geometry ? (
        <mesh geometry={nodes["bishop_clothing_0"].geometry} material={materials["clothing"]} />
      ) : (
        <mesh><boxGeometry /><meshStandardMaterial color="yellow" /></mesh> // Debug placeholder
      )}

      {nodes["bishop_eyes_teeth_mat_0"] && nodes["bishop_eyes_teeth_mat_0"].geometry ? (
        <mesh geometry={nodes["bishop_eyes_teeth_mat_0"].geometry} material={materials["eyes_teeth_mat"]} />
      ) : (
        <mesh><boxGeometry /><meshStandardMaterial color="red" /></mesh> // Debug placeholder
      )}
    </group>
  );
}

useGLTF.preload('/human.glb');

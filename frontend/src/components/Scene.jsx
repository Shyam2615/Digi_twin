import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import Controls from './Controls';

export default function Scene() {
  const [modelScale, setModelScale] = useState([0.5, 0.5, 0.5]);

  const handleUpdate = ({ physicalActivity, bmi }) => {
    let scale = bmi / 22; // Normalize BMI to a scale factor
  
    // Ensure scale doesn’t become too small or too large
    scale = Math.max(0.3, Math.min(1.5, scale));
  
    setModelScale([scale, scale, scale]);
  };
  
  return (
    <>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
        <HumanModel scale={[1, 1, 1]} position={[0, -1, 0]} />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Controls onUpdate={handleUpdate} />
    </>
  );
}
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Human from "./Human";
import Female from "../../public/Female"

const HumanCanvas = ({ healthData, isAdjusting }) => {

  const [gender, setGender] = useState("Male");

  useEffect(() => {
    const gen = localStorage.getItem('gender');
    if (gen) {
      setGender(gen);
    }
  }, []);

  return (
    <div className="model-container">
      {/* Background Layer */}
      <div className="model-background"></div>

      {/* 3D Model Canvas */}
      <Canvas>
        <ambientLight intensity={2} />
        <OrbitControls />
        {gender === "Male" ? <Human healthData={healthData} isAdjusting={isAdjusting} /> : <Female />}
      </Canvas>
    </div>
  );
};

export default HumanCanvas;

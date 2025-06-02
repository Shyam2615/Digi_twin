import React, { useMemo, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

export default function Human({ healthData, isAdjusting }) {
  const { scene } = useGLTF("/human.gltf");
  const [tempColor, setTempColor] = useState("white");

  // Adjust scale dynamically based on BMI
  const targetScale = useMemo(() => {
    switch (healthData.bmi_category) {
      case "Obese":
        return 1.2;
      case "Overweight":
        return 1.1;
      case "Normal":
        return 1.0;
      case "Underweight":
      default:
        return 0.9;
    }
  }, [healthData]);

  // Animated scaling effect
  const { scale } = useSpring({ scale: targetScale, config: { tension: 200, friction: 20 } });

  // Determine temporary color when adjusting sliders
  useEffect(() => {
    if (isAdjusting) {
      if (healthData.stress_level > 7) setTempColor("red");
      else if (healthData.stress_level > 4) setTempColor("orange");
      else if (healthData.sleep_duration < 4) setTempColor("gray");
      else if (healthData.sleep_duration < 6) setTempColor("lightgray");
      else setTempColor("white");

      // Reset color after 2 seconds of inactivity
      const timer = setTimeout(() => {
        setTempColor("white");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAdjusting, healthData]);

  // Apply color changes to the model
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set(tempColor);
      }
    });
  }, [tempColor, scene]);

  return <animated.primitive object={scene} scale={scale.to((s) => [s, s, s])} />;
}

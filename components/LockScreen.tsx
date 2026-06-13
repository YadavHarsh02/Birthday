"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, Sparkles, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { Hourglass } from 'lucide-react';
import * as THREE from 'three';

// 3D Heart component
function Heart(props: any) {
  const mesh = useRef<THREE.Mesh>(null);
  const shape = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    return heartShape;
  }, []);

  const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 1, bevelThickness: 1 };

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2} {...props}>
      <mesh ref={mesh} scale={0.06} rotation={[0, 0, Math.PI]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#ff4757" roughness={0.3} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function HeartsBackground() {
  return (
    <>
      <Heart position={[-4, 2, -5]} rotation={[0, 0.2, 0]} />
      <Heart position={[5, -1, -3]} rotation={[0.1, -0.3, 0]} scale={0.8} />
      <Heart position={[-5, -3, -4]} rotation={[-0.2, 0, 0]} scale={1.2} />
      <Heart position={[3, 4, -6]} rotation={[0, 0, 0.4]} />
      <Heart position={[0, -4, -2]} scale={0.6} />
    </>
  );
}

export function LockScreen({ targetDate }: { targetDate: Date }) {
  // Format the date for the display string "Come back at..."
  const formattedDate = targetDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
  
  const formattedTime = targetDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a0b2e]">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffb6c1" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8a2be2" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={150} scale={14} size={3} speed={0.4} opacity={0.6} color="#ff9ff3" />
          
          <HeartsBackground />
        </Canvas>
      </div>

      {/* Foreground UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
        
        {/* Floating cats and dolls via CSS/SVG icons or emojis for cuteness */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          🐱
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[15%] text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          🐈
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[30%] right-[20%] text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          🪆
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[25%] left-[25%] text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          🧸
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center max-w-3xl text-center backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(138,43,226,0.3)]"
        >
          <motion.div
            animate={{ rotate: [0, 180, 180, 0] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.4, 0.5, 0.9] }}
            className="mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-white"
          >
            <Hourglass size={48} strokeWidth={1.5} />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md font-sans">
            Not yet...
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 font-medium">
            Come back at {formattedTime} on {formattedDate} 💖
          </p>

          <CountdownTimer targetDate={targetDate} />
        </motion.div>
      </div>
    </div>
  );
}

"use client"
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'

// --- 3D UTILS ---

const SLICE_ANGLE = 0.6 // radians

const getShapes = (radius: number) => {
  const mainShape = new THREE.Shape()
  mainShape.moveTo(0, 0)
  mainShape.absarc(0, 0, radius, SLICE_ANGLE, Math.PI * 2, false)
  mainShape.lineTo(0, 0)

  const sliceShape = new THREE.Shape()
  sliceShape.moveTo(0, 0)
  sliceShape.absarc(0, 0, radius, 0, SLICE_ANGLE, false)
  sliceShape.lineTo(0, 0)

  return { mainShape, sliceShape }
}

const extrudeSettings = {
  depth: 1,
  bevelEnabled: true,
  bevelSegments: 4,
  steps: 2,
  bevelSize: 0.05,
  bevelThickness: 0.05
}

// --- 3D COMPONENTS ---

const AnimatedNameTopper = ({ cakeName, yPos }: { cakeName: string, yPos: number }) => {
  if (!cakeName) return null
  return (
    <group position={[0, yPos, 0]}>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
        <Text
          fontSize={0.8}
          color="#ff1493"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#ffffff"
          castShadow
        >
          {cakeName}
          <meshPhysicalMaterial
            color="#ff1493"
            emissive="#ff1493"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
          />
        </Text>
        <Sparkles count={40} scale={4} size={3} speed={0.4} opacity={0.8} color="#ffd700" />
      </Float>
    </group>
  )
}

const ProceduralCake = ({ tiers, frostingColor, decorations, sequencePhase, cakeName }: any) => {
  const cakeGroup = useRef<THREE.Group>(null)
  const sliceGroup = useRef<THREE.Group>(null)

  // Auto-rotate the cake slowly when not celebrating
  useFrame(() => {
    if (cakeGroup.current && sequencePhase === 'idle') {
      cakeGroup.current.rotation.y += 0.005
      if (sliceGroup.current) sliceGroup.current.rotation.y += 0.005
    }
  })

  // Animate slice separation
  useFrame(() => {
    if (sliceGroup.current) {
      if (sequencePhase === 'separated') {
        sliceGroup.current.position.lerp(new THREE.Vector3(1.5, 0, 1.5), 0.05)
      } else {
        sliceGroup.current.position.set(0, 0, 0)
      }
    }
  })

  const tierData = useMemo(() => [
    { radius: 2.5, y: 0 },
    { radius: 1.8, y: 1.1 },
    { radius: 1.2, y: 2.2 }
  ], [])

  // Generate random decorations positions for the top tier
  const decos = useMemo(() => {
    const pearls = []
    const cherries = []
    const topTierRadius = tierData[tiers - 1].radius - 0.2

    // Pearls
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = Math.random() * topTierRadius
      pearls.push({
        x: Math.cos(angle) * r,
        y: tierData[tiers - 1].y + 1,
        z: Math.sin(angle) * r
      })
    }

    // Cherries (around the edge)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const r = topTierRadius - 0.1
      cherries.push({
        x: Math.cos(angle) * r,
        y: tierData[tiers - 1].y + 1,
        z: Math.sin(angle) * r
      })
    }

    // Stars
    const stars = []
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const r = tierData[0].radius + 0.05
      stars.push({
        x: Math.cos(angle) * r,
        y: tierData[0].y + 0.5,
        z: Math.sin(angle) * r,
        angle: -angle + Math.PI / 2
      })
    }

    return { pearls, cherries, stars }
  }, [tiers, tierData])

  // Premium glossy material
  const frostingMaterial = new THREE.MeshPhysicalMaterial({
    color: frostingColor,
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
  })

  // Pipings generator
  const renderPipings = (radius: number, yPos: number, isSlice: boolean = false) => {
    const count = Math.floor(radius * 12)
    const pipings = []
    const start = isSlice ? 0 : SLICE_ANGLE
    const end = isSlice ? SLICE_ANGLE : Math.PI * 2

    for (let i = 0; i < count; i++) {
      const angle = start + (i / count) * (end - start)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      pipings.push(
        <mesh key={i} position={[x, yPos, z]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <primitive object={frostingMaterial} />
        </mesh>
      )
    }
    return pipings
  }

  // Helper to render a tier
  const renderTier = (data: any, isSlice: boolean) => {
    const { mainShape, sliceShape } = getShapes(data.radius)
    const shape = isSlice ? sliceShape : mainShape

    return (
      <group position={[0, data.y, 0]}>
        {/* Main Body */}
        <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <primitive object={frostingMaterial} />
        </mesh>

        {/* Pipings */}
        {decorations.pipings && renderPipings(data.radius, 0.05, isSlice)}
      </group>
    )
  }

  return (
    <group position={[0, -1, 0]}>
      {/* Cake Plate */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.5, 0.2, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.1} />
      </mesh>

      {/* Macarons around the base plate */}
      {decorations.macarons && [...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        if (angle < SLICE_ANGLE) return null; // Leave slice path clear
        const x = Math.cos(angle) * 2.8;
        const z = Math.sin(angle) * 2.8;
        const color = ['#ffb6c1', '#add8e6', '#ffe4b5', '#98fb98'][i % 4];
        return (
          <group key={`macaron-${i}`} position={[x, 0.05, z]} rotation={[0, -angle, 0]}>
            <mesh position={[0, 0.1, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1, 16]} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>
            <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.18, 0.18, 0.05, 16]} /><meshStandardMaterial color="#fff" roughness={0.8} /></mesh>
            <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 0.1, 16]} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>
          </group>
        )
      })}

      {/* Old 3D Name Plaque removed */}

      {/* Main Cake Body (Missing a slice) */}
      <group ref={cakeGroup}>
        {/* Animated Name Topper on top of the highest tier */}
        <AnimatedNameTopper cakeName={cakeName} yPos={tierData[tiers - 1].y + 1.8} />

        {[...Array(tiers)].map((_, i) => (
          <React.Fragment key={`main-tier-${i}`}>
            {renderTier(tierData[i], false)}
          </React.Fragment>
        ))}

        {/* Top Decorations (Only on main body for simplicity) */}
        {decorations.pearls && decos.pearls.map((pos, i) => {
          // Only place if it's not in the slice area
          const angle = Math.atan2(pos.z, pos.x)
          const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle
          if (normalizedAngle > SLICE_ANGLE) {
            return (
              <mesh key={`pearl-${i}`} position={[pos.x, pos.y, pos.z]} castShadow>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.1} clearcoat={1.0} />
              </mesh>
            )
          }
          return null
        })}

        {decorations.cherries && decos.cherries.map((pos, i) => {
          const angle = Math.atan2(pos.z, pos.x)
          const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle
          if (normalizedAngle > SLICE_ANGLE) {
            return (
              <group key={`cherry-${i}`} position={[pos.x, pos.y + 0.1, pos.z]}>
                <mesh castShadow>
                  <sphereGeometry args={[0.2, 32, 32]} />
                  <meshPhysicalMaterial color="#cc0000" metalness={0.2} roughness={0.1} clearcoat={1.0} />
                </mesh>
                {/* Stem */}
                <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.2]}>
                  <cylinderGeometry args={[0.01, 0.02, 0.4, 8]} />
                  <meshStandardMaterial color="#005500" />
                </mesh>
              </group>
            )
          }
          return null
        })}

        {/* Fondant Stars */}
        {decorations.stars && decos.stars.map((pos, i) => {
          const angle = Math.atan2(pos.z, pos.x)
          const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle
          if (normalizedAngle > SLICE_ANGLE) {
            return (
              <group key={`star-${i}`} position={[pos.x, pos.y, pos.z]} rotation={[Math.PI / 2, 0, pos.angle]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.2, 0.2, 0.05, 5]} />
                  <meshPhysicalMaterial color="#ffd700" metalness={0.8} roughness={0.2} clearcoat={1} />
                </mesh>
              </group>
            )
          }
          return null
        })}

        {/* Candles */}
        {decorations.candles && (
          <group position={[0, tierData[tiers - 1].y + 1, 0]}>
            {[1, 2, 3].map((i) => {
              const angle = (i / 4) * Math.PI * 2 // Distribute away from the slice
              const radius = tierData[tiers - 1].radius * 0.5
              const x = Math.cos(angle) * radius
              const z = Math.sin(angle) * radius
              return (
                <group key={`candle-${i}`} position={[x, 0.4, z]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
                    <meshStandardMaterial color={['#ff9999', '#99ccff', '#ffcc99'][i % 3]} />
                  </mesh>
                  <mesh position={[0, 0.45, 0]}>
                    <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
                    <meshStandardMaterial color="#333333" />
                  </mesh>
                  {/* Flame */}
                  {(sequencePhase === 'idle' || sequencePhase === 'approach') && (
                    <mesh position={[0, 0.55, 0]}>
                      <sphereGeometry args={[0.08, 16, 16]} />
                      <meshBasicMaterial color="#ffaa00" />
                      <pointLight color="#ffaa00" intensity={0.5} distance={3} />
                    </mesh>
                  )}
                </group>
              )
            })}
          </group>
        )}
      </group>

      {/* The Separable Slice */}
      <group ref={sliceGroup}>
        {[...Array(tiers)].map((_, i) => (
          <React.Fragment key={`slice-tier-${i}`}>
            {renderTier(tierData[i], true)}
          </React.Fragment>
        ))}
      </group>

    </group>
  )
}

const ProceduralCatWithKnife = ({ sequencePhase, onSequenceComplete }: any) => {
  const catRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const tailRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!catRef.current || !rightArmRef.current) return

    // Tail Swish
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.4
    }

    if (sequencePhase === 'idle') {
      catRef.current.position.set(8, -1, 2)
      rightArmRef.current.rotation.z = 0
    }
    else if (sequencePhase === 'approach') {
      // Slide in
      catRef.current.position.lerp(new THREE.Vector3(3.5, -1, 2), 0.05)
      catRef.current.lookAt(0, 0, 0)
      // Bobbing walk
      catRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 15) * 0.1
    }
    else if (sequencePhase === 'blow') {
      // Stop bobbing, puff cheeks (simulate with a small scale pulse)
      catRef.current.position.y = -1
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05
      catRef.current.scale.set(scale, scale, scale)
    }
    else if (sequencePhase === 'cut') {
      catRef.current.scale.set(1, 1, 1) // Reset scale
      // Raise arm and strike
      // This is a fast animation loop managed by state timing, we'll just lerp the arm
      // Assuming it takes ~1 second. We'll swing it down.
      // rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 5)
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -Math.PI / 2, 0.1)
    }
    else if (sequencePhase === 'separated') {
      // Arm stays down, cat watches
      rightArmRef.current.rotation.z = -Math.PI / 2
    }
  })

  // State machine for the celebration sequence
  useEffect(() => {
    if (sequencePhase === 'approach') {
      const timer = setTimeout(() => onSequenceComplete('blow'), 2500)
      return () => clearTimeout(timer)
    }
    if (sequencePhase === 'blow') {
      const timer = setTimeout(() => onSequenceComplete('cut'), 1500)
      return () => clearTimeout(timer)
    }
    if (sequencePhase === 'cut') {
      // Short strike animation
      const timer = setTimeout(() => onSequenceComplete('separated'), 800)
      return () => clearTimeout(timer)
    }
  }, [sequencePhase, onSequenceComplete])

  return (
    <group ref={catRef}>
      {/* Chef Hat */}
      <group position={[0, 4.2, 0]}>
        <mesh castShadow position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.8, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>

      {/* Body */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[1, 1.5, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Apron */}
      <mesh position={[0, 1.3, 1]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 1.6, 32, 1, false, Math.PI * 0.75, Math.PI * 0.5]} />
        <meshStandardMaterial color="#ffb6c1" side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      {/* Apron Strap */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.02, 0.05, 16, 32]} />
        <meshStandardMaterial color="#ffb6c1" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.6, 3.4, 0]} rotation={[0, 0, 0.2]} castShadow>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 3.4, 0]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Eyes & Nose */}
      <group position={[0, 2.6, 0.95]}>
        <mesh position={[-0.3, 0.2, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#000" /></mesh>
        <mesh position={[0.3, 0.2, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#000" /></mesh>
        <mesh position={[0, 0, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color="#ff9999" /></mesh>
      </group>

      {/* Whiskers */}
      <group position={[0, 2.6, 0.9]}>
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.01, 0.01, 0.6]} /><meshBasicMaterial color="#333" /></mesh>
        <mesh position={[-0.8, -0.1, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.01, 0.01, 0.6]} /><meshBasicMaterial color="#333" /></mesh>
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.01, 0.01, 0.6]} /><meshBasicMaterial color="#333" /></mesh>
        <mesh position={[0.8, -0.1, 0]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.01, 0.01, 0.6]} /><meshBasicMaterial color="#333" /></mesh>
      </group>

      {/* Tail */}
      <group ref={tailRef} position={[0, 0.5, -1]}>
        <mesh position={[0, 0, -0.8]} rotation={[0.5, 0, 0]} castShadow>
          <capsuleGeometry args={[0.2, 1.5, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>

      {/* Left Arm */}
      <mesh position={[-1, 1.5, 0.5]} rotation={[0.5, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right Arm (Holding Knife) */}
      <group ref={rightArmRef} position={[1, 1.8, 0.5]}>
        <mesh position={[0, -0.4, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.2, 0.8, 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Knife */}
        <group position={[0.2, -0.8, 0.4]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          {/* Handle */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.15, 0.6, 0.1]} />
            <meshStandardMaterial color="#3e2723" roughness={0.8} />
          </mesh>
          {/* Blade */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 1.2, 0.02]} />
            <meshPhysicalMaterial color="#cccccc" metalness={1} roughness={0.2} clearcoat={1} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

const ConfettiParticle = ({ position, color }: any) => {
  const ref = useRef<THREE.Mesh>(null)
  const speed = useRef(Math.random() * 0.15 + 0.05)
  const rotSpeed = useRef(Math.random() * 0.2)
  const drift = useRef((Math.random() - 0.5) * 0.08)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y -= speed.current
      ref.current.position.x += drift.current
      ref.current.rotation.x += rotSpeed.current
      ref.current.rotation.y += rotSpeed.current
      if (ref.current.position.y < -5) {
        ref.current.position.y = 10
      }
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.2, 0.1]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

const MiniCat = ({ position, rotation, behavior }: any) => {
  const catRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!catRef.current || !leftArmRef.current || !rightArmRef.current) return

    if (behavior === 'dancing') {
      catRef.current.rotation.y += 0.05
      catRef.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.5
      leftArmRef.current.rotation.z = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 15) * 0.2
      rightArmRef.current.rotation.z = -Math.PI / 4 - Math.sin(state.clock.elapsedTime * 15) * 0.2
    } else if (behavior === 'fighting') {
      catRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 20) * 0.1
      catRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 30) * 0.2
      leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 40) * 0.8
      rightArmRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 40) * 0.8
    }
  })

  return (
    <group ref={catRef} position={position} rotation={rotation} scale={0.4}>
      <mesh position={[0, 1.2, 0]} castShadow><capsuleGeometry args={[1, 1.5, 16, 16]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
      <mesh position={[0, 2.6, 0]} castShadow><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
      <mesh position={[-0.6, 3.4, 0]} rotation={[0, 0, 0.2]} castShadow><coneGeometry args={[0.3, 0.8, 16]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
      <mesh position={[0.6, 3.4, 0]} rotation={[0, 0, -0.2]} castShadow><coneGeometry args={[0.3, 0.8, 16]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>

      <group position={[0, 2.6, 0.95]}>
        <mesh position={[-0.3, 0.2, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#000" /></mesh>
        <mesh position={[0.3, 0.2, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#000" /></mesh>
      </group>

      <group position={[-1, 1.5, 0.5]} ref={leftArmRef}>
        <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0.3]} castShadow><capsuleGeometry args={[0.2, 0.8, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>
      <group position={[1, 1.5, 0.5]} ref={rightArmRef}>
        <mesh position={[0, -0.4, 0]} rotation={[0, 0, -0.3]} castShadow><capsuleGeometry args={[0.2, 0.8, 16, 16]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>
    </group>
  )
}

// --- MAIN SECTION COMPONENT ---

type SequencePhase = 'idle' | 'approach' | 'blow' | 'cut' | 'separated'
type GameState = 'welcome' | 'decorating' | 'celebration'

export function CakeStudio() {
  const [gameState, setGameState] = useState<GameState>('welcome')
  const [sequencePhase, setSequencePhase] = useState<SequencePhase>('idle')

  // Cake State
  const [tiers, setTiers] = useState(1)
  const [frostingColor, setFrostingColor] = useState('#fff0f5')
  const [cakeName, setCakeName] = useState('')

  const [decorations, setDecorations] = useState({
    candles: false,
    pearls: false,
    pipings: false,
    cherries: false,
    macarons: false,
    stars: false
  })

  const toggleDeco = (key: keyof typeof decorations) => {
    setDecorations(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const startDecorating = () => {
    setGameState('decorating')
    setSequencePhase('idle')
    setTiers(1)
    setFrostingColor('#fff0f5')
    setDecorations({ candles: false, pearls: false, pipings: false, cherries: false, macarons: false, stars: false })
  }

  const startCelebration = () => {
    setGameState('celebration')
    setDecorations(prev => ({ ...prev, candles: true })) // Ensure candles
    setSequencePhase('approach')
  }

  return (
    <section className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col font-sans">

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 4, 12], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} castShadow intensity={2.5} />
          <pointLight position={[-10, 5, -10]} intensity={1} color="#ffb6c1" />

          <ProceduralCake
            tiers={tiers}
            frostingColor={frostingColor}
            decorations={decorations}
            sequencePhase={sequencePhase}
            cakeName={cakeName}
          />

          <ProceduralCatWithKnife
            sequencePhase={sequencePhase}
            onSequenceComplete={setSequencePhase}
          />

          {/* Confetti Explosion & Mini Cats */}
          {sequencePhase === 'separated' && (
            <group>
              {[...Array(300)].map((_, i) => (
                <ConfettiParticle
                  key={`confetti-${i}`}
                  position={[(Math.random() - 0.5) * 20, Math.random() * 15 + 5, (Math.random() - 0.5) * 15]}
                  color={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'][Math.floor(Math.random() * 7)]}
                />
              ))}

              {/* Dancing Cats */}
              <MiniCat position={[-4, -1, 1]} rotation={[0, 0.5, 0]} behavior="dancing" />
              <MiniCat position={[4, -1, -1]} rotation={[0, -0.5, 0]} behavior="dancing" />
              <MiniCat position={[-2, -1, -3]} rotation={[0, 1, 0]} behavior="dancing" />

              {/* Fighting Cats */}
              <MiniCat position={[3, -1, 3]} rotation={[0, -Math.PI / 4, 0]} behavior="fighting" />
              <MiniCat position={[4, -1, 3.5]} rotation={[0, Math.PI - Math.PI / 4, 0]} behavior="fighting" />

              <MiniCat position={[-3, -1, 4]} rotation={[0, Math.PI / 4, 0]} behavior="fighting" />
              <MiniCat position={[-4, -1, 4.5]} rotation={[0, -Math.PI + Math.PI / 4, 0]} behavior="fighting" />
            </group>
          )}

          <Environment preset="city" />
          <ContactShadows position={[0, -1.05, 0]} opacity={0.6} scale={12} blur={2.5} far={4} />
        </Canvas>
      </div>

      {/* UI Overlays */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col">

        {/* Welcome State */}
        <AnimatePresence>
          {gameState === 'welcome' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md pointer-events-auto"
            >
              <h1 className="text-5xl md:text-7xl font-cursive text-white drop-shadow-2xl tracking-wide mb-6 text-center">
                Aliya's Cake Studio 🎂
              </h1>
              <p className="text-pink-200 text-lg md:text-xl mb-12 text-center max-w-lg px-4">
                Can't bring you a cake this year, make your own huh!
              </p>
              <button
                onClick={startDecorating}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:scale-105 transition-all active:scale-95 text-xl"
              >
                Start Baking
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorating State (UI Controls) */}
        <AnimatePresence>
          {gameState === 'decorating' && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 p-6 md:p-8 pointer-events-auto flex flex-col items-center shadow-[0_-10px_50px_rgba(0,0,0,0.4)] rounded-t-[40px]"
            >
              <h3 className="text-white text-2xl font-cursive mb-6 drop-shadow-md">High-End Decorator</h3>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 max-w-5xl w-full">

                {/* Tiers */}
                <div className="flex flex-col items-center bg-black/30 p-4 rounded-3xl flex-1 min-w-[120px]">
                  <span className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">Tiers</span>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(t => (
                      <button
                        key={t} onClick={() => setTiers(t)}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${tiers === t ? 'bg-pink-500 text-white scale-110 shadow-[0_0_15px_rgba(236,72,153,0.8)]' : 'bg-white/10 text-white hover:bg-white/30'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frosting Color */}
                <div className="flex flex-col items-center bg-black/30 p-4 rounded-3xl flex-1 min-w-[200px]">
                  <span className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">Glossy Frosting</span>
                  <div className="flex gap-2">
                    {['#fff0f5', '#ffb6c1', '#b0e0e6', '#ffe4b5', '#e6e6fa', '#4a3b32'].map(c => (
                      <button
                        key={c} onClick={() => setFrostingColor(c)}
                        className={`w-8 h-8 rounded-full transition-all border-2 ${frostingColor === c ? 'border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'border-transparent hover:scale-110 opacity-70'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Name Input */}
                <div className="flex flex-col items-center bg-black/30 p-4 rounded-3xl flex-1 min-w-[200px]">
                  <span className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">Name on Cake</span>
                  <input
                    type="text"
                    value={cakeName}
                    onChange={(e) => setCakeName(e.target.value.slice(0, 15))}
                    placeholder="e.g. Happy Birthday!"
                    className="w-full bg-white/20 border border-white/40 text-white placeholder-white/50 rounded-full px-4 py-2 text-center focus:outline-none focus:border-pink-500 focus:bg-white/30 transition-all font-cursive"
                  />
                </div>

                {/* Premium Toppings */}
                <div className="flex flex-col items-center bg-black/30 p-4 rounded-3xl flex-[2] min-w-[320px]">
                  <span className="text-pink-300 text-xs font-bold uppercase tracking-widest mb-3">Premium Toppings</span>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    <button onClick={() => toggleDeco('pipings')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.pipings ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      🧁 Pipings
                    </button>
                    <button onClick={() => toggleDeco('pearls')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.pearls ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      ✨ Pearls
                    </button>
                    <button onClick={() => toggleDeco('cherries')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.cherries ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      🍒 Cherries
                    </button>
                    <button onClick={() => toggleDeco('macarons')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.macarons ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      🍪 Macarons
                    </button>
                    <button onClick={() => toggleDeco('stars')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.stars ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      ⭐ Stars
                    </button>
                    <button onClick={() => toggleDeco('candles')} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${decorations.candles ? 'bg-pink-500 text-white shadow-md' : 'bg-white/10 text-white hover:bg-white/30'}`}>
                      🕯️ Candles
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={startCelebration}
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-105 transition-all active:scale-95 text-xl flex items-center gap-3 border-2 border-white/20"
              >
                <span>🔪</span> Cut the Cake!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration State (Birthday Card) */}
        <AnimatePresence>
          {gameState === 'celebration' && sequencePhase === 'separated' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute inset-0 bg-[#ffe6e6]/90 backdrop-blur-sm pointer-events-auto flex items-center justify-center p-4 z-50"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                {/* Decorative background emojis */}
                {[...Array(20)].map((_, i) => (
                  <span key={i} className="absolute text-4xl" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite alternate`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}>
                    {['🌸', '✨', '🐾', '💖'][Math.floor(Math.random() * 4)]}
                  </span>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, delay: 2 }}
                className="bg-[#fdfbf7] w-full max-w-md rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center relative z-10 border border-pink-100"
              >
                {/* Waving Cat Illustration (CSS Emoji Art placeholder) */}
                <div className="w-24 h-24 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-pink-100 relative">
                  <div className="text-6xl absolute origin-bottom-right animate-[wave_2s_ease-in-out_infinite]">👋</div>
                  <div className="text-6xl relative z-10">🐱</div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                  Happiest Birthday,<br />Pyutu! <span className="text-red-500">❤️</span>
                </h2>

                <p className="text-gray-600 font-medium mb-8 leading-relaxed px-4">
                  I hope you liked this website, live your life to the fullest🌸
                </p>

                <div className="w-full relative px-6 py-4 mb-8">
                  <div className="absolute left-0 top-0 text-3xl text-pink-300 opacity-50">"</div>
                  <p className="text-gray-500 italic text-sm font-medium">
                    You were the best thing that ever happened to me, new me and old you could've been endgame
                  </p>
                </div>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full bg-pink-100 text-pink-600 font-bold py-4 rounded-2xl hover:bg-pink-200 transition-colors active:scale-95"
                >
                  Back to Top ⬆️
                </button>
              </motion.div>

              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                  0% { transform: translateY(0px) rotate(0deg); }
                  100% { transform: translateY(-20px) rotate(10deg); }
                }
                @keyframes wave {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(-20deg); }
                }
              `}} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { X, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"
import type * as THREE from "three"

interface Panda3DProps {
  message?: string
  onClose?: () => void
  language?: string
}

function PandaModel({ animate = true }: { animate?: boolean }) {
  const group = useRef<THREE.Group>(null)
  // In a real implementation, you would use a real panda model
  // For now, we'll use a placeholder cube with panda texture

  useFrame((state) => {
    if (group.current && animate) {
      // Simple breathing animation
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05 + 0.1
      // Subtle head movement
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return (
    <group ref={group} position={[0, 0.1, 0]} scale={[1, 1, 1]}>
      {/* Head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" />

        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.4]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.2, 0.1, 0.4]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.35, 0.35, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.35, 0.35, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.1, 0.45]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Glasses */}
        <mesh position={[0, 0.1, 0.45]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.15, 0.02, 16, 32]} />
          <meshStandardMaterial color="#002147" />
        </mesh>
        <mesh position={[-0.2, 0.1, 0.45]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.1, 0.13, 32]} />
          <meshStandardMaterial color="#002147" />
        </mesh>
        <mesh position={[0.2, 0.1, 0.45]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.1, 0.13, 32]} />
          <meshStandardMaterial color="#002147" />
        </mesh>
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.8, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Suit */}
      <mesh position={[0, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.35, 0.7, 32, 32]} />
        <meshStandardMaterial color="#002147" />
      </mesh>

      {/* Tie */}
      <mesh position={[0, 0.2, 0.45]} rotation={[0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.4, 32]} />
        <meshStandardMaterial color="#007a33" />
      </mesh>
    </group>
  )
}

function Scene({ message, onClose, language = "en" }: Panda3DProps) {
  const [isMuted, setIsMuted] = useState(false)
  const { camera } = useThree()

  useEffect(() => {
    // Position camera to see the panda properly
    camera.position.set(0, 1, 3)
    camera.lookAt(0, 0.5, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <PandaModel />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      <Environment preset="studio" />

      {/* Speech bubble */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64 text-center">
          <p className="text-sm font-medium">
            {message || (language === "es" ? "¡Hola! Soy BankPanda." : "Hi! I'm BankPanda.")}
          </p>
        </div>
      </Html>

      {/* Controls */}
      <Html position={[0, -1, 0]} center>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="gap-1 border-[#002147] text-[#002147]"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4" />
                Unmute
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                Mute
              </>
            )}
          </Button>

          <Button size="sm" className="bg-[#007a33] hover:bg-[#006128]" onClick={onClose}>
            Close
          </Button>
        </div>
      </Html>

      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

export function Panda3D({ message, onClose, language = "en" }: Panda3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl"
    >
      <div className="absolute top-2 right-2 z-10">
        <Button variant="ghost" size="icon" onClick={onClose} className="bg-white/80 hover:bg-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Canvas shadows>
        <Scene message={message} onClose={onClose} language={language} />
      </Canvas>
    </motion.div>
  )
}


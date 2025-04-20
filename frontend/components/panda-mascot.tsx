"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Panda3D } from "@/components/panda-3d"

interface PandaMascotProps {
  size?: "tiny" | "small" | "large"
  language?: string
  position?: "top-left" | "top-right" | "center"
  welcomeMessage?: string
  className?: string
}

export function PandaMascot({
  size = "small",
  language = "en",
  position = "top-left",
  welcomeMessage,
  className,
}: PandaMascotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const modelRef = useRef<HTMLDivElement | null>(null)

  // Create audio element for voice
  useEffect(() => {
    audioRef.current = new Audio("/placeholder.svg") // This would be replaced with actual audio file

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Start animation when component mounts
  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 3000)
    }, 500)

    return () => clearTimeout(animationTimeout)
  }, [])

  // Periodically animate the panda
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 3000)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (size === "tiny" || size === "small") {
      setIsOpen(true)
    } else {
      // For large mascot, just toggle speaking
      toggleSpeaking()
    }
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
    setIsAnimating(true)

    if (!isSpeaking && !isMuted && audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
    } else if (audioRef.current) {
      audioRef.current.pause()
    }

    setTimeout(() => setIsAnimating(false), 3000)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)

    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const getDefaultMessage = () => {
    if (language === "es") {
      return "¡Hola! Soy BankPanda, tu asistente financiero virtual. ¿En qué puedo ayudarte hoy?"
    }
    return "Hi there! I'm BankPanda, your virtual financial assistant. How can I help you today?"
  }

  const message = welcomeMessage || getDefaultMessage()

  const sizeClasses = {
    tiny: "h-10 w-10 cursor-pointer hover:scale-110 transition-transform",
    small: "h-16 w-16 cursor-pointer hover:scale-110 transition-transform",
    large: "h-48 w-48 md:h-64 md:w-64 cursor-pointer hover:scale-105 transition-transform",
  }

  const positionClasses = {
    "top-left": "absolute top-3 left-3 z-10",
    "top-right": "absolute top-3 right-3 z-10",
    center: "mx-auto",
  }

  return (
    <>
      <div
        className={`${sizeClasses[size]} ${position ? positionClasses[position] : ""} relative ${className}`}
        onClick={handleClick}
      >
        <div className="relative w-full h-full">
          <motion.div
            ref={modelRef}
            initial={{ rotate: 0 }}
            animate={isAnimating ? { rotate: [0, -5, 5, -5, 0], y: [0, -5, 0] } : { rotate: 0, y: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-18%20000943-MrSy8P4bMVrpY79hDgNO0wdei0K6iY.png"
              alt="Panda Mascot"
              className="w-full h-full object-contain rounded-full shadow-lg"
            />
          </motion.div>

          {/* Glowing effect when animating */}
          {isAnimating && <div className="absolute inset-0 rounded-full bg-[#00a3e0]/20 animate-pulse -z-10"></div>}

          {/* Speech bubble for large panda when speaking */}
          {size === "large" && isSpeaking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-72 text-center"
            >
              <div className="text-sm font-medium">{message}</div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45"></div>
            </motion.div>
          )}

          {/* Mute button for large panda */}
          {size === "large" && (
            <Button
              variant="outline"
              size="icon"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-md border-[#007a33]"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-[#002147]" />
              ) : (
                <Volume2 className="h-4 w-4 text-[#007a33]" />
              )}
            </Button>
          )}

          {/* Tiny notification dot for tiny panda */}
          {size === "tiny" && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#007a33] rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Full-screen dialog for 3D panda when small panda is clicked */}
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none">
              <Panda3D message={message} onClose={() => setIsOpen(false)} language={language} />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}


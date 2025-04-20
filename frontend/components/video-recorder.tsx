"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Pause, Play, RefreshCw, Video } from "lucide-react"
import { PandaMascot } from "@/components/panda-mascot"

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void
  language?: string
}

export function VideoRecorder({ onRecordingComplete, language = "en" }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Clean up on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    setIsLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      chunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setRecordedBlob(blob)
        onRecordingComplete(blob)

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing media devices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resetRecording = () => {
    setRecordedBlob(null)
    setRecordingTime(0)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video bg-muted relative">
          {!isRecording && !recordedBlob && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted={isRecording}
            playsInline
            className="w-full h-full object-cover"
            src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
          />
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}

          {/* Add Panda Mascot */}
          <div className="absolute top-3 left-3 z-10">
            <PandaMascot
              size="tiny"
              position="top-left"
              language={language}
              welcomeMessage={
                language === "es"
                  ? "¡Hola! Estoy aquí para ayudarte con tu grabación. Habla con claridad y mira a la cámara."
                  : "Hi there! I'm here to help with your recording. Speak clearly and look at the camera."
              }
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {!isRecording && !recordedBlob && (
          <Button onClick={startRecording} disabled={isLoading} className="bg-[#007a33] hover:bg-[#006128]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        )}

        {isRecording && !isPaused && (
          <Button variant="outline" onClick={pauseRecording} className="border-[#002147] text-[#002147]">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        )}

        {isRecording && isPaused && (
          <Button variant="outline" onClick={resumeRecording} className="border-[#002147] text-[#002147]">
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>
        )}

        {isRecording && (
          <Button variant="destructive" onClick={stopRecording}>
            Stop Recording
          </Button>
        )}

        {recordedBlob && (
          <Button variant="outline" onClick={resetRecording} className="border-[#002147] text-[#002147]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Record Again
          </Button>
        )}
      </div>
    </div>
  )
}


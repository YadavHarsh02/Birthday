"use client"
import React, { useState, useRef, useEffect } from 'react'

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Make sure you place a file named 'about-you.mp3' in the public/ folder!
  const audioUrl = "/about-you.mp3"

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        // Handle browser autoplay policy by only playing on interaction
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Auto-play on first scroll or click if possible
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {}) // Ignore if browser blocks
        
        window.removeEventListener('click', handleFirstInteraction)
        window.removeEventListener('scroll', handleFirstInteraction)
      }
    }
    
    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('scroll', handleFirstInteraction)
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('scroll', handleFirstInteraction)
    }
  }, [isPlaying])

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <audio ref={audioRef} src={audioUrl} loop />
      <button 
        onClick={togglePlay}
        className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform active:scale-95"
        title="Toggle Music"
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
    </div>
  )
}

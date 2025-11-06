'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface VideoPlayerProps {
  src: string
  autoplay?: boolean
  onEnded?: () => void
  showVideo?: boolean
}

export default function VideoPlayer({ src, autoplay = true, onEnded, showVideo = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (containerRef.current) {
      // Ensure full opacity from the start
      gsap.set(containerRef.current, { opacity: 1 })
      
      // Animate only scale, not opacity
      gsap.from(containerRef.current, {
        scale: 0.8,
        duration: 1,
        ease: 'power3.out',
      })
    }
  }, [])

  useEffect(() => {
    if (autoplay && videoRef.current && showVideo) {
      // Set video properties for autoplay
      if (videoRef.current) {
        videoRef.current.loop = true
        // Try muted autoplay first (most browsers allow this)
        videoRef.current.muted = true
        
        const playVideo = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                // Once playing, unmute if needed
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.muted = false
                  }
                }, 500)
                setIsPlaying(true)
              })
              .catch((error) => {
                console.error('Error playing video:', error)
                setIsPlaying(false)
              })
          }
        }

        // Small delay to ensure smooth transition
        const timeout = setTimeout(playVideo, 300)

        // Also try on load
        videoRef.current.addEventListener('loadeddata', playVideo, { once: true })

        return () => {
          clearTimeout(timeout)
          if (videoRef.current) {
            videoRef.current.removeEventListener('loadeddata', playVideo)
          }
        }
      }
    }
  }, [autoplay, showVideo])

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    if (onEnded) {
      onEnded()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto px-4 py-8 z-[9999] opacity-100">
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl z-[10000] opacity-100 max-h-[95vh]">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto max-h-[95vh] object-contain"
          controls={showControls}
          onEnded={handleEnded}
          playsInline
          muted={true}
          autoPlay={autoplay}
          loop
          preload="auto"
        >
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls Overlay */}
        {!showControls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:scale-110 transition-transform shadow-xl"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors text-sm"
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {/* Confetti effect when video starts */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  )
}


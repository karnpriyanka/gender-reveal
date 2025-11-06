'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const playAttemptRef = useRef<NodeJS.Timeout | null>(null)

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

  // Attempt to play video with fallback strategies
  const attemptPlay = useCallback(async (strategy: 'muted' | 'unmuted' | 'user' = 'muted') => {
    if (!videoRef.current) return false

    try {
      // Set mute based on strategy
      if (strategy === 'muted') {
        videoRef.current.muted = true
      } else if (strategy === 'unmuted' && hasUserInteracted) {
        videoRef.current.muted = false
      }

      await videoRef.current.play()
      
      // Success - unmute after a short delay if it was muted
      if (strategy === 'muted' && videoRef.current.muted) {
        setTimeout(() => {
          if (videoRef.current && hasUserInteracted) {
            videoRef.current.muted = false
          }
        }, 500)
      }
      
      setIsPlaying(true)
      setAutoplayFailed(false)
      setError(null)
      return true
    } catch (err: any) {
      console.warn(`Play attempt failed (strategy: ${strategy}):`, err)
      return false
    }
  }, [hasUserInteracted])

  useEffect(() => {
    if (!autoplay || !showVideo || !videoRef.current || hasUserInteracted) return

    const video = videoRef.current
    video.loop = true
    video.preload = 'auto'

    // Strategy 1: Try muted autoplay immediately
    const tryAutoplay = async () => {
      const success = await attemptPlay('muted')
      
      if (!success && retryCount < 3) {
        // Strategy 2: Retry after a delay
        playAttemptRef.current = setTimeout(async () => {
          const retrySuccess = await attemptPlay('muted')
          if (!retrySuccess) {
            setRetryCount(prev => prev + 1)
            setAutoplayFailed(true)
            setError('Autoplay was blocked. Click play to start the video.')
          }
        }, 1000)
      } else if (!success) {
        setAutoplayFailed(true)
        setError('Autoplay was blocked. Click play to start the video.')
      }
    }

    // Try when video metadata is loaded
    const handleLoadedMetadata = () => {
      tryAutoplay()
    }

    // Try when video can start playing
    const handleCanPlay = () => {
      if (!isPlaying) {
        tryAutoplay()
      }
    }

    // Handle errors
    const handleError = (e: Event) => {
      const videoError = video.error
      if (videoError) {
        let errorMessage = 'Unable to play video.'
        
        switch (videoError.code) {
          case videoError.MEDIA_ERR_ABORTED:
            errorMessage = 'Video playback was aborted.'
            break
          case videoError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error. Please check your connection.'
            break
          case videoError.MEDIA_ERR_DECODE:
            errorMessage = 'Video format not supported. Try using MP4 format.'
            break
          case videoError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Video format not supported by your browser.'
            break
        }
        
        setError(errorMessage)
        setAutoplayFailed(true)
      }
    }

    // Handle play/pause events
    const handleVideoPlay = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
      setError(null)
    }

    const handleVideoPause = () => {
      setIsPlaying(false)
    }

    const handleVideoPlaying = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
      setError(null)
    }

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('play', handleVideoPlay)
    video.addEventListener('pause', handleVideoPause)
    video.addEventListener('playing', handleVideoPlaying)

    // Initial attempt
    if (video.readyState >= 2) {
      // If already loaded, try immediately
      tryAutoplay()
    }

    return () => {
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current)
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', handleVideoPlay)
      video.removeEventListener('pause', handleVideoPause)
      video.removeEventListener('playing', handleVideoPlaying)
    }
  }, [autoplay, showVideo, retryCount, isPlaying, hasUserInteracted, attemptPlay])

  const handlePlay = async () => {
    if (videoRef.current) {
      setHasUserInteracted(true)
      setError(null)
      
      try {
        // Try unmuted play on user interaction
        const success = await attemptPlay('unmuted')
        if (!success) {
          // Fallback to muted if unmuted fails
          await attemptPlay('muted')
        }
      } catch (err) {
        console.error('Error in handlePlay:', err)
        setError('Unable to play video. Please try again.')
      }
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(0)
    setError(null)
    setAutoplayFailed(false)
    if (videoRef.current) {
      videoRef.current.load() // Reload the video
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
          onClick={handlePlay}
          playsInline
          muted={!hasUserInteracted}
          loop
          preload="auto"
        >
          Your browser does not support the video tag.
        </video>

        {/* Fallback Play Overlay - Shows when autoplay fails */}
        {autoplayFailed && !isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <button
              onClick={handlePlay}
              className="w-24 h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl mb-4 animate-pulse"
              aria-label="Play video"
            >
              <svg className="w-12 h-12 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
            
            {error && (
              <div className="text-center px-4">
                <p className="text-white text-lg font-semibold mb-2">{error}</p>
                <button
                  onClick={handleRetry}
                  className="text-pink-300 hover:text-pink-200 underline text-sm"
                >
                  Retry
                </button>
              </div>
            )}
            
            {!error && (
              <p className="text-white/90 text-lg font-medium">
                Click to play the reveal video
              </p>
            )}
          </div>
        )}

        {/* Custom Controls Overlay - Shows when video is paused and no error */}
        {!showControls && !autoplayFailed && !error && (
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

        {/* Error Message Overlay */}
        {error && !autoplayFailed && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={handleRetry}
                className="ml-4 text-sm underline hover:text-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors text-sm z-10"
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


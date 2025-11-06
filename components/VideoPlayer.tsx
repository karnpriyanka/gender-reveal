'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { detectSamsungTV } from '@/lib/samsung-tv'

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
  const [isSamsungTV, setIsSamsungTV] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoCanPlay, setVideoCanPlay] = useState(false)
  const playAttemptRef = useRef<NodeJS.Timeout | null>(null)

  // Detect Samsung TV on mount
  useEffect(() => {
    const tvInfo = detectSamsungTV()
    setIsSamsungTV(tvInfo.isSamsungTV)
    
    if (tvInfo.isSamsungTV) {
      console.log('Samsung TV detected:', tvInfo)
      // On Samsung TV, autoplay will almost certainly fail
      setAutoplayFailed(true)
      setShowControls(true) // Always show controls on Samsung TV
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      // Skip GSAP animations on Samsung TV (may not be supported)
      if (!isSamsungTV) {
        // Ensure full opacity from the start
        gsap.set(containerRef.current, { opacity: 1 })
        
        // Animate only scale, not opacity
        gsap.from(containerRef.current, {
          scale: 0.8,
          duration: 1,
          ease: 'power3.out',
        })
      } else {
        // Simple CSS animation for Samsung TV
        containerRef.current.style.opacity = '1'
      }
    }
  }, [isSamsungTV])

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
    if (!showVideo || !videoRef.current) return

    const video = videoRef.current
    
    // Samsung TV specific settings
    if (isSamsungTV) {
      // Samsung TV requires metadata preload, not auto
      video.preload = 'metadata'
      // Always show controls on Samsung TV
      setShowControls(true)
      // Autoplay will not work on Samsung TV, so skip it
      video.loop = true
      setAutoplayFailed(true) // Show play button immediately
      return // Skip autoplay attempts on Samsung TV
    }

    // Standard browser settings
    if (!autoplay || hasUserInteracted) return
    
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
  }, [autoplay, showVideo, retryCount, isPlaying, hasUserInteracted, attemptPlay, isSamsungTV])

  // Samsung TV specific video loading handler
  useEffect(() => {
    if (!videoRef.current || !isSamsungTV) return

    const video = videoRef.current

    const handleLoadedData = () => {
      console.log('Samsung TV: Video data loaded')
      setVideoLoaded(true)
    }

    const handleCanPlayThrough = () => {
      console.log('Samsung TV: Video can play through')
      setVideoCanPlay(true)
    }

    const handleError = (e: Event) => {
      const videoError = video.error
      if (videoError) {
        let errorMessage = 'Unable to play video on Samsung TV.'
        
        switch (videoError.code) {
          case videoError.MEDIA_ERR_ABORTED:
            errorMessage = 'Video playback was aborted. Please try again.'
            break
          case videoError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error. Please check your connection and try again.'
            break
          case videoError.MEDIA_ERR_DECODE:
            errorMessage = 'Video format not supported. Please use MP4 with H.264 codec.'
            break
          case videoError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Video format not supported by Samsung TV. Use MP4 (H.264 + AAC) format.'
            break
        }
        
        console.error('Samsung TV video error:', errorMessage, videoError)
        setError(errorMessage)
        setAutoplayFailed(true)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
      setError(null)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('error', handleError)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // Check codec support
    if (video.canPlayType) {
      const mp4Support = video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
      console.log('Samsung TV MP4 codec support:', mp4Support)
      if (mp4Support === '') {
        setError('MP4 format may not be supported. Please ensure video uses H.264 + AAC codecs.')
      }
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [isSamsungTV, showVideo])

  const handlePlay = async () => {
    if (!videoRef.current) return

    setHasUserInteracted(true)
    setError(null)

    // Samsung TV specific handling
    if (isSamsungTV) {
      const video = videoRef.current
      
      try {
        // Samsung TV requires video to be fully loaded
        if (video.readyState < 3) {
          // Wait for video to be ready
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Video load timeout'))
            }, 10000)

            const checkReady = () => {
              if (video.readyState >= 3) {
                clearTimeout(timeout)
                video.removeEventListener('canplaythrough', checkReady)
                resolve()
              }
            }

            if (video.readyState >= 3) {
              clearTimeout(timeout)
              resolve()
            } else {
              video.addEventListener('canplaythrough', checkReady)
              video.load() // Force reload if needed
            }
          })
        }

        // Set properties explicitly for Samsung TV
        video.muted = false
        video.loop = true
        
        // Play on Samsung TV
        await video.play()
        setIsPlaying(true)
        setAutoplayFailed(false)
        console.log('Samsung TV: Video playing successfully')
      } catch (err: any) {
        console.error('Samsung TV play error:', err)
        setError(`Unable to play video: ${err.message || 'Unknown error'}. Please ensure video is MP4 format with H.264 codec.`)
        setAutoplayFailed(true)
      }
      return
    }

    // Standard browser handling
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
          muted={isSamsungTV ? false : !hasUserInteracted}
          loop
          preload={isSamsungTV ? "metadata" : "auto"}
        >
          Your browser does not support the video tag.
          {isSamsungTV && (
            <p>Please use MP4 format with H.264 video codec and AAC audio codec.</p>
          )}
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
              <div className="text-center px-4 max-w-md">
                <p className="text-white text-lg font-semibold mb-2">{error}</p>
                {isSamsungTV && (
                  <p className="text-white/80 text-sm mb-3">
                    Samsung TV requires MP4 format with H.264 (video) and AAC (audio) codecs.
                  </p>
                )}
                <button
                  onClick={handleRetry}
                  className="text-pink-300 hover:text-pink-200 underline text-sm"
                >
                  Retry
                </button>
              </div>
            )}
            
            {!error && (
              <div className="text-center px-4">
                <p className="text-white/90 text-lg font-medium mb-2">
                  {isSamsungTV ? 'Press OK/Select on your remote to play' : 'Click to play the reveal video'}
                </p>
                {isSamsungTV && !videoCanPlay && (
                  <p className="text-white/70 text-sm">
                    Loading video...
                  </p>
                )}
              </div>
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


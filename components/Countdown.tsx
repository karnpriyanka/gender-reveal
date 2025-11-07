'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface CountdownProps {
  initialSeconds?: number
  onComplete?: () => void
  countdownAudioSrc?: string
}

export default function Countdown({ initialSeconds = 30, onComplete, countdownAudioSrc }: CountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  const secondsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sparkleRefs = useRef<HTMLDivElement[]>([])
  const countdownAudioRef = useRef<HTMLAudioElement>(null)
  const audioReadyRef = useRef(false)

  // Setup audio element and prepare for playback
  useEffect(() => {
    if (!countdownAudioSrc) return

    let cleanup: (() => void) | null = null

    // Wait a bit for the audio element to be rendered
    const setupAudio = () => {
      if (!countdownAudioRef.current) {
        // Retry after a short delay if element isn't ready
        setTimeout(setupAudio, 50)
        return
      }

      const audio = countdownAudioRef.current
    
      // Prepare audio settings
      audio.volume = 1.0
      audio.preload = 'auto'

      const handleCanPlay = () => {
        console.log('Countdown audio ready to play')
        audioReadyRef.current = true
      }

      const handleLoadedData = () => {
        console.log('Countdown audio data loaded')
      }

      const handleError = (e: Event) => {
        console.error('Countdown audio error:', e)
        const error = audio.error
        if (error) {
          console.error('Audio error details:', {
            code: error.code,
            message: error.message
          })
        }
      }

      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('loadeddata', handleLoadedData)
      audio.addEventListener('error', handleError)

      // Store cleanup function
      cleanup = () => {
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('loadeddata', handleLoadedData)
        audio.removeEventListener('error', handleError)
      }

      // Try to load the audio
      try {
        audio.load()
      } catch (err) {
        console.warn('Failed to load countdown audio:', err)
      }
    }

    setupAudio()

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [countdownAudioSrc])

  useEffect(() => {
    // Create sparkle elements
    const sparkles = Array.from({ length: 20 }, (_, i) => {
      const sparkle = document.createElement('div')
      sparkle.className = 'absolute w-2 h-2 bg-yellow-300 rounded-full opacity-0'
      sparkle.style.left = `${Math.random() * 100}%`
      sparkle.style.top = `${Math.random() * 100}%`
      containerRef.current?.appendChild(sparkle)
      return sparkle
    })
    sparkleRefs.current = sparkles

    return () => {
      sparkles.forEach(sparkle => sparkle.remove())
    }
  }, [])

  useEffect(() => {
    if (!isActive || seconds <= 0) {
      if (seconds === 0 && onComplete) {
        onComplete()
      }
      return
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, seconds, onComplete])

  const startCountdown = useCallback(() => {
    if (hasStarted) return
    
    setHasStarted(true)
    setIsActive(true)
    setSeconds(initialSeconds)

    // Play countdown audio if provided
    // Since countdown starts on user scroll (user interaction), audio should play
    const playCountdownAudio = () => {
      if (!countdownAudioRef.current || !countdownAudioSrc) {
        console.log('No countdown audio available')
        return
      }

      const audio = countdownAudioRef.current
      console.log('Attempting to play countdown audio...')
      console.log('Audio ready state:', audio.readyState)
      console.log('Audio src:', audio.src)

      // Reset audio to start from beginning
      audio.currentTime = 0
      audio.volume = 1.0

      // Try to play the audio
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Countdown audio playing successfully')
          })
          .catch((error) => {
            console.error('Countdown audio play failed:', error)
            // Retry after ensuring audio is loaded
            if (audio.readyState < 2) {
              audio.load()
              audio.addEventListener('canplay', () => {
                audio.play().catch((err) => {
                  console.error('Countdown audio retry failed:', err)
                })
              }, { once: true })
            } else {
              // Audio is loaded, retry play
              setTimeout(() => {
                audio.play().catch((err) => {
                  console.error('Countdown audio second retry failed:', err)
                })
              }, 200)
            }
          })
      }
    }

    // Small delay to ensure audio element is ready
    setTimeout(playCountdownAudio, 50)

    // Animate container entrance
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        duration: 1,
        ease: 'back.out(1.7)',
      })
    }

    // Animate number card entrance
    if (secondsRef.current) {
      gsap.from(secondsRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    // Animate sparkles
    sparkleRefs.current.forEach((sparkle, index) => {
      gsap.to(sparkle, {
        opacity: [0, 1, 0] as any,
        scale: [0, 1.5, 0] as any,
        duration: 2,
        delay: index * 0.1,
        repeat: -1,
        ease: 'power2.inOut',
      })
      
      gsap.to(sparkle, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }, [hasStarted, initialSeconds, countdownAudioSrc])

  // Animate number changes
  useEffect(() => {
    if (!isActive || !hasStarted) return

    if (secondsRef.current) {
      gsap.to(secondsRef.current.querySelector('.number'), {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      })
    }
  }, [seconds, isActive, hasStarted])

  // Expose start function globally for invisible trigger
  useEffect(() => {
    // Make sure the function is always available
    if (typeof window !== 'undefined') {
      (window as any).startCountdown = startCountdown
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).startCountdown
      }
    }
  }, [startCountdown])

  return (
    <>
      {/* Hidden countdown audio element - always rendered if src provided */}
      {countdownAudioSrc && (
        <audio
          ref={countdownAudioRef}
          src={countdownAudioSrc}
          preload="auto"
          style={{ display: 'none' }}
        />
      )}

      {!hasStarted ? null : (
        <div ref={containerRef} className="relative py-12 px-4">
      <div className="flex justify-center">
        <div ref={secondsRef} className="relative">
          <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-2xl p-8 shadow-2xl transform transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-12 text-center min-w-[200px]">
              <div className="number text-8xl md:text-9xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                {String(seconds).padStart(2, '0')}
              </div>
              <div className="text-xl md:text-2xl font-semibold text-gray-600 mt-4 uppercase tracking-wider">
                Seconds
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-50 -z-10 animate-pulse-slow"></div>
        </div>
      </div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }
      `}</style>
        </div>
      )}
    </>
  )
}

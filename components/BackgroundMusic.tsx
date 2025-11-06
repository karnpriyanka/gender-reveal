'use client'

import { useEffect, useRef } from 'react'

interface BackgroundMusicProps {
  src?: string
  volume?: number
  autoplay?: boolean
}

export default function BackgroundMusic({ 
  src = '/music/background.mp3',
  volume = 0.2,
  autoplay = true
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.loop = true
      
      // Try to autoplay when user interacts with page
      const tryPlay = () => {
        if (audioRef.current && autoplay) {
          audioRef.current.play().catch((error) => {
            // Autoplay was blocked - this is normal, browser requires user interaction
            console.log('Autoplay blocked, music will start on user interaction')
          })
        }
      }

      // Try to play after a short delay (allows page to load)
      const timeout = setTimeout(tryPlay, 1000)

      // Also try on any user interaction
      const events = ['click', 'touchstart', 'keydown', 'scroll']
      events.forEach(event => {
        document.addEventListener(event, tryPlay, { once: true })
      })

      return () => {
        clearTimeout(timeout)
        events.forEach(event => {
          document.removeEventListener(event, tryPlay)
        })
      }
    }
  }, [volume, autoplay])

  // Hidden audio element - no UI controls
  return (
    <audio 
      ref={audioRef} 
      src={src} 
      preload="auto"
      style={{ display: 'none' }}
    />
  )
}


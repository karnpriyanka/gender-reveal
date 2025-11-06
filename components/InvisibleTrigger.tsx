'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function InvisibleTrigger() {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerRef.current) return

    // Wait a bit to ensure ScrollTrigger is ready
    const initTrigger = () => {
      // Create invisible trigger zone - positioned right before countdown section
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top 90%', // Trigger when element reaches 90% from top of viewport
        once: true, // Only trigger once
        onEnter: () => {
          console.log('Trigger activated! Starting countdown...')
          // Small delay to ensure countdown component is ready
          setTimeout(() => {
            if ((window as any).startCountdown) {
              (window as any).startCountdown()
              console.log('Countdown started!')
            } else {
              console.error('startCountdown function not found!')
            }
          }, 100)
        },
        onEnterBack: () => {
          // Also trigger when scrolling back up
          if ((window as any).startCountdown) {
            (window as any).startCountdown()
          }
        },
      })

      return () => {
        trigger.kill()
      }
    }

    // Small delay to ensure everything is loaded
    const timeout = setTimeout(initTrigger, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      ref={triggerRef}
      className="w-full h-20 opacity-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}


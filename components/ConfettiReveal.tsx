'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiRevealProps {
  color: 'pink' | 'blue' | 'surprise'
  trigger: boolean
  duration?: number
}

export default function ConfettiReveal({ color, trigger, duration = 5000 }: ConfettiRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return

    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 30 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 50 * (timeLeft / duration)

      if (color === 'pink') {
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
        })
      } else if (color === 'blue') {
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#4169E1', '#0000FF', '#87CEEB', '#00BFFF'],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#4169E1', '#0000FF', '#87CEEB', '#00BFFF'],
        })
      } else {
        // Surprise - mix of both
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#FF1493', '#4169E1', '#0000FF'],
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FF69B4', '#FF1493', '#4169E1', '#0000FF'],
        })
      }
    }, 250)

    // Burst effect
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 30,
        colors: color === 'pink' 
          ? ['#FF69B4', '#FF1493', '#FFB6C1'] 
          : color === 'blue'
          ? ['#4169E1', '#0000FF', '#87CEEB']
          : ['#FF69B4', '#FF1493', '#4169E1', '#0000FF'],
      })
    }, 100)

    return () => clearInterval(interval)
  }, [trigger, color, duration])

  if (!trigger) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[30]" />
}


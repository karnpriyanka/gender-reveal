'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

interface HeroSectionProps {
  images: string[]
}

export default function HeroSection({ images }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current) return

    // Ensure text starts with full opacity
    gsap.set([titleRef.current, subtitleRef.current], { opacity: 1 })

    // Animate hero entrance (only position, not opacity)
    gsap.from(titleRef.current, {
      y: 50,
      duration: 1,
      ease: 'power3.out',
    })

    gsap.from(subtitleRef.current, {
      y: 30,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    })

    // Floating animation for images
    gsap.to(heroRef.current.querySelectorAll('.hero-image'), {
      y: -20,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
    })
  }, [])

  // Auto-rotate images
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.length > 0 ? (
          images.map((src, index) => (
            <div
              key={index}
              className={`hero-image absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-2xl opacity-100"
        >
          <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-blue-500 bg-clip-text text-transparent" style={{ 
            textShadow: '0 0 20px rgba(236, 72, 153, 0.6), 0 0 30px rgba(59, 130, 246, 0.6), 0 2px 4px rgba(0, 0, 0, 0.5)',
            filter: 'brightness(1.1) saturate(1.2)'
          }}>
            Boy Or Girl?
          </span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white font-light tracking-wide opacity-100 drop-shadow-lg"
        >
          A Special Moment We&apos;ll Never Forget
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}


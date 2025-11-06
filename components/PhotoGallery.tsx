'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface PhotoGalleryProps {
  images: string[]
  title?: string
}

export default function PhotoGallery({ images, title = "Our Journey Together" }: PhotoGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(`PhotoGallery: Rendering ${images.length} images for "${title}"`)
    console.log('Images:', images)
  }, [images, title])

  useEffect(() => {
    if (!galleryRef.current) return

    const cards = galleryRef.current.querySelectorAll('.gallery-card')
    console.log(`PhotoGallery: Found ${cards.length} gallery cards`)
    
    // Ensure all cards start with full opacity
    gsap.set(cards, { opacity: 1 })
    
    // Animate only position, not opacity
    gsap.from(cards, {
      scrollTrigger: {
        trigger: galleryRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, [images])

  if (images.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 text-lg">
          Add your photos to <code className="bg-gray-100 px-2 py-1 rounded">public/images/couple/</code>
        </p>
      </div>
    )
  }

  return (
    <div ref={galleryRef} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="gallery-card relative group overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 opacity-100"
            >
              <div className="aspect-square relative">
                <Image
                  src={src}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


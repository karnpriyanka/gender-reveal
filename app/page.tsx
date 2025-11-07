'use client'

import HeroSection from '@/components/HeroSection'
import Countdown from '@/components/Countdown'
import InvisibleTrigger from '@/components/InvisibleTrigger'
import PhotoGallery from '@/components/PhotoGallery'
import ConfettiReveal from '@/components/ConfettiReveal'
import BackgroundMusic from '@/components/BackgroundMusic'
import VideoPlayer from '@/components/VideoPlayer'
import { useEffect, useState } from 'react'
import { getImagesFromFolder } from '@/lib/images'

export default function Home() {
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [coupleImages, setCoupleImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  
  // Video source - place your video in public/video/reveal.mp4
  const videoSrc = '/video/reveal.mp4'

  useEffect(() => {
    // Automatically load all images from folders
    const loadImages = async () => {
      setIsLoading(true)
      try {
        const [hero, couple] = await Promise.all([
          getImagesFromFolder('hero'),
          getImagesFromFolder('couple'),
        ])
        
        setHeroImages(hero)
        setCoupleImages(couple)
        console.log('Loaded hero images:', hero.length)
        console.log('Loaded couple images:', couple.length, couple)
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  const handleCountdownComplete = () => {
    setShowConfetti(true)
    setShowVideo(true)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
          <p className="text-xl text-gray-600">Loading your beautiful memories...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <HeroSection images={heroImages} />
      
      <section className="py-20 px-4 relative z-[9998] isolate">
        {/* Invisible trigger positioned right before countdown */}
        {!showVideo && <InvisibleTrigger />}
        
        <div className="max-w-6xl mx-auto text-center relative z-[9999]">
          {!showVideo ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                The Countdown Begins
              </h2>
              <Countdown 
                initialSeconds={10}
                onComplete={handleCountdownComplete}
                countdownAudioSrc="/music/countdown-10-to-0.wav"
              />
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent animate-fade-in">
                🎉 The Big Reveal! 🎉
              </h2>
              <VideoPlayer src={videoSrc} autoplay={true} showVideo={showVideo} />
            </>
          )}
        </div>
      </section>

      {coupleImages.length > 0 && (
        <PhotoGallery images={coupleImages} title="Our Beautiful Moments" />
      )}

      {showConfetti && (
        <ConfettiReveal color="surprise" trigger={showConfetti} />
      )}

      {/* Background Music Component */}
      <BackgroundMusic src="/music/sitar-in-the-temple-of-rats-430832.mp3" volume={0.3} />

      <footer className="py-12 text-center text-gray-600">
        <p className="text-lg">Made with ❤️ for our special moment</p>
      </footer>
    </main>
  )
}


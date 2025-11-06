# How It Works - Gender Reveal Website

## 🎯 Invisible Trigger Mechanism

The countdown timer starts automatically when users scroll down the page. Here's how it works:

1. **Invisible Element**: An invisible div is positioned at 60% viewport height
2. **Scroll Detection**: GSAP ScrollTrigger watches for when this element enters the viewport
3. **Auto-Start**: When detected, it calls `startCountdown()` function
4. **One-Time Trigger**: The trigger only fires once (using `once: true`)

**Location**: `components/InvisibleTrigger.tsx`

**Customization**:
- Change trigger position: Modify `top: '60vh'` in `InvisibleTrigger.tsx`
- Change scroll threshold: Modify `start: 'top 80%'` in ScrollTrigger config

## ⏱️ Countdown Features

The countdown timer includes:

- **Animated Entrance**: Cards fly in with elastic bounce effect
- **Sparkle Effects**: 20 animated sparkles around the countdown
- **Number Animations**: Numbers pulse when they change
- **Gradient Cards**: Beautiful pink-to-blue gradient cards
- **Glow Effects**: Pulsing glow behind each card
- **Floating Particles**: Background particles that float around

**Location**: `components/Countdown.tsx`

**Customization**:
- Change colors: Edit gradient classes in `TimeCard` component
- Adjust animation speed: Modify GSAP duration values
- Change sparkle count: Modify `Array.from({ length: 20 })`

## 📸 Photo Gallery

- **Auto-Load**: Images load from `lib/images.ts` configuration
- **Smooth Animations**: Cards fade in with stagger effect on scroll
- **Hover Effects**: Images scale and show overlay on hover
- **Responsive Grid**: Adapts from 1 to 3 columns based on screen size

**Location**: `components/PhotoGallery.tsx`

## 🎉 Confetti Reveal

- **Color Options**: Pink, Blue, or Surprise (mixed)
- **Burst Effect**: Large confetti burst on reveal
- **Continuous Stream**: Confetti streams for 5 seconds
- **Multiple Origins**: Confetti launches from multiple points

**Location**: `components/ConfettiReveal.tsx`

**Trigger**: Automatically fires when countdown reaches zero

## 🎨 Hero Section

- **Image Carousel**: Auto-rotates through hero images every 5 seconds
- **Floating Animation**: Images gently float up and down
- **Gradient Overlay**: Dark overlay for text readability
- **Scroll Indicator**: Animated scroll indicator at bottom

**Location**: `components/HeroSection.tsx`

## 📁 File Structure

```
gender-reveal/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Countdown.tsx     # Countdown timer
│   ├── InvisibleTrigger.tsx  # Scroll trigger
│   ├── HeroSection.tsx   # Hero section
│   ├── PhotoGallery.tsx  # Photo gallery
│   └── ConfettiReveal.tsx # Confetti effects
├── lib/
│   └── images.ts         # Image path configuration
└── public/
    └── images/
        ├── hero/         # Hero images
        ├── gallery/      # Gallery images
        └── couple/       # Couple photos
```

## 🚀 Next Steps

1. **Add Images**: Place photos in `public/images/` folders
2. **Update Paths**: Edit `lib/images.ts` with your image filenames
3. **Set Date**: Update `targetDate` in `app/page.tsx`
4. **Customize Colors**: Adjust Tailwind classes for your theme
5. **Test**: Run `npm run dev` and test the scroll trigger

## 💡 Pro Tips

- **Test the Trigger**: Scroll slowly to see when countdown activates
- **Image Optimization**: Compress images for faster loading
- **Mobile Testing**: Test on mobile devices for responsive design
- **Confetti Timing**: Adjust confetti duration in `ConfettiReveal.tsx`
- **Animation Speed**: Modify GSAP durations for faster/slower animations


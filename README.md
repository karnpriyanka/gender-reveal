# Gender Reveal Website

A beautiful, animated gender reveal website built with Next.js, GSAP, and Tailwind CSS.

## Features

- ✨ **Animated Hero Section** - Beautiful hero with photo carousel
- ⏱️ **Interactive Countdown** - GSAP-powered countdown timer with sparkle effects
- 🎯 **Invisible Trigger** - Countdown starts automatically when scrolling to a specific point
- 📸 **Photo Gallery** - Showcase your personal photos
- 🎉 **Confetti Reveal** - Celebrate the moment with confetti effects
- 🎵 **Background Music** - Play beautiful music with elegant controls
- 📱 **Fully Responsive** - Works beautifully on all devices

## Getting Started

### Installation

```bash
npm install
```

### Add Your Images

**Simply paste your images into the folders - no coding required!**

1. **Hero Images**: Add photos to `public/images/hero/`
   - Recommended: 2-3 high-quality couple photos
   - Formats: JPG, JPEG, PNG, WebP, GIF, BMP, SVG
   - **All images in this folder will be automatically detected and displayed**

2. **Gallery Images**: Add photos to `public/images/gallery/`
   - Add as many photos as you want
   - They'll be displayed in a beautiful grid
   - **All images in this folder will be automatically detected and displayed**

3. **Couple Photos** (Optional): Add photos to `public/images/couple/`
   - Special couple photos for specific sections
   - **All images in this folder will be automatically detected**

**That's it!** The website automatically reads all images from these folders - no need to edit any code or specify filenames.

### Add Background Music

1. **Download free music** from open-source music libraries (see `public/music/README.md` for resources)
2. **Place your music file** in `public/music/background.mp3`
   - Supported formats: MP3, OGG, WAV, M4A
   - Recommended: MP3 format for best compatibility
3. **Music controls** will appear in the bottom-right corner automatically

**Popular free music sources:**
- Free Music Archive (freemusicarchive.org)
- Incompetech (incompetech.com)
- Pixabay Music (pixabay.com/music)
- YouTube Audio Library

### Configure Countdown Date

Edit `app/page.tsx` and set your target date:
```typescript
const targetDate = new Date('2024-12-31T00:00:00')
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How the Invisible Trigger Works

The countdown starts automatically when users scroll down to 60% of the viewport height. The trigger is completely invisible and uses GSAP ScrollTrigger to detect when it enters the viewport.

## Customization

- **Colors**: Edit Tailwind classes in components to change color scheme
- **Confetti Colors**: Modify `components/ConfettiReveal.tsx` to change confetti colors
- **Animation Speed**: Adjust GSAP animation durations in component files
- **Countdown Style**: Customize `components/Countdown.tsx` for different countdown designs

## Build for Production

```bash
npm run build
npm start
```

## Deploy

Deploy easily to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):

```bash
# Vercel
vercel

# Netlify
netlify deploy
```

## Image Optimization Tips

- Compress images before adding (use tools like TinyPNG)
- Keep file sizes under 500KB for faster loading
- Recommended resolution: 1920x1080px or smaller
- Use WebP format for best performance

## License

Personal use only - Enjoy your special moment! 🎉


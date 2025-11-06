# Background Music Setup

## Quick Start

1. **Add your music file** to `public/music/background.mp3`
   - Supported formats: MP3, OGG, WAV, M4A
   - Recommended: MP3 format for best compatibility

2. **The music will automatically be available** with play/pause controls in the bottom-right corner

## Open Source Music Resources

Here are some great places to find free, open-source music:

### 1. **Free Music Archive** (https://freemusicarchive.org/)
   - Large collection of free music
   - Various genres available
   - CC0 (public domain) and Creative Commons licenses
   - Search for "romantic", "celebration", "happy", etc.

### 2. **Incompetech** (https://incompetech.com/music/royalty-free/)
   - Royalty-free music by Kevin MacLeod
   - Many genres: romantic, happy, emotional
   - Free with attribution
   - Great for celebrations and special moments

### 3. **Bensound** (https://www.bensound.com/)
   - Free music with attribution
   - Categories: romantic, emotional, happy
   - Good quality tracks

### 4. **YouTube Audio Library** (https://studio.youtube.com/channel/UC.../music)
   - Free music library
   - No attribution required for most tracks
   - Various moods and genres

### 5. **Pixabay Music** (https://pixabay.com/music/)
   - Free music tracks
   - No attribution required
   - Search for "romantic", "celebration", "love"

### 6. **Freesound** (https://freesound.org/)
   - Free sound effects and music
   - Creative Commons licenses
   - Great for ambient sounds

## Recommended Search Terms

When searching for music, try these terms:
- "romantic"
- "celebration"
- "happy"
- "emotional"
- "love"
- "wedding"
- "special moment"
- "gentle"
- "peaceful"

## Music File Setup

1. Download your chosen music file
2. Convert to MP3 if needed (use online converters or Audacity)
3. Place in `public/music/background.mp3`
4. Or update the path in `app/page.tsx`:
   ```tsx
   <BackgroundMusic src="/music/your-file.mp3" volume={0.3} />
   ```

## Customization

### Change Music File
Edit `app/page.tsx`:
```tsx
<BackgroundMusic src="/music/your-music.mp3" volume={0.3} />
```

### Adjust Default Volume
Change the `volume` prop (0.0 to 1.0):
```tsx
<BackgroundMusic src="/music/background.mp3" volume={0.5} />
```

### Multiple Music Files
You can add multiple music files and switch between them:
```tsx
const [musicSrc, setMusicSrc] = useState('/music/background.mp3')
<BackgroundMusic src={musicSrc} volume={0.3} />
```

## Features

- ✅ **Play/Pause Control** - Beautiful floating button
- ✅ **Volume Control** - Adjustable volume slider
- ✅ **Mute Toggle** - Quick mute/unmute
- ✅ **Auto-hide Controls** - Controls hide after 5 seconds
- ✅ **Loop Playback** - Music loops automatically
- ✅ **Smooth Animations** - GSAP-powered entrance animation
- ✅ **Mobile Friendly** - Works great on all devices

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers supported
- Autoplay requires user interaction (browser policy)

## License Notes

**Important**: Make sure the music you use is:
- Free to use for personal projects
- Properly licensed (CC0, Creative Commons, or royalty-free)
- Attributed if required by the license

For personal family websites, most free music libraries allow use without issues, but always check the license!


# Video Setup Instructions

## Quick Start

1. **Add your reveal video** to `public/video/reveal.mp4`
   - Supported formats: MP4, WebM, OGG
   - Recommended: MP4 format (H.264 codec) for best compatibility
   - Default filename: `reveal.mp4`

2. **The video will automatically play** when the countdown reaches zero!

## How It Works

1. **Countdown starts** at 30 seconds when you scroll to the trigger point
2. **Counts down** from 30 → 29 → 28 → ... → 1 → 0
3. **When it reaches zero**:
   - Confetti celebration starts
   - Video automatically plays
   - Beautiful reveal moment!

## Video Requirements

- **Format**: MP4 (recommended), WebM, or OGG
- **Codec**: H.264 for MP4 (best compatibility)
- **Size**: Keep under 50MB for faster loading
- **Resolution**: 1920x1080px or smaller
- **Duration**: Any length (your reveal video)

## Customization

### Change Video File
Edit `app/page.tsx`:
```tsx
const videoSrc = '/video/your-video.mp4'
```

### Change Countdown Duration
Edit `app/page.tsx`:
```tsx
<Countdown initialSeconds={60} /> // 60 seconds instead of 30
```

### Video Player Features

- ✅ **Auto-play** when countdown reaches zero
- ✅ **Custom controls** - Show/hide video controls
- ✅ **Smooth animations** - GSAP-powered entrance
- ✅ **Responsive** - Works on all devices
- ✅ **Fullscreen support** - Native browser controls

## Video Optimization Tips

1. **Compress your video**:
   - Use HandBrake or similar tools
   - Target: Under 50MB for web
   - Resolution: 1080p is usually enough

2. **Format conversion**:
   - Use VLC or FFmpeg to convert to MP4
   - Ensure H.264 codec for compatibility

3. **Test before reveal**:
   - Make sure video plays in browser
   - Check on mobile devices
   - Verify audio works (if included)

## Troubleshooting

- **Video not playing?**
  - Check file path: `public/video/reveal.mp4`
  - Verify file format (MP4 recommended)
  - Check browser console for errors

- **Video not auto-playing?**
  - Browsers block autoplay with sound
  - Video will play but may be muted initially
  - User can click play button

- **Video too large?**
  - Compress using HandBrake
  - Reduce resolution or bitrate
  - Consider using WebM format (smaller)

## Example Video Sources

You can use:
- Your own recorded video
- Edited reveal video
- Any MP4 video file

Just place it in `public/video/reveal.mp4` and it will work!


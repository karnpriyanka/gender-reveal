# Samsung TV Browser Video Playback Fixes

## Overview

Samsung TVs use Tizen OS with a WebKit-based browser that has specific limitations and requirements for video playback. This document outlines the fixes implemented to ensure video playback works on Samsung TV browsers.

## Common Issues on Samsung TV Browsers

### 1. **Codec Support Limitations**
- **Problem**: Samsung TVs only support specific video codecs
- **Solution**: Use MP4 format with H.264 video codec and AAC audio codec
- **Unsupported**: WebM, OGG, VP9, VP8 formats

### 2. **Autoplay Restrictions**
- **Problem**: Autoplay is completely blocked on Samsung TVs
- **Solution**: Always show play button, require user interaction (remote control OK/Select button)

### 3. **Preload Behavior**
- **Problem**: `preload="auto"` can cause issues
- **Solution**: Use `preload="metadata"` on Samsung TVs

### 4. **Video Loading Requirements**
- **Problem**: Video must be fully loaded before `play()` can be called
- **Solution**: Wait for `canplaythrough` event and check `readyState >= 3`

### 5. **GSAP Animation Issues**
- **Problem**: GSAP animations may not work reliably
- **Solution**: Skip GSAP animations on Samsung TVs, use CSS instead

### 6. **Event Listener Limitations**
- **Problem**: Some event listeners may not fire correctly
- **Solution**: Use multiple event listeners (`loadeddata`, `canplaythrough`, `error`)

## Implemented Fixes

### 1. Samsung TV Detection
```typescript
// Automatically detects Samsung TV via user agent
const tvInfo = detectSamsungTV()
```

### 2. Video Format Validation
- Checks codec support using `canPlayType()`
- Shows specific error messages for unsupported formats
- Recommends MP4 (H.264 + AAC) format

### 3. Preload Strategy
- **Samsung TV**: `preload="metadata"` (loads only metadata)
- **Other browsers**: `preload="auto"` (loads entire video)

### 4. Play Button Display
- Always shows play button on Samsung TV (autoplay will fail)
- Instructions: "Press OK/Select on your remote to play"

### 5. Video Loading Handler
- Waits for `canplaythrough` event
- Checks `readyState >= 3` before attempting playback
- 10-second timeout for video loading
- Force reload if video isn't ready

### 6. Error Handling
- Specific error messages for Samsung TV
- Codec-specific error detection
- Network error handling
- Retry functionality

## Video Requirements for Samsung TV

### Required Format
- **Container**: MP4
- **Video Codec**: H.264 (AVC)
- **Audio Codec**: AAC
- **Profile**: Baseline or Main profile recommended

### Recommended Settings
- **Resolution**: 1920x1080 or lower
- **File Size**: Under 100MB for best performance
- **Bitrate**: 5-10 Mbps for 1080p

### How to Convert Your Video

#### Using FFmpeg:
```bash
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -b:a 128k -movflags +faststart output.mp4
```

#### Using HandBrake:
1. Open HandBrake
2. Load your video
3. Select "Fast 1080p30" preset
4. Under Video tab:
   - Codec: H.264 (x264)
   - Profile: Baseline or Main
5. Under Audio tab:
   - Codec: AAC
   - Bitrate: 128 kbps
6. Save as MP4

#### Using Online Tools:
- CloudConvert (cloudconvert.com)
- FreeConvert (freeconvert.com)
- Select MP4 → H.264 + AAC

## Testing on Samsung TV

### 1. Enable Developer Mode
1. Open Smart Hub
2. Press 1-2-3-4-5 on remote
3. Enable Developer Mode
4. Note your TV's IP address

### 2. Deploy Your Site
- Deploy to a publicly accessible URL (not localhost)
- Use HTTPS (required for video playback)

### 3. Test Checklist
- [ ] Video loads without errors
- [ ] Play button appears (autoplay blocked)
- [ ] Video plays when OK/Select is pressed
- [ ] Video loops correctly
- [ ] Audio plays (if included)
- [ ] Controls work with remote
- [ ] No codec errors in console

## Debugging

### Console Logs
The implementation includes detailed console logs:
- `Samsung TV detected: {info}`
- `Samsung TV: Video data loaded`
- `Samsung TV: Video can play through`
- `Samsung TV MP4 codec support: {support}`
- `Samsung TV: Video playing successfully`
- Error logs with specific error codes

### Common Error Codes
- `MEDIA_ERR_ABORTED` (1): Playback aborted
- `MEDIA_ERR_NETWORK` (2): Network error
- `MEDIA_ERR_DECODE` (3): Codec/format error
- `MEDIA_ERR_SRC_NOT_SUPPORTED` (4): Format not supported

### Network Issues
- Ensure video is served over HTTPS
- Check CORS headers if video is on different domain
- Verify video file is accessible
- Check file size (too large may cause issues)

## Best Practices

1. **Always test on actual Samsung TV** - Emulators may not reflect real behavior
2. **Use correct codec** - H.264 + AAC is mandatory
3. **Optimize video size** - Keep under 100MB
4. **Provide clear instructions** - Users need to press OK/Select
5. **Handle errors gracefully** - Show user-friendly messages
6. **Test remote control** - Ensure all controls work

## Additional Resources

- [Samsung Developer Documentation](https://developer.samsung.com/tv)
- [Tizen TV Web App Best Practices](https://developer.tizen.org/development/guides/web-application)
- [HTML5 Video Codec Support](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)

## Troubleshooting Checklist

If video still doesn't play on Samsung TV:

1. ✅ Verify video format is MP4 with H.264 + AAC
2. ✅ Check video file is accessible (not 404)
3. ✅ Ensure site is served over HTTPS
4. ✅ Check browser console for errors
5. ✅ Verify video file size is reasonable (<100MB)
6. ✅ Test video in native TV video player first
7. ✅ Check network connection (wired recommended)
8. ✅ Try different video file (rule out file corruption)
9. ✅ Update TV firmware to latest version
10. ✅ Clear browser cache on TV


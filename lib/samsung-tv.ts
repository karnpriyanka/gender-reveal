/**
 * Samsung TV Browser Detection and Utilities
 * Samsung TVs use Tizen OS with a WebKit-based browser
 */

export interface SamsungTVInfo {
  isSamsungTV: boolean
  isTizen: boolean
  userAgent: string
  version?: string
}

/**
 * Detect if running on Samsung TV browser
 */
export function detectSamsungTV(): SamsungTVInfo {
  if (typeof window === 'undefined') {
    return { isSamsungTV: false, isTizen: false, userAgent: '' }
  }

  const userAgent = navigator.userAgent || ''
  const isTizen = /Tizen/i.test(userAgent)
  const isSamsungTV = /SMART-TV|Samsung/i.test(userAgent) || isTizen

  // Extract version if available
  const versionMatch = userAgent.match(/Tizen\/(\d+\.\d+)/i)
  const version = versionMatch ? versionMatch[1] : undefined

  return {
    isSamsungTV,
    isTizen,
    userAgent,
    version,
  }
}

/**
 * Get Samsung TV specific video recommendations
 */
export function getSamsungTVVideoRecommendations(): string[] {
  const recommendations = [
    'Use MP4 format with H.264 video codec and AAC audio codec',
    'Avoid WebM or OGG formats - not supported',
    'Keep video file size under 100MB for best performance',
    'Resolution: 1920x1080 or lower recommended',
    'Autoplay will not work - user must click play button',
    'Video must be fully loaded before play() can be called',
  ]
  return recommendations
}

/**
 * Check if video codec is likely supported on Samsung TV
 */
export function isCodecSupported(mimeType: string): boolean {
  // Samsung TVs typically only support:
  // - video/mp4; codecs="avc1.42E01E, mp4a.40.2" (H.264 + AAC)
  // - video/mp4; codecs="avc1.4D401E, mp4a.40.2" (H.264 Baseline + AAC)
  
  const supportedPatterns = [
    /video\/mp4/i,
    /avc1/i, // H.264
    /mp4a/i, // AAC
  ]

  return supportedPatterns.some(pattern => pattern.test(mimeType))
}


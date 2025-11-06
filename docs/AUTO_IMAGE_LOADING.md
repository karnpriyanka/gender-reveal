# Automatic Image Loading Feature

## Overview

The website now automatically detects and loads all images from the `public/images/` folders without requiring any code changes or filename specifications.

## How It Works

1. **API Route** (`app/api/images/route.ts`):
   - Reads the filesystem to scan image folders
   - Filters files by image extensions
   - Returns sorted list of image paths

2. **Image Utility** (`lib/images.ts`):
   - Provides async functions to fetch images from folders
   - Handles errors gracefully
   - Returns empty arrays if folders don't exist or contain no images

3. **Page Component** (`app/page.tsx`):
   - Automatically loads images on page load
   - Shows loading state while fetching
   - Displays images once loaded

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`
- `.bmp`
- `.svg`

## Features

- ✅ **Zero Configuration**: Just paste images into folders
- ✅ **Automatic Detection**: All images are found automatically
- ✅ **Alphabetical Sorting**: Images are sorted for consistent display
- ✅ **Error Handling**: Gracefully handles missing folders or files
- ✅ **Multiple Formats**: Supports all common image formats
- ✅ **Hidden File Filtering**: Automatically skips hidden files and `.gitkeep`

## Usage

Simply add images to:
- `public/images/hero/` - For hero section
- `public/images/gallery/` - For photo gallery
- `public/images/couple/` - For couple photos

The website will automatically detect and display them!

## API Endpoint

The API endpoint `/api/images?folder=<folder>` can be used directly:

```typescript
// Example: Fetch hero images
const response = await fetch('/api/images?folder=hero')
const data = await response.json()
console.log(data.images) // Array of image paths
```

## Troubleshooting

- **No images showing?** Check that:
  1. Images are in the correct folder (`public/images/<folder>/`)
  2. Images have valid extensions (jpg, png, etc.)
  3. Server is running (`npm run dev`)
  4. Check browser console for errors

- **Images not updating?** 
  - Restart the development server
  - Clear browser cache
  - Check that images are actually in the folders


import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg']

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const folder = searchParams.get('folder')

  // Validate folder name
  const validFolders = ['hero', 'couple']
  if (!folder || !validFolders.includes(folder)) {
    return NextResponse.json(
      { message: 'Invalid folder. Must be one of: hero, couple', images: [] },
      { status: 400 }
    )
  }

  try {
    const folderPath = path.join(process.cwd(), 'public', 'images', folder)
    
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return NextResponse.json({ images: [] })
    }

    // Read directory contents
    const files = fs.readdirSync(folderPath)

    // Filter for image files and create paths (case-insensitive)
    const images = files
      .filter(file => {
        // Skip hidden files and .gitkeep
        if (file.startsWith('.')) return false
        // Convert extension to lowercase for case-insensitive matching
        const ext = path.extname(file).toLowerCase()
        return IMAGE_EXTENSIONS.includes(ext)
      })
      .map(file => `/images/${folder}/${file}`)
      .sort() // Sort alphabetically for consistent ordering
    
    console.log(`API: Found ${images.length} images in ${folder} folder`)
    console.log(`API: Image paths:`, images)

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json(
      { message: 'Error reading images', images: [] },
      { status: 500 }
    )
  }
}


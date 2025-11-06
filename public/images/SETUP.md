# Image Setup Instructions

## Quick Start - It's That Simple! 🎉

**Just paste your images into the folders - that's all you need to do!**

1. **Add your images** to the folders:
   - `public/images/hero/` - Hero section photos (2-3 recommended)
   - `public/images/gallery/` - Gallery photos (unlimited)
   - `public/images/couple/` - Special couple photos (optional)

2. **That's it!** The website automatically detects and loads all images from these folders.

3. **Set your countdown date** in `app/page.tsx`:
   ```typescript
   const targetDate = new Date('2024-12-31T00:00:00')
   ```

## How It Works

The website uses an automatic image detection system:
- Scans each folder for image files
- Supports multiple formats: JPG, JPEG, PNG, WebP, GIF, BMP, SVG
- Automatically sorts images alphabetically
- No need to edit code or specify filenames
- Works with any number of images

## Image Requirements

- **Formats**: JPG, JPEG, PNG, WebP, GIF, BMP, SVG (all automatically detected)
- **Size**: Recommended under 500KB per image
- **Resolution**: 1920x1080px or smaller
- **Naming**: Any filename works! The system automatically detects all images

## Tips

- Compress images before adding (use TinyPNG or similar)
- Use descriptive filenames for easy management
- Hero images should be high quality and well-lit
- Gallery images can be mixed orientations (portrait/landscape)


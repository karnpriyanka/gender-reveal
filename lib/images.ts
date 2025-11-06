// Utility to automatically load images from folders
// Images are automatically detected from the public/images folders

/**
 * Fetches all images from a specified folder
 * @param folder - The folder name ('hero' or 'couple')
 * @returns Promise<string[]> - Array of image paths
 */
export async function getImagesFromFolder(
  folder: 'hero' | 'couple'
): Promise<string[]> {
  try {
    const response = await fetch(`/api/images?folder=${folder}`)
    if (!response.ok) {
      console.error(`Failed to fetch images from ${folder} folder`)
      return []
    }
    const data = await response.json()
    return data.images || []
  } catch (error) {
    console.error(`Error fetching images from ${folder}:`, error)
    return []
  }
}

/**
 * Fetches all images from multiple folders at once
 * @param folders - Array of folder names
 * @returns Promise<Record<string, string[]>> - Object with folder names as keys and image arrays as values
 */
export async function getAllImages(
  folders: ('hero' | 'couple')[] = ['hero', 'couple']
): Promise<Record<string, string[]>> {
  try {
    const promises = folders.map(async (folder) => {
      const images = await getImagesFromFolder(folder)
      return { folder, images }
    })

    const results = await Promise.all(promises)
    return results.reduce((acc, { folder, images }) => {
      acc[folder] = images
      return acc
    }, {} as Record<string, string[]>)
  } catch (error) {
    console.error('Error fetching all images:', error)
    return {}
  }
}


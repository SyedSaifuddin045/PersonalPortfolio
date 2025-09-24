import { readdir, stat } from 'fs/promises';
import { join, extname, isAbsolute } from 'path';

// Supported image extensions
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * Automatically discovers images in a project folder
 * @param imageFolder - The folder name containing the images
 * @param basePath - Base path where project assets are stored
 * @returns Array of image filenames found in the folder
 */
export async function discoverProjectImages(
  imageFolder: string, 
  basePath: string = 'project_assets'
): Promise<string[]> {
  const root = isAbsolute(basePath) ? basePath : join(process.cwd(), basePath);
  const folderPath = join(root, imageFolder);
  
  try {
    // Check if folder exists
    const folderStat = await stat(folderPath);
    if (!folderStat.isDirectory()) {
      console.warn(`Path ${folderPath} is not a directory`);
      return [];
    }

    // Read all files in the directory
    const files = await readdir(folderPath);
    
    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => {
        const ext = extname(file).toLowerCase();
        return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
      })
      .sort(); // Sort alphabetically for consistent ordering

    return imageFiles;
  } catch (error) {
    console.warn(`Failed to read images from folder ${imageFolder}:`, error);
    return [];
  }
}

/**
 * Discovers images for all projects in the portfolio data
 * @param projects - Array of project objects
 * @param basePath - Base path where project assets are stored
 * @returns Projects array with auto-discovered images
 */
/**
 * Filter images to show only original versions (not optimized variants)
 * @param images - Array of image filenames
 * @returns Filtered array with only original images
 */
function filterOriginalImages(images: string[]): string[] {
  // Simple approach: filter out optimized variants and keep only original images
  const originalImages = images.filter(image => {
    // Skip if it's a sized variant (has _small, _medium, _large, _thumbnail, _xlarge)
    const hasSizeSuffix = /_(?:small|medium|large|thumbnail|xlarge)\./i.test(image);
    if (hasSizeSuffix) return false;
    
    // Skip WebP if PNG/JPG equivalent exists
    if (image.endsWith('.webp')) {
      const pngVersion = image.replace('.webp', '.png');
      const jpgVersion = image.replace('.webp', '.jpg');
      const jpegVersion = image.replace('.webp', '.jpeg');
      
      // If PNG/JPG version exists, skip this WebP
      if (images.includes(pngVersion) || images.includes(jpgVersion) || images.includes(jpegVersion)) {
        return false;
      }
    }
    
    return true; // Keep this image
  });
  
  return originalImages.sort(); // Sort for consistent ordering
}

export async function enrichProjectsWithImages(
  projects: any[],
  basePath: string = 'project_assets'
): Promise<any[]> {
  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      if (project.image_folder) {
        const discoveredImages = await discoverProjectImages(project.image_folder, basePath);
        const filteredImages = filterOriginalImages(discoveredImages);
        return {
          ...project,
          images: filteredImages,
          // Keep all discovered images for reference
          allImages: discoveredImages,
          // Keep original images if they exist
          originalImages: project.images || []
        };
      }
      return project;
    })
  );

  return enrichedProjects;
}

/**
 * Get optimized image paths for different screen sizes
 * @param imagePath - Original image path
 * @returns Object with different sized image paths
 */
export function getOptimizedImagePaths(imagePath: string) {
  const pathParts = imagePath.split('.');
  const ext = pathParts.pop();
  const basePath = pathParts.join('.');
  
  return {
    original: imagePath,
    large: `${basePath}_large.${ext}`,
    medium: `${basePath}_medium.${ext}`,
    small: `${basePath}_small.${ext}`,
    thumbnail: `${basePath}_thumb.${ext}`,
    webp: `${basePath}.webp`,
  };
}

/**
 * Generate responsive image srcset for better performance
 * @param imageFolder - Project image folder
 * @param imageName - Image filename
 * @returns srcset string for responsive images
 */
export function generateImageSrcSet(imageFolder: string, imageName: string): string {
  const basePath = `/project_assets/${imageFolder}/${imageName}`;
  const optimizedPaths = getOptimizedImagePaths(basePath);
  
  return [
    `${optimizedPaths.small} 480w`,
    `${optimizedPaths.medium} 768w`,
    `${optimizedPaths.large} 1024w`,
    `${optimizedPaths.original} 1920w`
  ].join(', ');
}
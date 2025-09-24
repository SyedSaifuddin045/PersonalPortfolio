import sharp from 'sharp';
import { readdir, stat, mkdir, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

// Image optimization configuration
const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 480, height: 320 },
  medium: { width: 768, height: 512 },
  large: { width: 1024, height: 683 },
  xlarge: { width: 1920, height: 1280 }
};

const WEBP_QUALITY = 85;
const JPEG_QUALITY = 90;

/**
 * Optimize a single image and generate multiple sizes
 * @param inputPath - Path to the original image
 * @param outputDir - Directory to save optimized images
 * @param filename - Original filename
 */
export async function optimizeImage(inputPath: string, outputDir: string, filename: string) {
  const ext = extname(filename).toLowerCase();
  const name = basename(filename, ext);
  
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });
  
  // Only process supported formats
  if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    // Copy unsupported files as-is (like SVGs)
    await copyFile(inputPath, join(outputDir, filename));
    return;
  }
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Generate WebP version
    await image
      .webp({ quality: WEBP_QUALITY })
      .toFile(join(outputDir, `${name}.webp`));
    
    // Generate different sizes
    for (const [sizeName, dimensions] of Object.entries(IMAGE_SIZES)) {
      // Skip if original is smaller than target size
      if (metadata.width && metadata.width < dimensions.width) continue;
      
      // Generate JPEG version
      await image
        .resize(dimensions.width, dimensions.height, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ quality: JPEG_QUALITY })
        .toFile(join(outputDir, `${name}_${sizeName}.jpg`));
      
      // Generate WebP version
      await image
        .resize(dimensions.width, dimensions.height, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(join(outputDir, `${name}_${sizeName}.webp`));
    }
    
    // Keep original if it's reasonable size (under 2MB)
    const stats = await stat(inputPath);
    if (stats.size < 2 * 1024 * 1024) {
      await copyFile(inputPath, join(outputDir, filename));
    } else {
      // Compress original
      await image
        .jpeg({ quality: JPEG_QUALITY })
        .toFile(join(outputDir, filename));
    }
    
    console.log(`✓ Optimized ${filename}`);
  } catch (error) {
    console.error(`Failed to optimize ${filename}:`, error);
    // Fallback: copy original
    await copyFile(inputPath, join(outputDir, filename));
  }
}

/**
 * Optimize all images in a project folder
 * @param projectFolder - Name of the project folder
 * @param sourceDir - Source directory containing project assets
 * @param outputDir - Output directory for optimized images
 */
export async function optimizeProjectImages(
  projectFolder: string, 
  sourceDir: string = 'project_assets',
  outputDir: string = 'dist/public/project_assets'
) {
  const sourcePath = join(process.cwd(), sourceDir, projectFolder);
  const outputPath = join(process.cwd(), outputDir, projectFolder);
  
  if (!existsSync(sourcePath)) {
    console.warn(`Source folder ${sourcePath} does not exist`);
    return;
  }
  
  try {
    const files = await readdir(sourcePath);
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });
    
    console.log(`Optimizing ${imageFiles.length} images in ${projectFolder}...`);
    
    for (const file of imageFiles) {
      const inputPath = join(sourcePath, file);
      await optimizeImage(inputPath, outputPath, file);
    }
  } catch (error) {
    console.error(`Failed to optimize project ${projectFolder}:`, error);
  }
}

/**
 * Optimize all project images for production build
 * @param sourceDir - Source directory containing all project assets
 * @param outputDir - Output directory for optimized images
 */
export async function optimizeAllProjectImages(
  sourceDir: string = 'project_assets',
  outputDir: string = 'dist/public/project_assets'
) {
  const sourcePath = join(process.cwd(), sourceDir);
  
  if (!existsSync(sourcePath)) {
    console.warn(`Source directory ${sourcePath} does not exist`);
    return;
  }
  
  try {
    const folders = await readdir(sourcePath);
    const projectFolders = [];
    
    // Filter for directories only
    for (const folder of folders) {
      const folderPath = join(sourcePath, folder);
      const stats = await stat(folderPath);
      if (stats.isDirectory()) {
        projectFolders.push(folder);
      }
    }
    
    console.log(`\n🖼️  Starting image optimization for ${projectFolders.length} projects...`);
    
    const startTime = Date.now();
    
    // Process folders in parallel (but limit concurrency to avoid memory issues)
    const BATCH_SIZE = 3;
    for (let i = 0; i < projectFolders.length; i += BATCH_SIZE) {
      const batch = projectFolders.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(folder => optimizeProjectImages(folder, sourceDir, outputDir))
      );
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n✅ Image optimization completed in ${duration}s`);
    
    // Generate optimization report
    const optimizedPath = join(process.cwd(), outputDir);
    if (existsSync(optimizedPath)) {
      const optimizedFolders = await readdir(optimizedPath);
      let totalFiles = 0;
      
      for (const folder of optimizedFolders) {
        const folderPath = join(optimizedPath, folder);
        const stats = await stat(folderPath);
        if (stats.isDirectory()) {
          const files = await readdir(folderPath);
          totalFiles += files.length;
        }
      }
      
      console.log(`📊 Generated ${totalFiles} optimized image files across ${optimizedFolders.length} projects`);
    }
    
  } catch (error) {
    console.error('Failed to optimize images:', error);
  }
}

/**
 * Generate responsive image srcset for optimized images
 * @param imageFolder - Project image folder
 * @param imageName - Image filename
 * @param useWebP - Whether to prefer WebP format
 * @returns srcset string for responsive images
 */
export function generateOptimizedSrcSet(
  imageFolder: string, 
  imageName: string, 
  useWebP: boolean = true
): string {
  const name = basename(imageName, extname(imageName));
  const ext = useWebP ? 'webp' : 'jpg';
  const basePath = `/project_assets/${imageFolder}`;
  
  const srcsets = [
    `${basePath}/${name}_small.${ext} 480w`,
    `${basePath}/${name}_medium.${ext} 768w`,
    `${basePath}/${name}_large.${ext} 1024w`,
  ];
  
  // Add original if available
  if (existsSync(join(process.cwd(), 'dist/public', basePath, imageName))) {
    srcsets.push(`${basePath}/${imageName} 1920w`);
  }
  
  return srcsets.join(', ');
}
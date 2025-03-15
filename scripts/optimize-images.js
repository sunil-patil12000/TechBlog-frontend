#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes all images in the public/images and src/assets/images directories:
 * - Compresses JPG/PNG images
 * - Converts images to WebP and AVIF formats
 * - Generates responsive image sizes
 * - Creates image placeholders for lazy loading
 * 
 * Usage:
 * - npm run images:optimize
 * - npm run images:optimize -- --dir=custom/path/to/images
 * - npm run images:optimize -- --quality=80
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const sharp = require('sharp');
const ora = require('ora');
const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('dir', {
    description: 'Directory to optimize (relative to project root)',
    type: 'string',
  })
  .option('quality', {
    description: 'Quality for WebP and AVIF (1-100)',
    type: 'number',
    default: 80,
  })
  .option('resize', {
    description: 'Generate multiple sizes for responsive images',
    type: 'boolean',
    default: true,
  })
  .option('placeholders', {
    description: 'Generate placeholders for lazy loading',
    type: 'boolean',
    default: true,
  })
  .option('skipExisting', {
    description: 'Skip images that already have optimized versions',
    type: 'boolean',
    default: true,
  })
  .help()
  .argv;

// Configuration
const config = {
  quality: argv.quality,
  skipExisting: argv.skipExisting,
  sourceDirectories: argv.dir 
    ? [argv.dir] 
    : ['public/images', 'src/assets/images'],
  sizes: argv.resize ? [640, 768, 1024, 1366, 1600, 1920] : [],
  generatePlaceholders: argv.placeholders,
  extensions: ['.jpg', '.jpeg', '.png'],
  // Skip SVG/GIF files for conversion, but will be copied as-is
  skipConversion: ['.svg', '.gif', '.webp', '.avif'],
};

/**
 * Main function
 */
async function main() {
  console.log(chalk.blue.bold('🖼️  Image Optimization Script'));
  console.log(chalk.blue('Optimizing images and converting to modern formats\n'));
  
  // Process each directory
  for (const sourceDir of config.sourceDirectories) {
    const absolutePath = path.resolve(process.cwd(), sourceDir);
    
    // Check if directory exists
    if (!fs.existsSync(absolutePath)) {
      console.log(chalk.yellow(`⚠️  Directory not found: ${sourceDir}`));
      continue;
    }
    
    console.log(chalk.blue(`\nProcessing directory: ${sourceDir}`));
    
    // Find all images in the directory
    const imagePatterns = config.extensions.map(ext => `${absolutePath}/**/*${ext}`);
    const skipPatterns = config.skipConversion.map(ext => `${absolutePath}/**/*${ext}`);
    
    // Get all images that need processing
    const imagesToProcess = await glob('{' + imagePatterns.join(',') + '}');
    
    // Get all images that should be copied as-is
    const imagesToCopy = await glob('{' + skipPatterns.join(',') + '}');
    
    if (imagesToProcess.length === 0 && imagesToCopy.length === 0) {
      console.log(chalk.yellow(`⚠️  No images found in ${sourceDir}`));
      continue;
    }
    
    console.log(chalk.blue(`Found ${imagesToProcess.length} images to optimize and ${imagesToCopy.length} to copy`));
    
    // Process images for conversion and optimization
    await processImages(imagesToProcess, absolutePath);
    
    // Copy images that don't need conversion
    await copyImages(imagesToCopy, absolutePath);
  }
  
  console.log(chalk.green.bold('\n✅ Image optimization complete!'));
}

/**
 * Process images for conversion and optimization
 */
async function processImages(images, basePath) {
  const spinner = ora('Processing images...').start();
  let processed = 0;
  
  for (const imagePath of images) {
    try {
      // Get relative path to maintain directory structure
      const relativePath = path.relative(basePath, imagePath);
      const imageDir = path.dirname(relativePath);
      const imageName = path.basename(imagePath, path.extname(imagePath));
      
      // Create directory if it doesn't exist
      const outputDir = path.join(basePath, imageDir);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Skip if optimized versions already exist and skipExisting is true
      if (config.skipExisting) {
        const webpPath = path.join(outputDir, `${imageName}.webp`);
        const avifPath = path.join(outputDir, `${imageName}.avif`);
        
        if (fs.existsSync(webpPath) && fs.existsSync(avifPath)) {
          spinner.text = `Skipping existing: ${relativePath}`;
          continue;
        }
      }
      
      // Load image with sharp
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Update spinner
      spinner.text = `Processing: ${relativePath}`;
      
      // Generate WebP version
      await image
        .webp({ quality: config.quality })
        .toFile(path.join(outputDir, `${imageName}.webp`));
      
      // Generate AVIF version
      await sharp(imagePath)
        .avif({ quality: config.quality })
        .toFile(path.join(outputDir, `${imageName}.avif`));
      
      // Generate resized versions if needed
      if (config.sizes.length > 0) {
        // Only resize if image is larger than the target size
        const resizeSizes = config.sizes.filter(size => size < metadata.width);
        
        for (const size of resizeSizes) {
          const resizedName = `${imageName}-${size}`;
          
          // Resized original format
          await sharp(imagePath)
            .resize(size)
            .toFile(path.join(outputDir, `${resizedName}${path.extname(imagePath)}`));
          
          // Resized WebP
          await sharp(imagePath)
            .resize(size)
            .webp({ quality: config.quality })
            .toFile(path.join(outputDir, `${resizedName}.webp`));
          
          // Resized AVIF
          await sharp(imagePath)
            .resize(size)
            .avif({ quality: config.quality })
            .toFile(path.join(outputDir, `${resizedName}.avif`));
        }
      }
      
      // Generate placeholder for lazy loading
      if (config.generatePlaceholders) {
        const placeholderSize = Math.min(20, Math.round(metadata.width / 20));
        
        await sharp(imagePath)
          .resize(placeholderSize)
          .blur(5)
          .webp({ quality: 20 })
          .toFile(path.join(outputDir, `${imageName}-placeholder.webp`));
      }
      
      processed++;
    } catch (error) {
      spinner.warn(`Error processing ${imagePath}: ${error.message}`);
    }
  }
  
  spinner.succeed(`Processed ${processed} images`);
}

/**
 * Copy images that don't need conversion (SVG, GIF)
 */
async function copyImages(images, basePath) {
  if (images.length === 0) return;
  
  const spinner = ora('Copying non-convertible images...').start();
  let copied = 0;
  
  for (const imagePath of images) {
    try {
      // Get relative path to maintain directory structure
      const relativePath = path.relative(basePath, imagePath);
      const outputPath = path.join(basePath, relativePath);
      
      // Create directory if it doesn't exist
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Skip if file already exists at destination and is the same
      if (config.skipExisting && fs.existsSync(outputPath)) {
        const srcStat = fs.statSync(imagePath);
        const destStat = fs.statSync(outputPath);
        
        if (srcStat.size === destStat.size && srcStat.mtime <= destStat.mtime) {
          spinner.text = `Skipping existing: ${relativePath}`;
          continue;
        }
      }
      
      // Copy file
      spinner.text = `Copying: ${relativePath}`;
      fs.copyFileSync(imagePath, outputPath);
      copied++;
    } catch (error) {
      spinner.warn(`Error copying ${imagePath}: ${error.message}`);
    }
  }
  
  spinner.succeed(`Copied ${copied} images`);
}

/**
 * Generate HTML example for responsive images
 */
function generateHtmlExample() {
  console.log(chalk.blue.bold('\n📝 HTML Usage Example:'));
  console.log(chalk.cyan(`
<!-- Modern way using picture element -->
<picture>
  <source type="image/avif" srcset="image.avif, image-1920.avif 1920w, image-1366.avif 1366w" sizes="100vw" />
  <source type="image/webp" srcset="image.webp, image-1920.webp 1920w, image-1366.webp 1366w" sizes="100vw" />
  <img src="image.jpg" alt="Description" loading="lazy" width="800" height="600" />
</picture>

<!-- Or use the ResponsiveImage component for React -->
<ResponsiveImage 
  src="/images/image.jpg" 
  alt="Description" 
  width={800} 
  height={600} 
/>
  `));
}

// Run the script
main()
  .then(generateHtmlExample)
  .catch(error => {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }); 
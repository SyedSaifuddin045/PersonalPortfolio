#!/usr/bin/env tsx

import { build } from 'vite';
import { build as esbuild } from 'esbuild';
import { optimizeAllProjectImages } from '../server/imageOptimization';
import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function buildClient() {
  console.log('🏗️  Building client...');
  await build({
    configFile: 'vite.config.ts',
    mode: 'production',
  });
  console.log('✅ Client build completed');
}

async function buildServer() {
  console.log('🏗️  Building server...');
  await esbuild({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outdir: 'dist',
    packages: 'external',
    sourcemap: true,
    minify: true,
  });
  console.log('✅ Server build completed');
}

async function copyAssets() {
  console.log('📁 Copying assets...');
  
  // Ensure dist directory exists
  const distDir = join(process.cwd(), 'dist');
  if (!existsSync(distDir)) {
    await mkdir(distDir, { recursive: true });
  }
  
  // Copy portfolio data
  const portfolioDataSource = join(process.cwd(), 'portfolio-data.json');
  const portfolioDataDest = join(process.cwd(), 'dist', 'portfolio-data.json');
  
  if (existsSync(portfolioDataSource)) {
    await copyFile(portfolioDataSource, portfolioDataDest);
    console.log('✓ Copied portfolio-data.json');
  }
  
  // Copy package.json for production dependencies
  const packageJsonSource = join(process.cwd(), 'package.json');
  const packageJsonDest = join(process.cwd(), 'dist', 'package.json');
  
  if (existsSync(packageJsonSource)) {
    await copyFile(packageJsonSource, packageJsonDest);
    console.log('✓ Copied package.json');
  }
  
  console.log('✅ Asset copying completed');
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  await optimizeAllProjectImages();
  console.log('✅ Image optimization completed');
}

async function main() {
  const startTime = Date.now();
  
  console.log('🚀 Starting production build...\n');
  
  try {
    // Build steps in parallel where possible
    await Promise.all([
      buildClient(),
      copyAssets(),
    ]);
    
    // Optimize images after client build (needs the dist/public directory)
    await optimizeImages();
    
    // Build server last (may depend on other assets)
    await buildServer();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n🎉 Production build completed successfully in ${duration}s!`);
    console.log('\n📦 Build artifacts:');
    console.log('   • dist/public/ - Client application');
    console.log('   • dist/public/project_assets/ - Optimized images');
    console.log('   • dist/index.js - Server application');
    console.log('   • dist/portfolio-data.json - Portfolio data');
    console.log('\n🚀 Ready for deployment!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
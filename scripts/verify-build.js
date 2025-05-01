import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to recursively list all files in a directory
function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main verification function
function verifyBuild() {
  console.log('Verifying build output...');

  const distDir = path.join(rootDir, 'dist');
  const distImagesDir = path.join(distDir, 'images');

  // Check if dist directory exists
  if (!directoryExists(distDir)) {
    console.error('Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Check if images directory exists in dist
  if (!directoryExists(distImagesDir)) {
    console.error('Warning: images directory not found in dist.');
    console.log('Creating images directory...');
    fs.mkdirSync(distImagesDir, { recursive: true });
  }

  // Check if specific images exist
  const requiredImages = [
    path.join(distDir, 'images', 'logo-personal.svg'),
    path.join(distDir, 'images', 'favicon.ico'),
    path.join(distDir, 'bg.jpg')
  ];

  let missingImages = [];

  requiredImages.forEach(img => {
    if (!fileExists(img)) {
      missingImages.push(img);
    }
  });

  if (missingImages.length > 0) {
    console.error('Warning: The following required images are missing:');
    missingImages.forEach(img => console.error(`  - ${img}`));

    // Copy missing images from public to dist
    console.log('Copying missing images from public directory...');

    missingImages.forEach(img => {
      const sourcePath = img.replace(distDir, path.join(rootDir, 'public'));
      if (fileExists(sourcePath)) {
        const targetDir = path.dirname(img);
        if (!directoryExists(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.copyFileSync(sourcePath, img);
        console.log(`  - Copied ${sourcePath} to ${img}`);
      } else {
        console.error(`  - Source file ${sourcePath} not found`);
      }
    });
  } else {
    console.log('All required images are present in the build.');
  }

  // List all files in the dist directory
  console.log('\nFiles in dist directory:');
  const distFiles = listFiles(distDir);
  distFiles.forEach(file => {
    console.log(`  - ${file}`);
  });

  console.log('\nBuild verification complete.');
}

// Run the verification
verifyBuild();

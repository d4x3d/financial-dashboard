import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to copy a file
function copyFile(source, target) {
  try {
    const targetDir = path.dirname(target);
    ensureDirectoryExists(targetDir);

    fs.copyFileSync(source, target);
    console.log(`Copied: ${source} -> ${target}`);
  } catch (error) {
    console.error(`Error copying ${source} to ${target}: ${error.message}`);
  }
}

// Function to copy a directory recursively
function copyDirectory(source, target) {
  ensureDirectoryExists(target);

  const files = fs.readdirSync(source);

  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFile(sourcePath, targetPath);
    }
  });
}

// Main function
function copyImages() {
  console.log('Starting image copy process...');

  // Ensure dist directory exists
  ensureDirectoryExists(path.join(rootDir, 'dist'));

  // Copy the entire images directory
  copyDirectory(
    path.join(rootDir, 'public', 'images'),
    path.join(rootDir, 'dist', 'images')
  );

  // Copy specific files at the root level
  const bgJpgPath = path.join(rootDir, 'public', 'bg.jpg');
  if (fs.existsSync(bgJpgPath)) {
    copyFile(bgJpgPath, path.join(rootDir, 'dist', 'bg.jpg'));
  }

  console.log('Image copy process completed.');
}

// Run the copy process
copyImages();

const fs = require('fs');
const path = require('path');

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

  const rootDir = path.resolve(__dirname, '..');

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

  // Copy 404.html
  const notFoundPath = path.join(rootDir, 'public', '404.html');
  if (fs.existsSync(notFoundPath)) {
    copyFile(notFoundPath, path.join(rootDir, 'dist', '404.html'));
  }

  // Copy index.js
  const indexJsPath = path.join(rootDir, 'public', 'index.js');
  if (fs.existsSync(indexJsPath)) {
    copyFile(indexJsPath, path.join(rootDir, 'dist', 'index.js'));
  }

  // Copy .htaccess
  const htaccessPath = path.join(rootDir, 'public', '.htaccess');
  if (fs.existsSync(htaccessPath)) {
    copyFile(htaccessPath, path.join(rootDir, 'dist', '.htaccess'));
  }

  console.log('Image copy process completed.');
}

// Run the copy process
copyImages();

const fs = require('fs');
const path = require('path');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Function to list all files in a directory
function listFiles(dir, fileList = []) {
  if (!directoryExists(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return fileList;
  }

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

// Main function
function checkBuild() {
  console.log('Checking build output...');

  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');

  if (!directoryExists(distDir)) {
    console.error('Error: dist directory not found!');
    return;
  }

  console.log('dist directory exists.');

  const imagesDir = path.join(distDir, 'images');
  if (directoryExists(imagesDir)) {
    console.log('images directory exists in dist.');

    // List all images
    const imageFiles = listFiles(imagesDir);
    console.log(`Found ${imageFiles.length} files in images directory:`);
    imageFiles.forEach(file => {
      console.log(`  - ${path.relative(distDir, file)}`);
    });
  } else {
    console.error('Error: images directory not found in dist!');
  }

  // Check for specific files
  const filesToCheck = [
    path.join(distDir, 'images', 'logo-personal.svg'),
    path.join(distDir, 'images', 'favicon.ico'),
    path.join(distDir, 'bg.jpg')
  ];

  console.log('\nChecking for specific files:');
  filesToCheck.forEach(file => {
    if (fileExists(file)) {
      console.log(`  ✓ ${path.relative(distDir, file)} exists`);
    } else {
      console.error(`  ✗ ${path.relative(distDir, file)} is missing!`);
    }
  });

  console.log('\nCheck complete.');
}

// Run the check
checkBuild();

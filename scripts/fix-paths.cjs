const fs = require('fs');
const path = require('path');

// Function to fix paths in the built index.html
function fixPaths() {
  console.log('Fixing paths in the built index.html...');
  
  const indexPath = path.resolve(__dirname, '../dist/index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('Error: dist/index.html not found!');
    return;
  }
  
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Fix asset paths to be relative
  content = content.replace(/src="\//g, 'src="./');
  content = content.replace(/href="\//g, 'href="./');
  
  // Fix script paths
  content = content.replace(/src="\/assets\//g, 'src="./assets/');
  content = content.replace(/href="\/assets\//g, 'href="./assets/');
  
  // Write the fixed content back to the file
  fs.writeFileSync(indexPath, content);
  
  console.log('Fixed paths in index.html');
}

// Run the function
fixPaths();

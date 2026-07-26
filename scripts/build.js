const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');

const filesToCopy = ['index.html', '404.html', 'CNAME', '_headers'];
const dirsToCopy = ['assets', 'data', 'blogs'];

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ${path.relative(process.cwd(), dest)}`);
}

console.log('Copying static files to dist/:');

for (const file of filesToCopy) {
  const src = path.join(process.cwd(), file);
  const dest = path.join(process.cwd(), 'dist', file);
  if (fs.existsSync(src)) {
    copyFile(src, dest);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(process.cwd(), dir);
  const dest = path.join(process.cwd(), 'dist', dir);
  if (fs.existsSync(src)) {
    copyDir(src, dest);
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

console.log('Done!');

const fs = require('fs');
const path = require('path');

/**
 * Enhanced Build Script for Vercel
 * 1. Replaces placeholders with Environment Variables
 * 2. Copies all files into a 'dist' directory for Vercel deployment
 */

const distDir = path.join(process.cwd(), 'dist');

// 1. Create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Files and directories to copy to dist
const toCopy = [
  'index.html',
  'style.css',
  'script.js',
  'chat.js',
  'assets'
];

// 3. Define replacements
const replacements = [
  { file: 'chat.js', placeholder: 'INSERT_GEMINI_API_KEY_HERE', env: 'GEMINI_API_KEY' },
  { file: 'script.js', placeholder: 'INSERT_EMAILJS_PUBLIC_KEY_HERE', env: 'EMAILJS_PUBLIC_KEY' },
  { file: 'script.js', placeholder: 'INSERT_EMAILJS_SERVICE_ID_HERE', env: 'EMAILJS_SERVICE_ID' },
  { file: 'script.js', placeholder: 'INSERT_EMAILJS_TEMPLATE_ID_HERE', env: 'EMAILJS_TEMPLATE_ID' }
];

// 4. Copy and Process
toCopy.forEach(item => {
  const src = path.join(process.cwd(), item);
  const dest = path.join(distDir, item);

  if (!fs.existsSync(src)) {
    console.warn(`Source not found: ${item}`);
    return;
  }

  if (fs.lstatSync(src).isDirectory()) {
    copyFolderRecursiveSync(src, distDir);
  } else {
    let content = fs.readFileSync(src, 'utf8');
    
    // Apply replacements for this file
    replacements.filter(r => r.file === item).forEach(rep => {
      const envValue = process.env[rep.env];
      if (envValue) {
        console.log(`Replacing ${rep.placeholder} in ${item} with value from ${rep.env}`);
        content = content.replace(new RegExp(rep.placeholder, 'g'), envValue);
      } else {
        console.warn(`Environment variable ${rep.env} not found for ${item}. Using placeholder.`);
      }
    });

    fs.writeFileSync(dest, content, 'utf8');
    console.log(`Copied and processed ${item}`);
  }
});

console.log('Build completed successfully! Output is in the /dist directory.');

// Helper function to copy folders
function copyFolderRecursiveSync(source, target) {
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        fs.copyFileSync(curSource, path.join(targetFolder, file));
      }
    });
  }
}

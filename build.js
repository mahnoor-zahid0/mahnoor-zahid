const fs = require('fs');
const path = require('path');

/**
 * Robust Build Script for Vercel
 * Replaces placeholders in JS files with Environment Variables.
 */

const filesToProcess = [
  {
    path: 'chat.js',
    replacements: [
      { placeholder: 'INSERT_GEMINI_API_KEY_HERE', env: 'GEMINI_API_KEY' }
    ]
  },
  {
    path: 'script.js',
    replacements: [
      { placeholder: 'INSERT_EMAILJS_PUBLIC_KEY_HERE', env: 'EMAILJS_PUBLIC_KEY' },
      { placeholder: 'INSERT_EMAILJS_SERVICE_ID_HERE', env: 'EMAILJS_SERVICE_ID' },
      { placeholder: 'INSERT_EMAILJS_TEMPLATE_ID_HERE', env: 'EMAILJS_TEMPLATE_ID' }
    ]
  }
];

filesToProcess.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file.path}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  file.replacements.forEach(rep => {
    const envValue = process.env[rep.env];
    if (envValue) {
      console.log(`Replacing ${rep.placeholder} with value from ${rep.env}`);
      content = content.replace(new RegExp(rep.placeholder, 'g'), envValue);
      hasChanges = true;
    } else {
      console.warn(`Environment variable ${rep.env} not found. Skipping.`);
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${file.path}`);
  } else {
    console.log(`No changes needed for ${file.path}`);
  }
});

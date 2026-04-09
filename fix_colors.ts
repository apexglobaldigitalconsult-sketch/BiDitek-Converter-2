import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src', 'pages');

const replacements = [
  { regex: /bg-\[#eeeeee\] dark:bg-gray-800/g, replacement: 'bg-surface-container' },
  { regex: /border-gray-300 dark:border-gray-700/g, replacement: 'border-outline-variant' },
  { regex: /border-gray-400 dark:border-gray-600/g, replacement: 'border-outline-variant' },
  { regex: /border-gray-200 dark:border-gray-700/g, replacement: 'border-outline-variant' },
  { regex: /border-gray-300 dark:border-gray-600/g, replacement: 'border-outline-variant' },
  { regex: /border-gray-100 dark:border-gray-800/g, replacement: 'border-outline-variant' },
  { regex: /bg-white dark:bg-gray-700/g, replacement: 'bg-surface-container-low' },
  { regex: /bg-white dark:bg-gray-900/g, replacement: 'bg-surface-container-low' },
  { regex: /text-gray-900 dark:text-gray-100/g, replacement: 'text-primary' },
  { regex: /text-gray-800 dark:text-gray-100/g, replacement: 'text-primary' },
  { regex: /text-gray-800 dark:text-gray-200/g, replacement: 'text-primary/90' },
  { regex: /text-gray-700 dark:text-gray-300/g, replacement: 'text-primary/80' },
  { regex: /text-gray-600 dark:text-gray-400/g, replacement: 'text-primary/60' },
  { regex: /text-gray-500 dark:text-gray-400/g, replacement: 'text-primary/50' },
  { regex: /bg-gray-100 dark:bg-gray-800/g, replacement: 'bg-surface-container' },
  { regex: /bg-gray-100 dark:bg-gray-700\/50/g, replacement: 'bg-surface-container' },
  { regex: /bg-white dark:bg-gray-800\/50/g, replacement: 'bg-surface-container-low' },
  { regex: /bg-gray-50 dark:bg-gray-800\/50/g, replacement: 'bg-surface-container' },
  { regex: /bg-blue-50 dark:bg-gray-800/g, replacement: 'bg-surface-container' },
  { regex: /text-blue-600 dark:text-blue-400/g, replacement: 'text-secondary' },
  { regex: /text-blue-800 dark:text-blue-400/g, replacement: 'text-secondary' },
  { regex: /bg-\[#4f7396\]/g, replacement: 'bg-secondary' },
  { regex: /hover:bg-\[#3f5d7a\]/g, replacement: 'hover:bg-secondary/80' },
  { regex: /bg-\[#2b4c6b\]/g, replacement: 'bg-surface-container-highest' },
  { regex: /bg-gray-800 text-white/g, replacement: 'bg-primary text-background' },
  { regex: /bg-blue-600/g, replacement: 'bg-secondary' },
  { regex: /hover:bg-blue-700/g, replacement: 'hover:bg-secondary/80' },
  { regex: /focus:ring-blue-500/g, replacement: 'focus:ring-secondary' },
  { regex: /focus:border-blue-500/g, replacement: 'focus:border-secondary' },
  { regex: /divide-gray-300 dark:divide-gray-700/g, replacement: 'divide-outline-variant' },
  { regex: /divide-gray-200 dark:divide-gray-700/g, replacement: 'divide-outline-variant' },
  { regex: /divide-gray-100 dark:divide-gray-800/g, replacement: 'divide-outline-variant' },
  { regex: /text-gray-500/g, replacement: 'text-primary/50' },
  { regex: /bg-white dark:bg-gray-800/g, replacement: 'bg-surface-container-low' },
];

function processDirectory(dir: string) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);

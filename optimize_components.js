const fs = require('fs');
const path = require('path');

const componentsDir = 'd:\\New folder\\web\\Hostlixo\\app\\components';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // 1. Replace laggy transition-all with standard transition
      content = content.replace(/transition-all/g, 'transition');
      
      // 2. Reduce backdrop-blur radius and force GPU compositing
      content = content.replace(/backdrop-blur-xl/g, 'backdrop-blur-md transform-gpu');
      
      // 3. Add transform-gpu to existing backdrop-blur-md if missing
      content = content.replace(/backdrop-blur-md(?! transform-gpu)/g, 'backdrop-blur-md transform-gpu');
      
      // 4. Ensure hardware acceleration on heavy motion divs
      content = content.replace(/hover:-translate-y-1(?!.*transform-gpu)/g, 'hover:-translate-y-1 transform-gpu');
      content = content.replace(/hover:-translate-y-2(?!.*transform-gpu)/g, 'hover:-translate-y-2 transform-gpu');
      content = content.replace(/hover:scale-105(?!.*transform-gpu)/g, 'hover:scale-105 transform-gpu');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Optimized: ${fullPath}`);
      }
    }
  }
}

processDirectory(componentsDir);
console.log("Global optimization complete.");

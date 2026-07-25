const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);
    let original = content;

    if (ext === '.tsx' || ext === '.ts' || ext === '.css' || ext === '.js') {
        // Replace blue with red
        content = content.replace(/\b(bg|text|border|ring|from|via|to|shadow|fill|stroke|outline)-blue-(\d{2,3})(\/[0-9a-zA-Z\.]+)?\b/g, '$1-red-$2$3');
        // Replace purple with rose (for gradients/secondary)
        content = content.replace(/\b(bg|text|border|ring|from|via|to|shadow|fill|stroke|outline)-purple-(\d{2,3})(\/[0-9a-zA-Z\.]+)?\b/g, '$1-rose-$2$3');
        // Replace emerald/cyan/indigo/violet/green with red
        content = content.replace(/\b(bg|text|border|ring|from|via|to|shadow|fill|stroke|outline)-(emerald|cyan|indigo|violet|green)-(\d{2,3})(\/[0-9a-zA-Z\.]+)?\b/g, '$1-red-$3$4');
        
        // Background color resets to black/dark gray for the "Red and Black" theme
        content = content.replace(/bg-\[\#0c0e15\]/g, 'bg-[#050505]');
        content = content.replace(/bg-\[\#08080a\]/g, 'bg-[#000000]');
        content = content.replace(/bg-\[\#07070d\]/g, 'bg-[#000000]');
        content = content.replace(/bg-\[\#0A0A0C\]/g, 'bg-[#0a0a0a]');
        content = content.replace(/bg-\[\#151515\]/g, 'bg-[#0f0f0f]');

        // Update hex codes in globals.css or other hardcoded files
        // E.g. fill="%238b5cf681" -> fill="%23e11d4881"
        content = content.replace(/%238b5cf6/g, '%23e11d48'); // purple -> rose
        content = content.replace(/%233b82f6/g, '%23ef4444'); // blue -> red
        content = content.replace(/%2334d399/g, '%23ef4444'); // emerald -> red

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

targetDirs.forEach(dir => traverseDir(path.join(__dirname, dir)));
console.log("Done theme replacement.");

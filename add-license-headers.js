const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const licenseText = fs.readFileSync('./LICENSE.md', 'utf-8')

const commentStyles = {
  '.ts': {start: '/**', line: '*', end: '*/'},
  '.js': {start: '/**', line: '*', end: '*/'},
  '.css': {start: '/**', line: '*', end: '*/'},
  '.scss': {start: '/**', line: '*', end: '*/'},
  '.less': {start: '/**', line: '*', end: '*/'},
  '.html': {start: '<!--', line: '', end: '-->'},
  '.md': {start: '<!--', line: '', end: '-->'},
  '.xml': {start: '<!--', line: '', end: '-->'},
  '.xsd': {start: '<!--', line: '', end: '-->'},
  '.yaml': {start: '#', line: '#', end: ''},
  '.tmpl': {start: '#', line: '#', end: ''},
  '.conf': {start: '#', line: '#', end: ''},
  '.feature': {start: '#', line: '#', end:''},
}

function formatLicenseForFileType(ext) {
  const style = commentStyles[ext];
  if (!style) return null;
  const lines = licenseText.split('\n');
  let result = style.start + '\n';
  for (const line of lines) {
    result += style.line + line + '\n';
  }
  result += style.end + '\n\n';
  return result;
}

function hasLicenseHeader(content) {
  return content.includes('Redistribution and use in source and binary form');
}

async function addLicenseToFiles(dir) {
  const ignorePaths = ['node_modules', 'dist', '.git', 'e2e'];
  let processedCount = 0;
  let skippedCount = 0;
  try {
      const files = await glob(`${dir}/**/*.*`, {
        ignore: ignorePaths.map(p => `${p}/**`),
      });
      files.forEach((file) => {
        try{
        const ext = path.extname(file);
        if (!commentStyles[ext]) {
          skippedCount++;
          return;
        }
          const content = fs.readFileSync(file, 'utf8');
          if (hasLicenseHeader(content)) {
            console.log(`Skipped has already License head: ${file}`);
            skippedCount++;
            return;
          }
          const licenseHeader = formatLicenseForFileType(ext);
          if (!licenseHeader) {
            skippedCount++;
            return;
          }
          const newContent = licenseHeader + content;
          fs.writeFileSync(file, newContent, 'utf8');
          console.log(`License added: ${file}`);
          processedCount++;
        }catch (error){
          console.error(`Error with writeing to file: ${file}`, error);
        }
        })
    } catch (error) {
      console.error(`Error with finding dir files`, error);
    }
    console.log(`\nDone! ${processedCount} Files Changed, ${skippedCount} skipped.`);
}
const projectDir = process.cwd();
console.log(`adding BSD-3-Clause License to Files in ${projectDir}`);
addLicenseToFiles(projectDir);

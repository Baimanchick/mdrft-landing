const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, '..', 'public', 'images'),
  path.join(__dirname, '..', 'public', 'cars'),
];

async function convertDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const srcPath = path.join(dir, file);
      const destName = path.basename(file, ext) + '.webp';
      const destPath = path.join(dir, destName);
      
      console.log(`Converting ${file} -> ${destName}...`);
      await sharp(srcPath)
        .webp({ quality: 95, effort: 6 })
        .toFile(destPath);
      console.log(`✓ Converted: ${destName}`);
    }
  }
}

async function main() {
  for (const dir of targetDirs) {
    await convertDir(dir);
  }
  console.log('All images converted to webp successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

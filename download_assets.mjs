import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const SRC_FILE = path.join(process.cwd(), 'src', 'OrcestraLanding.tsx');
const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets');

async function main() {
  try {
    if (!fs.existsSync(ASSETS_DIR)) {
      fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }
    let content = fs.readFileSync(SRC_FILE, 'utf-8');

    // Regex to match both localhost:3845 and already replaced ./assets/ paths
    // We want to find all unique asset filenames mentioned in the file
    const regex = /http:\/\/localhost:3845\/assets\/([a-f0-9]+\.(?:png|svg|jpg|jpeg|webp|mp4))/g;
    const matches = [...content.matchAll(regex)];

    const uniqueAssets = new Map();
    for (const match of matches) {
      uniqueAssets.set(match[1], match[0]);
    }

    console.log(`Found ${uniqueAssets.size} unique assets to download.`);

    for (const [filename, url] of uniqueAssets.entries()) {
      const filePath = path.join(ASSETS_DIR, filename);
      // Use 127.0.0.1 to avoid localhost IPv6 issues
      const ipv4Url = url.replace('localhost', '127.0.0.1');
      
      console.log(`Downloading ${filename}...`);
      try {
        // Use curl via execSync for reliability on Windows
        execSync(`curl -s -o "${filePath}" "${ipv4Url}"`);
        
        // Check if file was actually downloaded and has content
        if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
          console.log(`Successfully downloaded ${filename}`);
          // Replace ALL occurrences of this URL with the local path
          content = content.split(url).join(`./assets/${filename}`);
        } else {
          console.error(`Failed to download ${filename} (empty file or error)`);
        }
      } catch (err) {
        console.error(`Error downloading ${filename}:`, err.message);
      }
    }

    fs.writeFileSync(SRC_FILE, content, 'utf-8');
    console.log('Done! Updated OrcestraLanding.tsx with local asset paths.');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();

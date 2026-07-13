import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

if (!fs.existsSync(indexPath)) {
  console.error('No se encontro dist/index.html para generar 404.html');
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log('404.html generado para fallback SPA');

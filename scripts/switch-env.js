import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const target = (process.argv[2] || 'local').toLowerCase();

const LOCAL_URL = 'http://localhost:5001/api';
const PROD_URL = 'https://asia-south1-onevishwam.cloudfunctions.net/api';
const activeUrl = target === 'prod' || target === 'production' ? PROD_URL : LOCAL_URL;

const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envPath)) {
  let content = fs.readFileSync(envPath, 'utf-8');
  content = content.replace(/^VITE_API_URL=.*$/m, `VITE_API_URL=${activeUrl}`);
  content = content.replace(/^VITE_API_BASE_URL=.*$/m, `VITE_API_BASE_URL=${activeUrl}`);
  fs.writeFileSync(envPath, content, 'utf-8');
  console.log(`\n🔄 Switched OneVishwam Frontend API to: ${activeUrl} (${target.toUpperCase()})\n`);
} else {
  console.error('.env file not found!');
  process.exit(1);
}

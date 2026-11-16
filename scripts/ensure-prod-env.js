import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PROD_API_URL = 'https://asia-south1-onevishwam.cloudfunctions.net/api';
const HOSTINGER_DIR = 'domains/onevishwam.com/public_html';

function updateEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace or add VITE_API_URL
  if (/^VITE_API_URL=.*$/m.test(content)) {
    content = content.replace(/^VITE_API_URL=.*$/m, `VITE_API_URL=${PROD_API_URL}`);
  } else {
    content += `\nVITE_API_URL=${PROD_API_URL}`;
  }

  // Replace or add VITE_API_BASE_URL
  if (/^VITE_API_BASE_URL=.*$/m.test(content)) {
    content = content.replace(/^VITE_API_BASE_URL=.*$/m, `VITE_API_BASE_URL=${PROD_API_URL}`);
  } else {
    content += `\nVITE_API_BASE_URL=${PROD_API_URL}`;
  }

  // Ensure Hostinger remote directory is correct
  if (/^HOSTINGER_REMOTE_DIR=.*$/m.test(content)) {
    content = content.replace(/^HOSTINGER_REMOTE_DIR=.*$/m, `HOSTINGER_REMOTE_DIR=${HOSTINGER_DIR}`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('\n🔒 [Pre-Build / Deploy Policy Check]');
console.log(`⚡ Enforcing Production API: ${PROD_API_URL}`);

// Update both .env and .env.production
updateEnvFile(path.join(rootDir, '.env.production'));
updateEnvFile(path.join(rootDir, '.env'));

console.log('✅ Environment verified for production deployment.\n');

import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load .env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// Read Hostinger configuration
const rawHost = process.env.HOSTINGER_FTP_HOST || '';
const HOST = rawHost.replace(/^ftps?:\/\//i, '').replace(/\/+$/, '');
const USER = process.env.HOSTINGER_FTP_USER;
const PASSWORD = process.env.HOSTINGER_FTP_PASSWORD;
const PORT = parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10);
const REMOTE_DIR = process.env.HOSTINGER_REMOTE_DIR || 'public_html';

async function deploy() {
  console.log('\n🚀 Starting Hostinger Deployment...');
  console.log('───────────────────────────────────────────────────────');

  // 1. Verify build output exists
  if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error('❌ Error: dist/index.html not found!');
    console.error('👉 Please run "npm run build" first before deploying.\n');
    process.exit(1);
  }

  // 2. Verify Hostinger FTP credentials
  if (!HOST || !USER || !PASSWORD) {
    console.error('❌ Missing Hostinger FTP credentials in .env file!\n');
    console.error('Please add the following to your .env file in Vishwam-Frontend:');
    console.error('───────────────────────────────────────────────────────');
    console.error('HOSTINGER_FTP_HOST=ftp.yourdomain.com  (or Hostinger IP)');
    console.error('HOSTINGER_FTP_USER=your_ftp_username');
    console.error('HOSTINGER_FTP_PASSWORD=your_ftp_password');
    console.error('HOSTINGER_REMOTE_DIR=public_html       (or domains/yourdomain.com/public_html)');
    console.error('───────────────────────────────────────────────────────');
    console.error('\n📍 Where to find these in Hostinger hPanel:');
    console.error('   1. Log into Hostinger hPanel');
    console.error('   2. Go to Websites -> Manage your site');
    console.error('   3. In sidebar, go to Files -> FTP Accounts');
    console.error('   4. Copy FTP IP / Hostname, Username, and Password.\n');
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = false; // Set to true if you need deep protocol logs

  try {
    console.log(`📡 Connecting to Hostinger FTP server (${HOST}:${PORT})...`);

    // Try secure FTPS first, gracefully fallback to standard FTP if needed
    try {
      await client.access({
        host: HOST,
        user: USER,
        password: PASSWORD,
        port: PORT,
        secure: true,
        secureOptions: { rejectUnauthorized: false },
      });
      console.log('🔒 Secure TLS (FTPS) connection established.');
    } catch (tlsErr) {
      console.warn('⚠️ TLS connection failed, falling back to standard FTP...');
      await client.access({
        host: HOST,
        user: USER,
        password: PASSWORD,
        port: PORT,
        secure: false,
      });
      console.log('🔗 Standard FTP connection established.');
    }

    // 3. Reset to root directory to avoid relative path nesting
    await client.cd('/');

    // 4. Resolve correct Hostinger remote directory
    let targetDir = (REMOTE_DIR || '').replace(/^\/+/, '').replace(/\/+$/, '');
    const rootList = await client.list('/');
    if (rootList.some((f) => f.name === 'domains')) {
      const domainsList = await client.list('/domains');
      const domainMatch = domainsList.find((d) => d.name === 'onevishwam.com') || domainsList[0];
      if (domainMatch && !targetDir.startsWith('domains/')) {
        targetDir = `domains/${domainMatch.name}/public_html`;
      }
    }

    console.log(`📂 Target remote directory: /${targetDir}`);
    await client.ensureDir(`/${targetDir}`);
    await client.cd(`/${targetDir}`);

    console.log(`📤 Uploading fresh build from "dist/" to "/${targetDir}"...`);
    await client.uploadFromDir(distDir);

    console.log('───────────────────────────────────────────────────────');
    console.log('✅ Deployment to Hostinger completed successfully!');
    console.log(`📁 Files are now live in Hostinger hPanel -> File Manager (/${targetDir})`);
    console.log('🌐 Check your live website: https://onevishwam.com\n');
  } catch (error) {
    console.error('\n❌ Hostinger deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();

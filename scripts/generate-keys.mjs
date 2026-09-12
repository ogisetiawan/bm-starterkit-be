// FILE: scripts/generate-keys.mjs
/**
 * Generate GATEWAY_API_KEY + INTERNAL_JWT RS256 keypair (PEM → base64).
 *
 * Usage:
 *   pnpm generate:keys           # print to stdout
 *   pnpm generate:keys --write   # upsert into .env
 */
import { generateKeyPairSync, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const writeToEnv = process.argv.includes('--write');
const envPath = resolve(process.cwd(), '.env');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const values = {
  GATEWAY_API_KEY: randomBytes(32).toString('hex'),
  INTERNAL_JWT_PRIVATE_KEY: Buffer.from(privateKey, 'utf8').toString('base64'),
  INTERNAL_JWT_PUBLIC_KEY: Buffer.from(publicKey, 'utf8').toString('base64'),
};

console.log('# Generated secrets — paste into .env (or use --write)\n');
for (const [key, value] of Object.entries(values)) {
  console.log(`${key}=${value}`);
}

if (!writeToEnv) {
  console.log('\nTip: pnpm generate:keys --write  → update .env automatically');
  process.exit(0);
}

let envContent = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
if (envContent.length > 0 && !envContent.endsWith('\n')) {
  envContent += '\n';
}

for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  if (pattern.test(envContent)) {
    envContent = envContent.replace(pattern, line);
  } else {
    envContent += `${line}\n`;
  }
}

writeFileSync(envPath, envContent, 'utf8');
console.log(`\nUpdated ${envPath}`);

import ora from 'ora';
import { runDeviceAuthFlow } from '../lib/device-auth.js';
import { setAccessToken, getConfig } from '../lib/config.js';

export async function loginCommand() {
  const config = getConfig();

  // Check if already logged in
  if (config.accessToken && config.user) {
    console.log('');
    console.log(`  ✓ Already authenticated as ${config.user.email}`);
    console.log(`  ─────────────────────────────────────────────`);
    console.log(`  To re-authenticate, run: codebuff login --force`);
    console.log('');
    return;
  }

  try {
    const result = await runDeviceAuthFlow();

    setAccessToken(result.accessToken, result.user);

    console.log('');
    console.log(`  ✓ Logged in as ${result.user.email}`);
    console.log('');
    console.log(`  Ready to use. Try:`);
    console.log(`    codebuff scan .`);
    console.log('');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`  ✗ ${message}`);
    console.log('');
    process.exit(1);
  }
}

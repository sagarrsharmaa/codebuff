import open from 'open';
import ora from 'ora';
import { getApiBaseUrl } from './config.js';

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  interval: number;
  expires_in: number;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface ErrorResponse {
  error: string;
}

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const apiBaseUrl = getApiBaseUrl();
  const res = await fetch(`${apiBaseUrl}/api/auth/device/code`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(`Failed to request device code: ${res.statusText}`);
  }

  return res.json();
}

export async function pollForToken(
  deviceCode: string,
  interval: number,
  onProgress?: (status: string) => void
): Promise<TokenResponse> {
  const apiBaseUrl = getApiBaseUrl();

  // Poll until we get a token or error out
  while (true) {
    await sleep(interval * 1000);

    const res = await fetch(`${apiBaseUrl}/api/auth/device/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_code: deviceCode }),
    });

    if (res.ok) {
      return res.json();
    }

    const errorData: ErrorResponse = await res.json();

    switch (errorData.error) {
      case 'authorization_pending':
        onProgress?.('pending');
        continue;
      case 'slow_down':
        interval += 1;
        onProgress?.('pending');
        continue;
      case 'access_denied':
        throw new Error('Authorization was denied.');
      case 'expired_token':
        throw new Error('Device code expired. Please run `codebuff login` again.');
      default:
        throw new Error(`Unexpected error: ${errorData.error}`);
    }
  }
}

export async function runDeviceAuthFlow(): Promise<{
  accessToken: string;
  user: { id: string; email: string; name: string | null };
}> {
  const spinner = ora('Connecting to Codebuff...').start();

  try {
    // Step 1: Request device code
    const deviceCodeResponse = await requestDeviceCode();
    spinner.stop();

    // Step 2: Open browser
    console.log('');
    console.log('  ┌─────────────────────────────────────────────┐');
    console.log('  │                                             │');
    console.log('  │   Your one-time code:                       │');
    console.log(`  │     ${deviceCodeResponse.user_code.padEnd(38)}│`);
    console.log('  │                                             │');
    console.log('  │   A browser window will open for you to     │');
    console.log('  │   sign in and authorize this CLI session.   │');
    console.log('  └─────────────────────────────────────────────┘');
    console.log('');

    // Try to open browser
    try {
      await open(deviceCodeResponse.verification_uri_complete);
    } catch {
      console.log(`  Open this URL in your browser:`);
      console.log(`  ${deviceCodeResponse.verification_uri_complete}`);
      console.log('');
    }

    // Step 3: Poll for token with spinner
    const pollSpinner = ora('Waiting for authorization...').start();

    try {
      const tokenResponse = await pollForToken(
        deviceCodeResponse.device_code,
        deviceCodeResponse.interval,
        () => {
          if (!pollSpinner.isSpinning) pollSpinner.start();
        }
      );

      pollSpinner.succeed('Authorization successful!');
      console.log('');

      return {
        accessToken: tokenResponse.access_token,
        user: tokenResponse.user,
      };
    } catch (err) {
      pollSpinner.fail('Authorization failed');
      throw err;
    }
  } catch (err) {
    spinner.fail('Login failed');
    throw err;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

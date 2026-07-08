import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const deviceCode = crypto.randomBytes(24).toString('hex');
    // Short, human-readable user code: 3 groups of 4 alphanumeric chars
    const userCode = generateUserCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const interval = 3; // poll every 3 seconds

    await prisma.deviceAuthorization.create({
      data: {
        deviceCode,
        userCode,
        status: 'pending',
        expiresAt,
      },
    });

    const verificationUri = `${process.env.SITE_URL || 'http://localhost:3000'}/device/confirm`;
    const verificationUriComplete = `${verificationUri}?user_code=${userCode}&device_code=${deviceCode}`;

    return NextResponse.json({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: verificationUri,
      verification_uri_complete: verificationUriComplete,
      interval,
      expires_in: 600,
    });
  } catch (err) {
    console.error('Device code error:', err);
    return NextResponse.json(
      { error: 'Failed to generate device code' },
      { status: 500 }
    );
  }
}

function generateUserCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

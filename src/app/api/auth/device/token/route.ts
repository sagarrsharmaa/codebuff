import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

function getJwtSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET environment variable is required for device auth');
  }
  return secret;
}

export async function POST(req: NextRequest) {
  try {
    const { device_code } = await req.json();

    if (!device_code) {
      return NextResponse.json(
        { error: 'device_code is required' },
        { status: 400 }
      );
    }

    const auth = await prisma.deviceAuthorization.findUnique({
      where: { deviceCode: device_code },
      include: { user: true },
    });

    if (!auth) {
      return NextResponse.json(
        { error: 'invalid_device_code' },
        { status: 400 }
      );
    }

    if (auth.expiresAt < new Date()) {
      await prisma.deviceAuthorization.update({
        where: { id: auth.id },
        data: { status: 'expired' },
      });
      return NextResponse.json(
        { error: 'expired_token' },
        { status: 400 }
      );
    }

    if (auth.status === 'pending') {
      return NextResponse.json(
        { error: 'authorization_pending' },
        { status: 400 }
      );
    }

    if (auth.status === 'denied') {
      return NextResponse.json(
        { error: 'access_denied' },
        { status: 400 }
      );
    }

    if (auth.status === 'authorized' && auth.user) {
      // Generate a short-lived access token for the CLI
      const accessToken = jwt.sign(
        {
          sub: auth.user.id,
          email: auth.user.email,
          name: auth.user.name,
          type: 'cli',
        },
        getJwtSecret(),
        { expiresIn: '30d' }
      );

      // Clean up used device auth
      await prisma.deviceAuthorization.delete({
        where: { id: auth.id },
      });

      return NextResponse.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 30 * 24 * 60 * 60, // 30 days in seconds
        user: {
          id: auth.user.id,
          email: auth.user.email,
          name: auth.user.name,
        },
      });
    }

    return NextResponse.json(
      { error: 'authorization_pending' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Device token error:', err);
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    );
  }
}

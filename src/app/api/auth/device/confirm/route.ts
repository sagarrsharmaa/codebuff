import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { device_code, action, userId } = await req.json();

    if (!device_code || !action || !userId) {
      return NextResponse.json(
        { error: 'device_code, action, and userId are required' },
        { status: 400 }
      );
    }

    if (action !== 'approve' && action !== 'deny') {
      return NextResponse.json(
        { error: 'action must be "approve" or "deny"' },
        { status: 400 }
      );
    }

    const auth = await prisma.deviceAuthorization.findUnique({
      where: { deviceCode: device_code },
    });

    if (!auth) {
      return NextResponse.json(
        { error: 'Invalid device code. Please try again.' },
        { status: 404 }
      );
    }

    if (auth.expiresAt < new Date()) {
      await prisma.deviceAuthorization.update({
        where: { id: auth.id },
        data: { status: 'expired' },
      });
      return NextResponse.json(
        { error: 'This code has expired. Please start over.' },
        { status: 400 }
      );
    }

    if (auth.status !== 'pending') {
      return NextResponse.json(
        { error: 'This code has already been processed.' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'authorized' : 'denied';

    await prisma.deviceAuthorization.update({
      where: { id: auth.id },
      data: {
        status: newStatus,
        userId: action === 'approve' ? userId : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: action === 'approve'
        ? 'Device authorized successfully! You can close this window.'
        : 'Authorization denied.',
    });
  } catch (err) {
    console.error('Device confirm error:', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

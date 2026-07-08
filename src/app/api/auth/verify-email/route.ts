import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return redirectWithMessage(
      '/login',
      'Missing verification parameters. Please try signing in to receive a new link.'
    );
  }

  try {
    // Find the verification token
    const storedToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    if (!storedToken) {
      return redirectWithMessage(
        '/login',
        'Invalid verification link. Please try signing in to receive a new one.'
      );
    }

    // Check if expired
    if (storedToken.expires < new Date()) {
      // Delete the expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token,
          },
        },
      });
      return redirectWithMessage(
        '/login',
        'Verification link has expired. Please sign in to receive a new one.'
      );
    }

    // Update user's emailVerified timestamp
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return redirectWithMessage(
        '/login',
        'User not found. Please sign up first.'
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    // Redirect to dashboard with success message
    const dashboardUrl = new URL('/dashboard', req.url);
    dashboardUrl.searchParams.set('verified', 'true');
    return NextResponse.redirect(dashboardUrl);
  } catch (err) {
    console.error('Verification error:', err);
    return redirectWithMessage(
      '/login',
      'Something went wrong. Please try signing in again.'
    );
  }
}

function redirectWithMessage(path: string, message: string) {
  const url = new URL(path, process.env.SITE_URL || 'http://localhost:3000');
  url.searchParams.set('verify_error', encodeURIComponent(message));
  return NextResponse.redirect(url);
}

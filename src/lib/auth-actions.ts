'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';

interface SignupResult {
  errors?: Record<string, string>;
  success?: boolean;
}

export async function signup(formData: FormData): Promise<SignupResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // Validation
  const errors: Record<string, string> = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { errors: { email: 'An account with this email already exists' } };
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  // Send welcome email (fire-and-forget — don't block signup)
  try {
    await sendWelcomeEmail(email, name);
  } catch (emailErr) {
    console.error('Welcome email failed:', emailErr);
  }

  // Create and send verification email
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
      },
    });

    await sendVerificationEmail(email, verificationToken);
  } catch (emailErr) {
    console.error('Verification email failed:', emailErr);
  }

  return { success: true };
}

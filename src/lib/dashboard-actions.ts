'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';

interface ActionResult {
  errors?: Record<string, string>;
  success?: boolean;
  message?: string;
}

export async function updateName(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { errors: { form: 'Not authenticated' } };
  }

  const name = formData.get('name') as string;

  if (!name || name.trim().length < 2) {
    return { errors: { name: 'Name must be at least 2 characters' } };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });
    return { success: true, message: 'Name updated successfully' };
  } catch {
    return { errors: { form: 'Failed to update name. Please try again.' } };
  }
}

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { errors: { form: 'Not authenticated' } };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const errors: Record<string, string> = {};

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required';
  }
  if (!newPassword || newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters';
  }
  if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.hashedPassword) {
      return { errors: { currentPassword: 'No password set. Use Google OAuth to sign in.' } };
    }

    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return { errors: { currentPassword: 'Current password is incorrect' } };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hashedPassword },
    });

    return { success: true, message: 'Password changed successfully' };
  } catch {
    return { errors: { form: 'Failed to change password. Please try again.' } };
  }
}

export async function deleteAccount(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { errors: { form: 'Not authenticated' } };
  }

  try {
    // Delete all related records first (cascade should handle this via Prisma schema)
    await prisma.account.deleteMany({ where: { userId: session.user.id } });
    await prisma.session.deleteMany({ where: { userId: session.user.id } });
    await prisma.subscription.deleteMany({ where: { userId: session.user.id } });
    await prisma.user.delete({ where: { id: session.user.id } });

    await signOut({ redirectTo: '/' });
    return { success: true };
  } catch {
    return { errors: { form: 'Failed to delete account. Please try again.' } };
  }
}

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
      subscription: true,
    },
  });

  if (!user) return null;

  const priceId = user.subscription?.stripePriceId;
  let planLabel = 'Free — Starter';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO_MONTHLY) planLabel = 'Pro — Monthly';
  else if (priceId === process.env.STRIPE_PRICE_ID_PRO_YEARLY) planLabel = 'Pro — Yearly';
  else if (priceId === process.env.STRIPE_PRICE_ID_STARTER_MONTHLY) planLabel = 'Starter — Monthly';
  else if (priceId === process.env.STRIPE_PRICE_ID_STARTER_YEARLY) planLabel = 'Starter — Yearly';

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
    hasPassword: !!user.hashedPassword,
    planLabel,
    accounts: user.accounts,
    subscription: user.subscription
      ? {
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
          stripePriceId: user.subscription.stripePriceId,
          stripeCustomerId: user.subscription.stripeCustomerId,
        }
      : null,
  };
}

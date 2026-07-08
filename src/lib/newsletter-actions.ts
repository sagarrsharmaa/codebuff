'use server';

import { prisma } from '@/lib/prisma';
import { sendNewsletterConfirmation } from '@/lib/email';

interface NewsletterResult {
  errors?: Record<string, string>;
  success?: boolean;
}

export async function subscribeToNewsletter(
  formData: FormData
): Promise<NewsletterResult> {
  const email = formData.get('email') as string;
  const source = (formData.get('source') as string) || 'landing-page-cta';

  // Validate
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { errors: { email: 'Please enter a valid email address' } };
  }

  try {
    // Check for duplicate
    const existing = await prisma.newsletterSignup.findUnique({
      where: { email },
    });

    if (existing) {
      // If already subscribed, still return success — no need to create a duplicate
      return { success: true };
    }

    // Create the newsletter signup
    await prisma.newsletterSignup.create({
      data: {
        email,
        source,
      },
    });

    // Send confirmation email (fire-and-forget — don't block on failure)
    try {
      await sendNewsletterConfirmation(email);
    } catch (emailErr) {
      // Log but don't fail the subscription
      console.error('Newsletter confirmation email failed:', emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error('Newsletter signup error:', err);
    return { errors: { form: 'Something went wrong. Please try again.' } };
  }
}

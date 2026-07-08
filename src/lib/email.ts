import 'server-only';
import { Resend } from 'resend';
import { renderWelcomeEmail } from '@/emails/welcome-email';
import { renderVerificationEmail } from '@/emails/verification-email';
import { renderNewsletterConfirmation } from '@/emails/newsletter-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Codebuff <hello@codebuff.ai>';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export async function sendWelcomeEmail(to: string, name: string | null) {
  const { html, subject } = renderWelcomeEmail(name, SITE_URL);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${SITE_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(to)}`;
  const { html, subject } = renderVerificationEmail(to, verifyUrl, SITE_URL);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendNewsletterConfirmation(to: string) {
  const { html, subject } = renderNewsletterConfirmation(SITE_URL);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send newsletter confirmation:', error);
    throw new Error(`Failed to send newsletter confirmation: ${error.message}`);
  }
}

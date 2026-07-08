'use server';

import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const PRICE_IDS: Record<string, { monthly: string; yearly: string }> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_ID_STARTER_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ID_STARTER_YEARLY || '',
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || '',
  },
};

export async function checkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    // Not logged in — redirect to signup, preserving the plan selection
    const plan = formData.get('plan') as string;
    const billing = formData.get('billing') as string;
    redirect(`/signup?redirect=/pricing&plan=${plan}&billing=${billing}`);
  }

  const plan = formData.get('plan') as string;       // 'starter' | 'pro'
  const billing = formData.get('billing') as string;  // 'monthly' | 'yearly'

  if (!plan || !billing || !PRICE_IDS[plan]) {
    throw new Error('Invalid plan or billing period');
  }

  const priceId = PRICE_IDS[plan][billing as 'monthly' | 'yearly'];
  if (!priceId) {
    throw new Error(`Price ID not configured for ${plan} ${billing}`);
  }

  // Get or create Stripe customer
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user) throw new Error('User not found');

  let customerId: string | undefined = user.subscription?.stripeCustomerId ?? undefined;

  if (!customerId) {
    // Create a new Stripe customer
    const stripe = getStripe();
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  // Create checkout session
  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: user.id },
    success_url: `${process.env.AUTH_URL || 'http://localhost:3000'}/dashboard/settings?checkout=success`,
    cancel_url: `${process.env.AUTH_URL || 'http://localhost:3000'}/pricing?checkout=canceled`,
  });

  if (!checkoutSession.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(checkoutSession.url);
}

export async function createBillingPortalAction() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user?.subscription?.stripeCustomerId) {
    throw new Error('No Stripe customer found. Subscribe to a plan first.');
  }

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${process.env.AUTH_URL || 'http://localhost:3000'}/dashboard/settings`,
  });

  redirect(portalSession.url);
}

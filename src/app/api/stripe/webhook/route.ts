export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

interface SubscriptionData {
  customer: string;
  id: string;
  status: string;
  items: { data: { price: { id: string } }[] };
  current_period_end: number;
}

// Map Stripe status strings to our enum
function mapStatus(
  status: string
): 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'TRIALING' | 'UNPAID' {
  switch (status) {
    case 'active':
      return 'ACTIVE';
    case 'canceled':
      return 'CANCELED';
    case 'past_due':
      return 'PAST_DUE';
    case 'incomplete':
      return 'INCOMPLETE';
    case 'incomplete_expired':
      return 'INCOMPLETE_EXPIRED';
    case 'trialing':
      return 'TRIALING';
    case 'unpaid':
      return 'UNPAID';
    default:
      return 'ACTIVE';
  }
}

async function handleSubscriptionEvent(subscription: SubscriptionData) {
  const customerId = subscription.customer;
  const stripeSubscriptionId = subscription.id;
  const status = mapStatus(subscription.status);
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: {
      subscription: { stripeCustomerId: customerId },
    },
  });

  if (user) {
    // Update existing subscription
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        stripeSubscriptionId,
        stripePriceId: priceId,
        status,
        currentPeriodEnd,
      },
    });
  } else {
    // Create new subscription — find user by metadata or customer email
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return;

    const userId = customer.metadata?.userId;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripeCustomerId: customerId,
          stripeSubscriptionId,
          stripePriceId: priceId,
          status,
          currentPeriodEnd,
        },
        create: {
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId,
          stripePriceId: priceId,
          status,
          currentPeriodEnd,
        },
      });
    }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = checkoutSession.subscription as string;

        if (subscriptionId) {
          // Retrieve the full subscription to get price + status
          const stripe = getStripe();
          const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as SubscriptionData;
          await handleSubscriptionEvent(fullSubscription);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const updatedSub = event.data.object as unknown as SubscriptionData;
        await handleSubscriptionEvent(updatedSub);
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as unknown as SubscriptionData;
        await handleSubscriptionEvent(deletedSub);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    // Return 200 so Stripe doesn't keep retrying, but log the error
  }

  return NextResponse.json({ received: true });
}

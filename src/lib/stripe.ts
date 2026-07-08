import 'server-only';
import Stripe from 'stripe';

function createStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key, {
    apiVersion: '2026-06-24.dahlia',
    typescript: true,
  });
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = createStripe();
  }
  return _stripe;
}

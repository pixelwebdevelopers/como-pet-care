import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Returns the client-side Stripe instance promise.
 * Reads NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from environment.
 */
export function getStripeClient(): Promise<Stripe | null> {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey || !publishableKey.startsWith('pk_')) {
    console.warn(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined or invalid. Please check your .env file.',
    );
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

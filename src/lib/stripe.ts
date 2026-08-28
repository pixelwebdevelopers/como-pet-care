import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

let stripeInstance: Stripe | null = null;

/**
 * Returns the server-side Stripe client singleton.
 * Throws an error if STRIPE_SECRET_KEY is not configured in .env.
 */
export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env file.',
      );
    }

    stripeInstance = new Stripe(stripeSecretKey, {
      typescript: true,
      appInfo: {
        name: 'Como Pet Care',
        version: '1.0.0',
      },
    });
  }

  return stripeInstance;
}

/**
 * Utility to check if Stripe is properly configured on the server
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_'));
}

import { NextResponse } from 'next/server';
import { getStripeServer, isStripeConfigured } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!isStripeConfigured()) {
      logger.warn('PaymentIntent creation attempted but Stripe is not configured in .env');
      return NextResponse.json(
        {
          success: false,
          error: 'STRIPE_NOT_CONFIGURED',
          message:
            'Stripe is not yet configured. Please set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.',
        },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { amount, customerDetails, bookingDetails } = body;

    // Validate amount
    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0.5) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_AMOUNT',
          message: 'A valid amount of at least $0.50 USD is required.',
        },
        { status: 400 },
      );
    }

    const amountInCents = Math.round(parsedAmount * 100);

    const stripe = getStripeServer();

    // Prepare customer & service details for Stripe metadata
    const customerName =
      customerDetails?.firstName || customerDetails?.lastName
        ? `${customerDetails.firstName || ''} ${customerDetails.lastName || ''}`.trim()
        : 'Guest Customer';

    const customerEmail = customerDetails?.email?.trim();
    const serviceName = bookingDetails?.serviceName || 'Pet Care Service';
    const planTitle = bookingDetails?.planTitle || '';
    const bookingDate = bookingDetails?.bookingDate || '';
    const petName = customerDetails?.petName || '';

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Como Pet Care: ${serviceName}${planTitle ? ` (${planTitle})` : ''} for ${customerName}`,
      receipt_email: customerEmail && customerEmail.includes('@') ? customerEmail : undefined,
      metadata: {
        customerName,
        customerEmail: customerEmail || 'N/A',
        customerPhone: customerDetails?.phone || 'N/A',
        petName: petName || 'N/A',
        serviceName,
        planTitle,
        bookingDate,
      },
    });

    logger.info(
      `Stripe PaymentIntent created: ${paymentIntent.id} for $${parsedAmount.toFixed(2)}`,
    );

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    });
  } catch (err: unknown) {
    logger.error('Failed to create Stripe PaymentIntent', err);
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      {
        success: false,
        error: 'PAYMENT_INTENT_FAILED',
        message: errorMessage,
      },
      { status: 500 },
    );
  }
}

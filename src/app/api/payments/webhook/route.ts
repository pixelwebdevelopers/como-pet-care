import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.warn('Stripe webhook received but STRIPE_WEBHOOK_SECRET is not configured.');
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    logger.error('Stripe webhook missing stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const stripe = getStripeServer();

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info(
          `Webhook: PaymentIntent ${paymentIntent.id} succeeded for $${(paymentIntent.amount / 100).toFixed(2)}`,
        );

        // Update transaction and booking if they exist
        const tx = await prisma.transaction.findUnique({
          where: { paymentIntentId: paymentIntent.id },
        });

        if (tx) {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: {
              status: 'SUCCEEDED',
              rawResponse: JSON.stringify(paymentIntent),
            },
          });
          await prisma.booking.update({
            where: { id: tx.bookingId },
            data: { paymentStatus: 'PAID' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.warn(
          `Webhook: PaymentIntent ${paymentIntent.id} failed. Reason: ${paymentIntent.last_payment_error?.message}`,
        );
        const tx = await prisma.transaction.findUnique({
          where: { paymentIntentId: paymentIntent.id },
        });
        if (tx) {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'FAILED' },
          });
          await prisma.booking.update({
            where: { id: tx.bookingId },
            data: { paymentStatus: 'UNPAID' },
          });
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
        if (paymentIntentId) {
          const tx = await prisma.transaction.findUnique({
            where: { paymentIntentId },
          });
          if (tx) {
            const refundedAmount = charge.amount_refunded / 100;
            const isFull = charge.refunded;
            await prisma.transaction.update({
              where: { id: tx.id },
              data: {
                status: isFull ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
                refundedAmount,
              },
            });
            await prisma.booking.update({
              where: { id: tx.bookingId },
              data: {
                paymentStatus: isFull ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
                status: isFull ? 'CANCELLED' : undefined,
              },
            });
          }
        }
        break;
      }

      default:
        logger.debug(`Unhandled Stripe webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown webhook error';
    logger.error(`Stripe webhook signature verification failed: ${errorMessage}`, err);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }
}

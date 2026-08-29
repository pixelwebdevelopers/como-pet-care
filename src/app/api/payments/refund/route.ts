import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getStripeServer, isStripeConfigured } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      transactionId,
      paymentIntentId,
      bookingReference,
      amount: requestedAmount,
      reason,
    } = body;

    if (!transactionId && !paymentIntentId && !bookingReference) {
      return NextResponse.json(
        {
          success: false,
          message: 'One of transactionId, paymentIntentId, or bookingReference is required.',
        },
        { status: 400 },
      );
    }

    // Find the transaction record
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          transactionId ? { id: parseInt(String(transactionId), 10) } : {},
          paymentIntentId ? { paymentIntentId: String(paymentIntentId) } : {},
          bookingReference
            ? {
                booking: {
                  reference: String(bookingReference),
                },
              }
            : {},
        ],
      },
      include: {
        booking: true,
        customer: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found.' },
        { status: 404 },
      );
    }

    const totalAmount = Number(transaction.amount);
    const alreadyRefunded = Number(transaction.refundedAmount || 0);
    const remainingRefundable = totalAmount - alreadyRefunded;

    if (remainingRefundable <= 0) {
      return NextResponse.json(
        { success: false, message: 'This transaction has already been fully refunded.' },
        { status: 400 },
      );
    }

    // Calculate refund amount
    const refundAmount = requestedAmount ? Math.min(Number(requestedAmount), remainingRefundable) : remainingRefundable;
    const isFullRefund = alreadyRefunded + refundAmount >= totalAmount;

    let refundId = `re_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // If live/test Stripe is configured and we have a valid stripe paymentIntentId (pi_...)
    if (isStripeConfigured() && transaction.paymentIntentId?.startsWith('pi_')) {
      try {
        const stripe = getStripeServer();
        const stripeRefund = await stripe.refunds.create({
          payment_intent: transaction.paymentIntentId,
          amount: Math.round(refundAmount * 100),
          reason: (reason as Stripe.RefundCreateParams.Reason) || 'requested_by_customer',
        });
        refundId = stripeRefund.id;
        logger.info(`Stripe refund executed successfully: ${refundId} for $${refundAmount.toFixed(2)}`);
      } catch (stripeErr: unknown) {
        const stripeMessage = stripeErr instanceof Error ? stripeErr.message : 'Stripe refund failed';
        logger.error('Stripe API error during refund', stripeErr);
        return NextResponse.json(
          { success: false, message: `Stripe refund error: ${stripeMessage}` },
          { status: 502 },
        );
      }
    } else {
      logger.info(`Simulated refund generated: ${refundId} for $${refundAmount.toFixed(2)}`);
    }

    const newRefundedTotal = alreadyRefunded + refundAmount;
    const newTransactionStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    const newPaymentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    // Update database inside transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedTx = await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: newTransactionStatus,
          refundedAmount: newRefundedTotal,
          refundId,
          refundReason: reason || 'Customer requested refund',
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id: transaction.bookingId },
        data: {
          paymentStatus: newPaymentStatus,
          status: isFullRefund ? 'CANCELLED' : transaction.booking.status,
        },
      });

      await tx.systemLog.create({
        data: {
          action: 'REFUND_ISSUED',
          details: `Refund of $${refundAmount.toFixed(2)} issued for booking ${transaction.booking.reference} (${newTransactionStatus}). Refund ID: ${refundId}. Reason: ${reason || 'N/A'}.`,
        },
      });

      return { updatedTx, updatedBooking };
    });

    return NextResponse.json({
      success: true,
      message: `Refund of $${refundAmount.toFixed(2)} processed successfully.`,
      refundId,
      refundedAmount: refundAmount,
      totalRefunded: newRefundedTotal,
      transactionStatus: updated.updatedTx.status,
      bookingStatus: updated.updatedBooking.status,
    });
  } catch (error: unknown) {
    logger.error('Error processing refund', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

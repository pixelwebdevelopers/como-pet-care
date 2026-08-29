import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { paymentIntentId: { contains: q } },
        { customer: { firstName: { contains: q } } },
        { customer: { lastName: { contains: q } } },
        { customer: { email: { contains: q } } },
        { booking: { reference: { contains: q } } },
        { booking: { serviceName: { contains: q } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        customer: true,
        booking: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const payments = transactions.map((t) => {
      let statusFormatted: 'paid' | 'pending' | 'failed' | 'refunded' = 'paid';
      if (t.status === 'REFUNDED') statusFormatted = 'refunded';
      else if (t.status === 'FAILED') statusFormatted = 'failed';
      else if (t.status === 'REQUIRES_CAPTURE') statusFormatted = 'pending';

      return {
        id: String(t.id),
        customerName: `${t.customer.firstName} ${t.customer.lastName}`,
        customerEmail: t.customer.email,
        bookingRef: t.booking.reference,
        service: t.booking.serviceName,
        amount: `$${Number(t.amount).toFixed(2)}`,
        refundedAmount: `$${Number(t.refundedAmount).toFixed(2)}`,
        paymentMethod: t.paymentMethod,
        paymentDate: t.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: statusFormatted,
        subscriptionIndicator: t.booking.walkFrequency ? 'Subscription' : 'One-Time',
        paymentIntentId: t.paymentIntentId,
      };
    });

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch admin payments', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
        { address: { contains: q } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        pets: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        transactions: {
          where: { status: 'SUCCEEDED' },
        },
        intakeProfiles: true,
        meetAndGreets: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const clients = customers.map((c) => {
      const totalSpent = c.transactions.reduce((acc, t) => acc + Number(t.amount), 0);
      const latestBooking = c.bookings[0];
      const hasCompletedIntake = c.intakeProfiles.length > 0;
      const latestMeetAndGreet = c.meetAndGreets[0];

      return {
        id: String(c.id),
        name: `${c.firstName} ${c.lastName}`,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone || 'N/A',
        address: `${c.address || ''}${c.city ? `, ${c.city}` : ''}${c.state ? `, ${c.state}` : ''}`,
        petsCount: c.pets.length,
        pets: c.pets.map((p) => p.name).join(', ') || 'None',
        totalSpent: `$${totalSpent.toFixed(2)}`,
        bookingsCount: c.bookings.length,
        upcomingBooking: latestBooking ? `${latestBooking.serviceName} (${latestBooking.bookingDate})` : 'No bookings yet',
        latestBookingRef: latestBooking?.reference || null,
        status: c.isNewCustomer ? 'new' : 'active',
        hasCompletedIntake,
        intakeStatus: hasCompletedIntake ? 'completed' : 'pending',
        meetAndGreetStatus: latestMeetAndGreet?.status || (c.isNewCustomer ? 'pending' : 'none'),
        createdAt: c.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      clients,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch admin clients', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

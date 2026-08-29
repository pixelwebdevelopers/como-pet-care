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
        { name: { contains: q } },
        { breed: { contains: q } },
        { type: { contains: q } },
        { customer: { firstName: { contains: q } } },
        { customer: { lastName: { contains: q } } },
      ];
    }

    const petsList = await prisma.pet.findMany({
      where,
      include: {
        customer: {
          include: {
            bookings: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const pets = petsList.map((p) => {
      const latestBooking = p.customer.bookings[0];
      return {
        id: String(p.id),
        name: p.name,
        type: p.type,
        breed: p.breed || 'Mixed Breed',
        age: p.age || 'Adult',
        isPuppy: p.isPuppy,
        ownerName: `${p.customer.firstName} ${p.customer.lastName}`,
        ownerEmail: p.customer.email,
        ownerPhone: p.customer.phone,
        careInstructions: p.careInstructions || p.temperamentNotes || 'No special notes',
        upcomingService: latestBooking ? `${latestBooking.serviceName} (${latestBooking.bookingDate})` : 'No upcoming visit',
        avatar: p.photoUrl || '',
      };
    });

    return NextResponse.json({
      success: true,
      pets,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch admin pets', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

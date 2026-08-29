import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        results: { bookings: [], clients: [], pets: [], services: [] },
      });
    }

    const [bookings, clients, pets, services] = await Promise.all([
      // 1. Search Bookings
      prisma.booking.findMany({
        where: {
          OR: [
            { reference: { contains: q } },
            { serviceName: { contains: q } },
            { planTitle: { contains: q } },
            { customer: { firstName: { contains: q } } },
            { customer: { lastName: { contains: q } } },
            { customer: { email: { contains: q } } },
          ],
        },
        include: {
          customer: {
            include: { pets: true },
          },
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // 2. Search Clients
      prisma.customer.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        include: {
          pets: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // 3. Search Pets
      prisma.pet.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { breed: { contains: q } },
            { type: { contains: q } },
            { customer: { firstName: { contains: q } } },
            { customer: { lastName: { contains: q } } },
          ],
        },
        include: {
          customer: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // 4. Search Services
      prisma.serviceConfiguration.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { serviceName: { contains: q } },
            { priceText: { contains: q } },
            { duration: { contains: q } },
          ],
        },
        take: 5,
        orderBy: { serviceId: 'asc' },
      }),
    ]);

    const formattedBookings = bookings.map((b) => ({
      id: String(b.id),
      title: `${b.reference} • ${b.serviceName}`,
      subtitle: `${b.customer.firstName} ${b.customer.lastName} • ${b.bookingDate}`,
      badge: b.status,
      type: 'bookings',
    }));

    const formattedClients = clients.map((c) => ({
      id: String(c.id),
      title: `${c.firstName} ${c.lastName}`,
      subtitle: `${c.email} • ${c.pets.length} ${c.pets.length === 1 ? 'pet' : 'pets'}`,
      badge: c.isNewCustomer ? 'New' : 'Client',
      type: 'clients',
    }));

    const formattedPets = pets.map((p) => ({
      id: String(p.id),
      title: `🐾 ${p.name}`,
      subtitle: `${p.breed || 'Mixed'} (${p.type}) • Owner: ${p.customer.firstName} ${p.customer.lastName}`,
      badge: p.type,
      type: 'pets',
    }));

    const formattedServices = services.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: `${s.serviceName} • ${s.duration}`,
      badge: s.priceText,
      type: 'services',
    }));

    const totalCount =
      formattedBookings.length +
      formattedClients.length +
      formattedPets.length +
      formattedServices.length;

    return NextResponse.json({
      success: true,
      totalCount,
      results: {
        bookings: formattedBookings,
        clients: formattedClients,
        pets: formattedPets,
        services: formattedServices,
      },
    });
  } catch (error: unknown) {
    logger.error('Global header search failed', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

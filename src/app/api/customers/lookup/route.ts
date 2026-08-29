import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email query parameter is required' },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { email },
      include: {
        pets: true,
        meetAndGreets: {
          where: { status: 'COMPLETED' },
        },
        intakeProfiles: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        exists: false,
        isReturning: false,
        hasCompletedMeetGreet: false,
        hasCompletedIntake: false,
      });
    }

    const hasCompletedMeetGreet = customer.meetAndGreets.length > 0;
    const hasCompletedIntake = customer.intakeProfiles.length > 0;
    const isReturning = !customer.isNewCustomer || customer.bookings.length > 0;

    return NextResponse.json({
      success: true,
      exists: true,
      isReturning,
      hasCompletedMeetGreet,
      hasCompletedIntake,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        isColumbiaResident: customer.isColumbiaResident,
        pets: customer.pets.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          breed: p.breed,
          age: p.age,
        })),
      },
    });
  } catch (error: unknown) {
    logger.error('Error during customer lookup', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

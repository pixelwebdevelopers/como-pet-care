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
      where.status = status;
    }

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
        { serviceName: { contains: query } },
      ];
    }

    const waitlist = await prisma.waitlistEntry.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      waitlist,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch waitlist entries', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      serviceName,
      serviceDuration,
      preferredDate,
      preferredTime,
      timePreference,
      notifyMethod,
      notes,
    } = body;

    if (!firstName || !email || !preferredDate || !serviceName) {
      return NextResponse.json(
        {
          success: false,
          message: 'First name, email, preferred date, and service are required to join the waitlist.',
        },
        { status: 400 },
      );
    }

    const entry = await prisma.waitlistEntry.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : null,
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        serviceName: serviceName.trim(),
        serviceDuration: serviceDuration || '30 Minutes',
        preferredDate: preferredDate.trim(),
        preferredTime: preferredTime || 'Any Available Time',
        timePreference: timePreference || 'specific',
        notifyMethod: notifyMethod || 'email_sms',
        status: 'waiting',
        notes: notes ? notes.trim() : null,
      },
    });

    // Record system log
    try {
      await prisma.systemLog.create({
        data: {
          action: 'WAITLIST_JOINED',
          details: `${entry.firstName} ${entry.lastName || ''} joined waitlist for ${entry.serviceName} on ${entry.preferredDate} (${entry.preferredTime})`,
        },
      });
    } catch {
      // safe to ignore
    }

    return NextResponse.json({
      success: true,
      id: entry.id,
      message: 'You have been added to the waitlist. We will notify you if an opening becomes available!',
    });
  } catch (error: unknown) {
    logger.error('Failed to submit waitlist entry', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Waitlist entry id and status are required.' },
        { status: 400 },
      );
    }

    const updated = await prisma.waitlistEntry.update({
      where: { id: parseInt(String(id), 10) },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      entry: updated,
    });
  } catch (error: unknown) {
    logger.error('Failed to update waitlist entry', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

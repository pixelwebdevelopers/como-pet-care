import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/mail';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, bookingId, bookingRef, customerId } = body;

    if (!type || (!bookingId && !bookingRef && !customerId)) {
      return NextResponse.json(
        { success: false, message: 'Missing required type or target identifier.' },
        { status: 400 },
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    // Resolve Customer & Booking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let booking: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let customer: any = null;

    if (bookingId || bookingRef) {
      booking = await prisma.booking.findFirst({
        where: bookingId ? { id: Number(bookingId) } : { reference: String(bookingRef) },
        include: {
          customer: {
            include: {
              pets: true,
            },
          },
          meetAndGreet: true,
        },
      });

      if (booking) {
        customer = booking.customer;
      }
    } else if (customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: Number(customerId) },
        include: {
          pets: true,
          bookings: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              meetAndGreet: true,
            },
          },
        },
      });

      if (customer && customer.bookings.length > 0) {
        booking = customer.bookings[0];
      }
    }

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Target client record was not found in the database.' },
        { status: 404 },
      );
    }

    const clientName = `${customer.firstName} ${customer.lastName}`.trim() || 'Valued Client';
    const clientEmail = customer.email;
    const petNames = customer.pets?.map((p: { name: string }) => p.name).join(', ') || 'your pet';
    const reference = booking ? booking.reference : `CPC-${new Date().getFullYear()}-INTAKE`;

    if (type === 'INTAKE_REMINDER') {
      const intakeUrl = `${baseUrl}/intake?ref=${encodeURIComponent(reference)}&email=${encodeURIComponent(clientEmail)}`;

      const html = emailTemplates.customerIntakeReminder({
        clientName,
        reference,
        petNames,
        intakeUrl,
      });

      const sendResult = await sendEmail({
        to: clientEmail,
        subject: `Action Required: Please Complete Your Pet Care Intake Form — CoMo Pet Care (${reference})`,
        html,
      });

      if (!sendResult.success) {
        logger.error('Failed to send intake reminder email:', sendResult.error);
      }

      // Record System Audit Log
      try {
        await prisma.systemLog.create({
          data: {
            action: 'REMINDER_SENT_INTAKE',
            details: `Sent intake form reminder with direct link to ${clientEmail} for reference ${reference}`,
          },
        });
      } catch (logErr) {
        logger.warn('Failed to record system audit log for intake reminder:', logErr);
      }

      return NextResponse.json({
        success: true,
        message: `Intake Form link successfully emailed to ${clientEmail}!`,
        intakeUrl,
      });
    }

    if (type === 'MEET_GREET_RESCHEDULE') {
      const rescheduleUrl = `${baseUrl}/booking?step=schedule&ref=${encodeURIComponent(reference)}`;
      const serviceName = booking ? booking.serviceName : 'Pet Care Service';

      // Update Meet & Greet record status if exists
      if (booking?.meetAndGreet) {
        try {
          await prisma.meetAndGreet.update({
            where: { id: booking.meetAndGreet.id },
            data: {
              status: 'RESCHEDULE_REQUESTED',
              notes: `Admin triggered Missed / Reschedule notice on ${new Date().toLocaleDateString()}`,
            },
          });
        } catch {
          // ignore if table lock
        }
      }

      const html = emailTemplates.customerMeetAndGreetMissed({
        clientName,
        reference,
        petNames,
        serviceName,
        rescheduleUrl,
      });

      const sendResult = await sendEmail({
        to: clientEmail,
        subject: `We Missed You! Let's Reschedule Your Meet & Greet — CoMo Pet Care (${reference})`,
        html,
      });

      if (!sendResult.success) {
        logger.error('Failed to send meet and greet missed email:', sendResult.error);
      }

      // Record System Audit Log
      try {
        await prisma.systemLog.create({
          data: {
            action: 'REMINDER_SENT_MEET_GREET',
            details: `Sent Missed Meet & Greet follow-up and reschedule link to ${clientEmail} for reference ${reference}`,
          },
        });
      } catch (logErr) {
        logger.warn('Failed to record system audit log for meet & greet reminder:', logErr);
      }

      return NextResponse.json({
        success: true,
        message: `Meet & Greet follow-up notice successfully emailed to ${clientEmail}!`,
        rescheduleUrl,
      });
    }

    return NextResponse.json(
      { success: false, message: `Unsupported reminder type: ${type}` },
      { status: 400 },
    );
  } catch (error) {
    logger.error('Error handling admin reminder request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while dispatching reminder notification.' },
      { status: 500 },
    );
  }
}

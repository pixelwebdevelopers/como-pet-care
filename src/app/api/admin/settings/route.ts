import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS = {
  id: 'default',
  businessName: 'CoMo Pet Care',
  businessEmail: 'info@comopetcare.com',
  businessPhone: '(555) 256-2648',
  businessAddress: '123 Main St, Columbia, MO 65201',
  businessHours: '7:00 AM - 7:00 PM',
  websiteUrl: 'https://comopetcare.com',
  serviceArea: 'Columbia metro area and surrounding county areas.',
  openingTime: '7:00 AM',
  closingTime: '7:00 PM',
  slotInterval: 30,
  enabledDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
  customSlots: JSON.stringify([
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
  ]),
  enabledSections: 'morning,afternoon,evening',
  adminNotificationEmail: 'info@comopetcare.com',
  sendCustomerConfirmation: true,
  sendAdminNotification: true,
  minAdvanceHours: 2,
  requireMeetAndGreet: true,
  cancellationPolicy: 'Cancellations made within 24 hours of appointment may incur a 50% cancellation fee.',
};

export async function GET() {
  try {
    let settings = await prisma.businessSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.businessSetting.create({
        data: DEFAULT_SETTINGS,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch business settings', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message, settings: DEFAULT_SETTINGS }, { status: 200 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.businessSetting.upsert({
      where: { id: 'default' },
      update: {
        businessName: body.businessName?.trim() || undefined,
        businessEmail: body.businessEmail?.trim() || undefined,
        businessPhone: body.businessPhone?.trim() || undefined,
        businessAddress: body.businessAddress?.trim() || undefined,
        businessHours: body.businessHours?.trim() || undefined,
        websiteUrl: body.websiteUrl?.trim() || undefined,
        serviceArea: body.serviceArea?.trim() || undefined,
        openingTime: body.openingTime || undefined,
        closingTime: body.closingTime || undefined,
        slotInterval: typeof body.slotInterval === 'number' ? body.slotInterval : undefined,
        enabledDays: body.enabledDays || undefined,
        customSlots: body.customSlots !== undefined ? (typeof body.customSlots === 'string' ? body.customSlots : JSON.stringify(body.customSlots)) : undefined,
        enabledSections: body.enabledSections || undefined,
        adminNotificationEmail: body.adminNotificationEmail?.trim() || undefined,
        sendCustomerConfirmation: typeof body.sendCustomerConfirmation === 'boolean' ? body.sendCustomerConfirmation : undefined,
        sendAdminNotification: typeof body.sendAdminNotification === 'boolean' ? body.sendAdminNotification : undefined,
        minAdvanceHours: typeof body.minAdvanceHours === 'number' ? body.minAdvanceHours : undefined,
        requireMeetAndGreet: typeof body.requireMeetAndGreet === 'boolean' ? body.requireMeetAndGreet : undefined,
        cancellationPolicy: body.cancellationPolicy !== undefined ? body.cancellationPolicy : undefined,
      },
      create: {
        ...DEFAULT_SETTINGS,
        ...body,
        customSlots: body.customSlots ? (typeof body.customSlots === 'string' ? body.customSlots : JSON.stringify(body.customSlots)) : DEFAULT_SETTINGS.customSlots,
      },
    });

    // Record system log
    try {
      await prisma.systemLog.create({
        data: {
          action: 'SETTINGS_UPDATED',
          details: `Business settings updated by admin. Operating hours: ${updated.openingTime} - ${updated.closingTime}. Sections: ${updated.enabledSections}.`,
        },
      });
    } catch {
      // safe to ignore
    }

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error: unknown) {
    logger.error('Failed to update business settings', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

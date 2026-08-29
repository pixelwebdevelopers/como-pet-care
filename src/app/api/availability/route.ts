import { NextResponse } from 'next/server';
import { calculateSlotsAvailability } from '@/lib/availability';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const DEFAULT_SLOTS = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '10:00 PM',
  '11:00 PM',
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId') || '2';
    const planId = searchParams.get('planId') || 'drop_in_30';
    const slotsParam = searchParams.get('slots');

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date parameter is required.' },
        { status: 400 },
      );
    }

    const candidateSlots = slotsParam
      ? slotsParam.split(',').map((s) => s.trim())
      : DEFAULT_SLOTS;

    const result = await calculateSlotsAvailability(date, serviceId, planId, candidateSlots);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    logger.error('Failed to compute slot availability', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

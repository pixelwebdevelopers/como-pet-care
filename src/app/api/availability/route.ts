import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  calculateSlotsAvailability,
  parseTimeToMinutes,
  formatMinutesToTime,
} from '@/lib/availability';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

function generateSlotsBetween(start: string, end: string, interval: number): string[] {
  const startM = parseTimeToMinutes(start);
  const endM = parseTimeToMinutes(end);
  if (endM <= startM) return [start];

  const slots: string[] = [];
  for (let m = startM; m <= endM; m += interval) {
    slots.push(formatMinutesToTime(m));
  }
  return slots;
}

function matchesEnabledSections(slot: string, enabledSections: string[]): boolean {
  if (!enabledSections || enabledSections.length === 0) return true;

  const isMorning = slot.includes('AM');
  const isAfternoon =
    slot.includes('PM') &&
    (slot.startsWith('12:') || ['1:', '2:', '3:', '4:'].some((h) => slot.startsWith(h)));
  const isEvening = slot.includes('PM') && !isAfternoon;

  if (isMorning && enabledSections.includes('morning')) return true;
  if (isAfternoon && enabledSections.includes('afternoon')) return true;
  if (isEvening && enabledSections.includes('evening')) return true;

  return false;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId') || '2';
    const planId = searchParams.get('planId') || 'drop_in_30';
    const slotsParam = searchParams.get('slots');

    // 1. Fetch active business settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let settings: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      settings = await (prisma as any).businessSetting.findUnique({
        where: { id: 'default' },
      });
    } catch {
      // safe fallback
    }

    const openingTime = settings?.openingTime || '7:00 AM';
    const closingTime = settings?.closingTime || '7:00 PM';
    const slotInterval = settings?.slotInterval || 30;
    const enabledSections = settings?.enabledSections
      ? settings.enabledSections.split(',').map((s: string) => s.trim().toLowerCase())
      : ['morning', 'afternoon', 'evening'];
    const enabledDays = settings?.enabledDays
      ? settings.enabledDays.split(',').map((d: string) => d.trim())
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let candidateSlots: string[] = [];

    if (slotsParam) {
      candidateSlots = slotsParam.split(',').map((s) => s.trim());
    } else if (settings?.customSlots) {
      try {
        const parsed = JSON.parse(settings.customSlots);
        if (Array.isArray(parsed) && parsed.length > 0) {
          candidateSlots = parsed;
        }
      } catch {
        candidateSlots = generateSlotsBetween(openingTime, closingTime, slotInterval);
      }
    } else {
      candidateSlots = generateSlotsBetween(openingTime, closingTime, slotInterval);
    }

    // Filter candidate slots by admin-enabled sections
    const filteredSlots = candidateSlots.filter((slot) =>
      matchesEnabledSections(slot, enabledSections),
    );

    // If date is not provided, return settings & slots configuration
    if (!date) {
      return NextResponse.json({
        success: true,
        candidateSlots: filteredSlots,
        enabledSections,
        enabledDays,
        openingTime,
        closingTime,
        minAdvanceHours: settings?.minAdvanceHours ?? 2,
      });
    }

    const result = await calculateSlotsAvailability(date, serviceId, planId, filteredSlots);

    return NextResponse.json({
      success: true,
      ...result,
      enabledSections,
      enabledDays,
      openingTime,
      closingTime,
      minAdvanceHours: settings?.minAdvanceHours ?? 2,
    });
  } catch (error: unknown) {
    logger.error('Failed to compute slot availability', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

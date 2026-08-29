import prisma from './prisma';

export interface BookedInterval {
  startMinutes: number;
  endMinutes: number;
  startTime: string;
  endTime: string;
  serviceName: string;
  reference?: string;
  isRecurring: boolean;
}

export interface SlotAvailability {
  time: string;
  available: boolean;
  reason?: string;
}

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Converts standard time strings (e.g. "9:00 AM", "1:30 PM", "09:00") to minutes from midnight
 */
export function parseTimeToMinutes(timeStr?: string | null): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight back into a friendly 12-hour format string (e.g. 540 -> "9:00 AM")
 */
export function formatMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  const minStr = String(minutes).padStart(2, '0');
  return `${hours}:${minStr} ${meridiem}`;
}

/**
 * Robust date parser supporting "August 10, 2026", "2026-08-10", etc.
 */
export function parseDateString(dateStr?: string | null): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Try direct Date constructor
  const parsedDirect = new Date(trimmed);
  if (!isNaN(parsedDirect.getTime())) {
    return parsedDirect;
  }

  // Parse "August 10, 2026" or "Thursday, August 10, 2026"
  const cleanStr = trimmed.replace(/,/g, '').toLowerCase();
  const parts = cleanStr.split(/\s+/);

  let monthIdx = -1;
  let day = -1;
  let year = -1;

  for (const part of parts) {
    const mIdx = MONTH_NAMES.indexOf(part);
    if (mIdx !== -1) {
      monthIdx = mIdx;
      continue;
    }
    const num = parseInt(part, 10);
    if (!isNaN(num)) {
      if (num > 1000) {
        year = num;
      } else if (num >= 1 && num <= 31 && day === -1) {
        day = num;
      }
    }
  }

  if (monthIdx !== -1 && day !== -1) {
    const finalYear = year !== -1 ? year : new Date().getFullYear();
    return new Date(finalYear, monthIdx, day);
  }

  return null;
}

/**
 * Gets day of week name (e.g. "Monday") for a given date
 */
export function getWeekdayName(date: Date): string {
  return WEEKDAY_NAMES[date.getDay()];
}

/**
 * Normalizes date into a consistent "Month Day, Year" or "YYYY-MM-DD" comparison key
 */
export function normalizeDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Resolves standard duration in minutes based on service, plan, and selected times
 */
export function resolveServiceDuration(
  serviceId: string,
  planId?: string | null,
  startTime?: string | null,
  endTime?: string | null,
): number {
  // If explicit start and end time provided and valid
  if (startTime && endTime) {
    const startM = parseTimeToMinutes(startTime);
    const endM = parseTimeToMinutes(endTime);
    if (endM > startM) {
      return endM - startM;
    }
  }

  // Pet sitting companion visits
  if (serviceId === '3') {
    if (planId === 'sitting_half_day') return 240; // 4 hours
    if (planId === 'sitting_full_day') return 480; // 8 hours
    if (planId === 'sitting_overnight') return 1440; // overnight stay
  }

  // 60-minute plans
  if (
    planId?.includes('60') ||
    planId === 'drop_in_60' ||
    planId?.startsWith('walk_60')
  ) {
    return 60;
  }

  // 30-minute default for Drop-In Visits, Dog Walking, Poop Scooping, Meet & Greet
  return 30;
}

/**
 * Checks if two half-open time intervals [startA, endA) and [startB, endB) overlap
 */
export function isIntervalOverlapping(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Retrieves all occupied time intervals for a given date from the database:
 * 1. Single-day bookings scheduled on that date
 * 2. Active recurring bookings covering that date's weekday
 * 3. Meet & Greet appointments scheduled on that date
 * NOTE: Overnight stays (sitting_overnight) are excluded as requested.
 */
export async function getBookedIntervalsForDate(dateStr: string): Promise<BookedInterval[]> {
  const targetDate = parseDateString(dateStr);
  if (!targetDate) return [];

  const targetWeekday = getWeekdayName(targetDate);
  const targetNormalizedKey = normalizeDateKey(targetDate);

  const bookedIntervals: BookedInterval[] = [];

  // Query all non-cancelled bookings
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        notIn: ['CANCELLED'],
      },
    },
    select: {
      id: true,
      reference: true,
      serviceId: true,
      serviceName: true,
      planTitle: true,
      bookingDate: true,
      bookingEndDate: true,
      startTime: true,
      endTime: true,
      walkFrequency: true,
      preferredWeekdays: true,
      status: true,
    },
  });

  for (const b of bookings) {
    // Exclude overnight stays from daytime 30/60 min slot collision
    const isOvernight =
      b.serviceId === '3' &&
      (b.planTitle?.toLowerCase().includes('overnight') ||
        b.bookingEndDate !== null);

    if (isOvernight) {
      continue;
    }

    const hasStartTime = Boolean(b.startTime);
    const startM = parseTimeToMinutes(b.startTime);
    let duration = resolveServiceDuration(b.serviceId, null, b.startTime, b.endTime);
    let endM = b.endTime ? parseTimeToMinutes(b.endTime) : startM + duration;
    if (endM <= startM) endM = startM + duration;

    // Check A: Single-date match
    const bDate = parseDateString(b.bookingDate);
    const isDateMatch = bDate ? normalizeDateKey(bDate) === targetNormalizedKey : false;

    // Check B: Recurring weekday match
    const isRecurring = Boolean(
      b.preferredWeekdays &&
        (b.walkFrequency || b.serviceId === '4' || b.serviceId === '5'),
    );

    let isWeekdayMatch = false;
    if (isRecurring && b.preferredWeekdays) {
      const weekdaysList = b.preferredWeekdays
        .toLowerCase()
        .split(/[,\s]+/)
        .map((w) => w.trim());
      isWeekdayMatch = weekdaysList.includes(targetWeekday.toLowerCase());
    }

    if (isDateMatch || isWeekdayMatch) {
      if (hasStartTime) {
        bookedIntervals.push({
          startMinutes: startM,
          endMinutes: endM,
          startTime: b.startTime || formatMinutesToTime(startM),
          endTime: b.endTime || formatMinutesToTime(endM),
          serviceName: b.serviceName,
          reference: b.reference,
          isRecurring: isWeekdayMatch && !isDateMatch,
        });
      }
    }
  }

  // Also query scheduled Meet & Greet appointments
  const meetAndGreets = await prisma.meetAndGreet.findMany({
    where: {
      status: {
        in: ['SCHEDULED'],
      },
    },
    select: {
      id: true,
      date: true,
      time: true,
      booking: {
        select: { reference: true },
      },
    },
  });

  for (const mg of meetAndGreets) {
    const mgDate = parseDateString(mg.date);
    if (mgDate && normalizeDateKey(mgDate) === targetNormalizedKey) {
      const startM = parseTimeToMinutes(mg.time);
      const duration = 30; // 30-minute meet & greet visit
      const endM = startM + duration;

      bookedIntervals.push({
        startMinutes: startM,
        endMinutes: endM,
        startTime: mg.time,
        endTime: formatMinutesToTime(endM),
        serviceName: 'Meet & Greet',
        reference: mg.booking?.reference,
        isRecurring: false,
      });
    }
  }

  return bookedIntervals;
}

/**
 * Calculates slot availability for a list of candidate times on a specific date.
 * If a candidate slot of duration D overlaps with any booked interval, it is flagged unavailable.
 */
export async function calculateSlotsAvailability(
  dateStr: string,
  serviceId: string,
  planId: string,
  candidateSlots: string[],
): Promise<{
  date: string;
  weekday: string;
  slotDuration: number;
  slots: SlotAvailability[];
  bookedIntervals: BookedInterval[];
}> {
  const targetDate = parseDateString(dateStr) || new Date();
  const weekday = getWeekdayName(targetDate);
  const slotDuration = resolveServiceDuration(serviceId, planId);

  // If service is overnight stay, daytime slot collision is exempt
  const isOvernight = serviceId === '3' && planId?.includes('overnight');
  if (isOvernight) {
    return {
      date: dateStr,
      weekday,
      slotDuration,
      slots: candidateSlots.map((time) => ({ time, available: true })),
      bookedIntervals: [],
    };
  }

  const bookedIntervals = await getBookedIntervalsForDate(dateStr);

  const slots: SlotAvailability[] = candidateSlots.map((time) => {
    const slotStart = parseTimeToMinutes(time);
    const slotEnd = slotStart + slotDuration;

    // Check collision against all booked intervals
    const collidingBooking = bookedIntervals.find((interval) =>
      isIntervalOverlapping(slotStart, slotEnd, interval.startMinutes, interval.endMinutes),
    );

    if (collidingBooking) {
      return {
        time,
        available: false,
        reason: `Unavailable: Collides with booked ${collidingBooking.serviceName} (${collidingBooking.startTime} - ${collidingBooking.endTime})`,
      };
    }

    return {
      time,
      available: true,
    };
  });

  return {
    date: dateStr,
    weekday,
    slotDuration,
    slots,
    bookedIntervals,
  };
}

/**
 * Centralized Pricing Calculator for CoMo Pet Care
 * Ensures accurate, deterministic bills for every service, plan, and customer options.
 */

export interface PricingInput {
  serviceId: string;
  serviceName: string;
  planId?: string;
  planTitle?: string;
  bookingDate?: string;
  bookingEndDate?: string;
  walkFrequency?: string; // e.g. "3 Walk Per Week"
  additionalPetsCount?: number;
  puppiesCount?: number;
  basePriceOverride?: number;
}

export interface PricingBreakdown {
  numberOfDays: number;
  durationLabel: string;
  baseRatePerUnit: number;
  basePrice: number;
  additionalPetFee: number;
  additionalPetFeePerPet: number;
  puppySurcharge: number;
  holidaySurcharge: number;
  holidayName?: string;
  totalPrice: number;
}

// Known US Federal Holidays helper
const US_HOLIDAYS_2026: Record<string, string> = {
  '1/1/2026': "New Year's Day",
  '5/25/2026': 'Memorial Day',
  '7/4/2026': 'Independence Day',
  '9/7/2026': 'Labor Day',
  '11/26/2026': 'Thanksgiving Day',
  '12/25/2026': 'Christmas Day',
};

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

/**
 * Checks if a date string falls on an official US Holiday
 */
export function checkHoliday(dateStr?: string): { isHoliday: boolean; holidayName?: string } {
  if (!dateStr) return { isHoliday: false };

  try {
    const clean = dateStr.replace(/,/g, '').toLowerCase().trim();
    const parts = clean.split(/\s+/);

    let month = -1;
    let day = -1;
    let year = 2026;

    for (const p of parts) {
      const mIdx = MONTH_NAMES.indexOf(p);
      if (mIdx !== -1) {
        month = mIdx + 1;
        continue;
      }
      const num = parseInt(p, 10);
      if (!isNaN(num)) {
        if (num > 31) {
          year = num;
        } else if (day === -1) {
          day = num;
        }
      }
    }

    if (month !== -1 && day !== -1) {
      const key = `${month}/${day}/${year}`;
      if (US_HOLIDAYS_2026[key]) {
        return { isHoliday: true, holidayName: US_HOLIDAYS_2026[key] };
      }
    }
  } catch {
    // safe fallback
  }

  return { isHoliday: false };
}

/**
 * Parses day difference between arrival and departure dates for overnight stays
 */
export function calculateDaysBetween(startDateStr?: string, endDateStr?: string): number {
  if (!startDateStr || !endDateStr) return 1;

  try {
    const cleanStart = startDateStr.replace(/,/g, '').toLowerCase().trim();
    const cleanEnd = endDateStr.replace(/,/g, '').toLowerCase().trim();

    const partsStart = cleanStart.split(/\s+/);
    const partsEnd = cleanEnd.split(/\s+/);

    const getDayAndMonth = (parts: string[]) => {
      let m = -1;
      let d = -1;
      let y = 2026;
      for (const p of parts) {
        const mIdx = MONTH_NAMES.indexOf(p);
        if (mIdx !== -1) {
          m = mIdx;
          continue;
        }
        const num = parseInt(p, 10);
        if (!isNaN(num)) {
          if (num > 31) y = num;
          else if (d === -1) d = num;
        }
      }
      return { m, d, y };
    };

    const s = getDayAndMonth(partsStart);
    const e = getDayAndMonth(partsEnd);

    if (s.m !== -1 && s.d !== -1 && e.m !== -1 && e.d !== -1) {
      const dStart = new Date(s.y, s.m, s.d);
      const dEnd = new Date(e.y, e.m, e.d);
      const diffMs = dEnd.getTime() - dStart.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    }
  } catch {
    // safe fallback
  }

  return 1;
}

/**
 * Main pricing engine for all CoMo Pet Care bookings
 */
export function calculateBookingBill(input: PricingInput): PricingBreakdown {
  const {
    serviceId,
    planId = '',
    bookingDate,
    bookingEndDate,
    walkFrequency = '1 Walk Per Week',
    additionalPetsCount = 0,
    puppiesCount = 0,
    basePriceOverride,
  } = input;

  const isOvernight =
    serviceId === '3' && (planId === 'sitting_overnight' || Boolean(bookingEndDate));

  const isRecurringWalk =
    serviceId === '4' &&
    (planId.includes('weekly') || planId.includes('monthly') || planId.includes('annual'));

  const isRecurringScoop = serviceId === '5' && !planId.includes('onetime');

  // 1. Calculate Number of Days / Units
  let numberOfDays = 1;
  let durationLabel = '1 Visit';

  if (isOvernight) {
    numberOfDays = calculateDaysBetween(bookingDate, bookingEndDate);
    durationLabel = `${numberOfDays} ${numberOfDays === 1 ? 'Night' : 'Nights'}`;
  } else if (isRecurringWalk) {
    const freqMatch = walkFrequency.match(/(\d+)/);
    const walksPerWeek = freqMatch ? parseInt(freqMatch[1], 10) : 1;
    if (planId.includes('weekly')) {
      numberOfDays = walksPerWeek;
      durationLabel = `${walksPerWeek} Walks / Week`;
    } else if (planId.includes('monthly')) {
      numberOfDays = walksPerWeek * 4;
      durationLabel = `Monthly Plan (~${walksPerWeek * 4} walks)`;
    } else {
      numberOfDays = walksPerWeek * 52;
      durationLabel = `Annual Plan (~${walksPerWeek * 52} walks)`;
    }
  } else if (isRecurringScoop) {
    if (planId.includes('weekly')) {
      durationLabel = 'Weekly Cleanup Plan';
    } else if (planId.includes('monthly')) {
      durationLabel = 'Monthly Cleanup Plan';
    } else {
      durationLabel = 'Annual Cleanup Plan';
    }
  } else if (serviceId === '4') {
    durationLabel = '1 Walk';
  } else if (serviceId === '5') {
    durationLabel = '1 Cleanup';
  } else if (serviceId === '3') {
    durationLabel = '1 Day Companion Visit';
  }

  // 2. Base Price Determination
  let baseRatePerUnit = 34; // default standard 30-min visit
  let totalPriceBase = 34;

  if (basePriceOverride && basePriceOverride > 0) {
    baseRatePerUnit = basePriceOverride;
    totalPriceBase = isOvernight ? basePriceOverride * numberOfDays : basePriceOverride;
  } else {
    switch (planId) {
      // Drop-In Visits
      case 'drop_in_30':
        baseRatePerUnit = 34;
        totalPriceBase = 34;
        break;
      case 'drop_in_60':
        baseRatePerUnit = 44;
        totalPriceBase = 44;
        break;

      // Pet Sitting
      case 'sitting_half_day':
        baseRatePerUnit = 69;
        totalPriceBase = 69;
        break;
      case 'sitting_full_day':
        baseRatePerUnit = 99;
        totalPriceBase = 99;
        break;
      case 'sitting_overnight':
        baseRatePerUnit = 119;
        totalPriceBase = 119 * numberOfDays;
        break;

      // Dog Walking - 30 min
      case 'walk_30_onetime':
        baseRatePerUnit = 34;
        totalPriceBase = 34;
        break;
      case 'walk_30_weekly': {
        const walksCount = numberOfDays;
        baseRatePerUnit = 29;
        totalPriceBase = 29 * walksCount;
        break;
      }
      case 'walk_30_monthly':
        baseRatePerUnit = 104;
        totalPriceBase = 104;
        break;
      case 'walk_30_annual':
        baseRatePerUnit = 1149;
        totalPriceBase = 1149;
        break;

      // Dog Walking - 60 min
      case 'walk_60_onetime':
        baseRatePerUnit = 44;
        totalPriceBase = 44;
        break;
      case 'walk_60_weekly': {
        const walksCount = numberOfDays;
        baseRatePerUnit = 39;
        totalPriceBase = 39 * walksCount;
        break;
      }
      case 'walk_60_monthly':
        baseRatePerUnit = 144;
        totalPriceBase = 144;
        break;
      case 'walk_60_annual':
        baseRatePerUnit = 1549;
        totalPriceBase = 1549;
        break;

      // Yard Poop Scooping
      case 'scoop_onetime':
        baseRatePerUnit = 65;
        totalPriceBase = 65;
        break;
      case 'scoop_weekly':
        baseRatePerUnit = 29;
        totalPriceBase = 29;
        break;
      case 'scoop_monthly':
        baseRatePerUnit = 104;
        totalPriceBase = 104;
        break;
      case 'scoop_annual':
        baseRatePerUnit = 1054;
        totalPriceBase = 1054;
        break;

      default:
        if (serviceId === '2') {
          baseRatePerUnit = 34;
          totalPriceBase = 34;
        } else if (serviceId === '3') {
          baseRatePerUnit = 69;
          totalPriceBase = 69;
        } else if (serviceId === '4') {
          baseRatePerUnit = 34;
          totalPriceBase = 34;
        } else if (serviceId === '5') {
          baseRatePerUnit = 65;
          totalPriceBase = 65;
        }
        break;
    }
  }

  // 3. Additional Pet Fees
  // Rate: $10 per additional pet for visits/walks/scoop; $20/day for overnight sitting
  let additionalPetFeePerPet = 10;
  if (isOvernight) {
    additionalPetFeePerPet = 15 * numberOfDays;
  } else if (serviceId === '3') {
    additionalPetFeePerPet = 15;
  }

  const additionalPetFee =
    additionalPetsCount > 0 ? additionalPetsCount * additionalPetFeePerPet : 0;

  // 4. Puppy Surcharge
  // Extra care requirement: $15 flat per puppy
  const puppySurcharge = puppiesCount > 0 ? puppiesCount * 15 : 0;

  // 5. Holiday Surcharge
  // Checks if booking date falls on an official recognized US holiday
  const holidayCheck = checkHoliday(bookingDate);
  const holidaySurcharge = holidayCheck.isHoliday ? 20 : 0;

  // 6. Total Price
  const totalPrice = totalPriceBase + additionalPetFee + puppySurcharge + holidaySurcharge;

  return {
    numberOfDays,
    durationLabel,
    baseRatePerUnit,
    basePrice: totalPriceBase,
    additionalPetFee,
    additionalPetFeePerPet,
    puppySurcharge,
    holidaySurcharge,
    holidayName: holidayCheck.holidayName,
    totalPrice,
  };
}

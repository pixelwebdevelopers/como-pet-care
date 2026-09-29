import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { parseDateString, normalizeDateKey, parseTimeToMinutes } from '@/lib/availability';

export const dynamic = 'force-dynamic';

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 min ago';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours === 1) return '1 hr ago';
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

function formatBookingDuration(b: any): string {
  if (b.serviceId === '3' || b.serviceName?.toLowerCase().includes('sitting') || b.planTitle?.toLowerCase().includes('overnight')) {
    const days = b.numberOfDays || 1;
    return `Overnight (${days} ${days === 1 ? 'Night' : 'Nights'})`;
  }
  if (b.bookingEndDate && b.numberOfDays > 1) {
    return `${b.numberOfDays} Days`;
  }
  if (b.serviceId === '2' || b.planTitle?.includes('60')) {
    return '60 min';
  }
  return '30 min';
}

export async function GET() {
  try {
    const today = new Date();
    const todayNormalized = normalizeDateKey(today);

    // 1. Metrics aggregation
    const [
      activeClientsCount,
      activePetsCount,
      allBookings,
      revenueResult,
      systemLogs,
      recentCustomers,
      dbWaitlistEntries,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.pet.count(),
      prisma.booking.findMany({
        where: {
          status: { notIn: ['CANCELLED'] },
        },
        include: {
          customer: {
            include: {
              pets: { take: 1 },
            },
          },
          meetAndGreet: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.transaction.aggregate({
        where: {
          status: 'SUCCEEDED',
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.systemLog.findMany({
        take: 6,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.customer.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          pets: true,
        },
      }),
      prisma.waitlistEntry.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0;

    // Filter today's bookings
    const bookingsTodayList = allBookings
      .filter((b) => {
        const parsed = parseDateString(b.bookingDate);
        return parsed ? normalizeDateKey(parsed) === todayNormalized : false;
      })
      .sort((a, b) => {
        const startA = parseTimeToMinutes(a.startTime);
        const startB = parseTimeToMinutes(b.startTime);
        return startA - startB;
      });

    const bookingsTodayCount = bookingsTodayList.length;

    // Calculate visits for the current calendar week (Sunday - Saturday)
    const currentDayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const visitsThisWeekCount = allBookings.filter((b) => {
      const parsed = parseDateString(b.bookingDate);
      if (!parsed) return false;
      return parsed >= startOfWeek && parsed <= endOfWeek;
    }).length;

    // 2. Transform Today's Schedule (Only actual bookings scheduled for today)
    const todaySchedule = bookingsTodayList.map((b) => {
      const pet = b.customer?.pets?.[0];
      let statusFormatted: 'Confirmed' | 'Pending' | 'In Progress' = 'Confirmed';
      if (b.status === 'PENDING_MEET_GREET' || b.status === 'PENDING') {
        statusFormatted = 'Pending';
      } else if (b.status === 'IN_PROGRESS') {
        statusFormatted = 'In Progress';
      }

      return {
        id: String(b.id),
        time: b.startTime || '9:00 AM',
        service: b.serviceName,
        duration: formatBookingDuration(b),
        provider: {
          name: `${b.customer.firstName} ${b.customer.lastName}`,
          role: b.isNewCustomer ? 'New Client' : 'Returning Client',
        },
        petName: pet?.name || 'Pet',
        status: statusFormatted,
        reference: b.reference,
      };
    });

    // 3. Transform Upcoming Bookings (Only future bookings strictly after now, sorted chronologically)
    const nowMinutes = today.getHours() * 60 + today.getMinutes();

    const upcomingBookings = allBookings
      .filter((b) => {
        const parsed = parseDateString(b.bookingDate);
        if (!parsed) return false;
        const norm = normalizeDateKey(parsed);
        if (norm > todayNormalized) return true;
        if (norm === todayNormalized) {
          const startM = parseTimeToMinutes(b.startTime);
          return startM >= nowMinutes;
        }
        return false;
      })
      .sort((a, b) => {
        const dateA = parseDateString(a.bookingDate)?.getTime() || 0;
        const dateB = parseDateString(b.bookingDate)?.getTime() || 0;
        if (dateA !== dateB) return dateA - dateB;
        return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
      })
      .slice(0, 5)
      .map((b) => {
        const pet = b.customer?.pets?.[0];
        const dateFormatted = b.bookingEndDate
          ? `${b.bookingDate} – ${b.bookingEndDate}`
          : b.bookingDate;

        return {
          id: String(b.id),
          clientName: `${b.customer.firstName} ${b.customer.lastName}`,
          petName: pet?.name || 'Pet',
          date: dateFormatted,
          time: b.startTime || '9:00 AM',
          service: b.serviceName,
          duration: formatBookingDuration(b),
          status: b.status,
          reference: b.reference,
        };
      });

    // 4. Transform Recent Activity from System Audit Logs
    let activities = systemLogs.map((log) => {
      let action = 'System Update';
      let themeClass = 'activity-booking';

      if (log.action.includes('BOOKING')) {
        action = 'New Booking Created';
        themeClass = 'activity-booking';
      } else if (log.action.includes('INTAKE')) {
        action = 'Intake Form Completed';
        themeClass = 'activity-intake';
      } else if (log.action.includes('WAITLIST')) {
        action = 'Waitlist Joined';
        themeClass = 'activity-intake';
      } else if (log.action.includes('PAYMENT') || log.action.includes('REFUND')) {
        action = log.action.includes('REFUND') ? 'Refund Issued' : 'Payment Received';
        themeClass = 'activity-payment';
      }

      return {
        id: String(log.id),
        action,
        details: log.details,
        time: formatRelativeTime(log.createdAt),
        themeClass,
      };
    });

    if (activities.length === 0) {
      activities = allBookings.slice(0, 3).map((b) => ({
        id: String(b.id),
        action: 'New Booking Created',
        details: `${b.customer.firstName} - ${b.serviceName} ($${Number(b.totalPrice).toFixed(2)})`,
        time: formatRelativeTime(b.createdAt),
        themeClass: 'activity-booking',
      }));
    }

    // 5. Waitlist Queue (Only actual waitlist entries)
    const waitlist = dbWaitlistEntries.map((w) => ({
      id: String(w.id),
      name: `${w.firstName} ${w.lastName || ''}`.trim(),
      petType: w.serviceDuration || '30 Minutes',
      service: w.serviceName,
      date: w.preferredDate,
      time: w.preferredTime,
      status: w.status === 'waiting' ? 'Requested' : w.status === 'availability_sent' ? 'Availability Sent' : w.status,
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        bookingsToday: bookingsTodayCount,
        visitsThisWeek: visitsThisWeekCount,
        revenueThisWeek: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        activeClients: activeClientsCount,
        activePets: activePetsCount,
      },
      todaySchedule,
      upcomingBookings,
      recentActivity: activities,
      waitlist,
      recentCustomers: recentCustomers.map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        pets: c.pets.map((p) => p.name),
      })),
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch admin dashboard overview data', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

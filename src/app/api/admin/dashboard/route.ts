import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { parseDateString, normalizeDateKey } from '@/lib/availability';

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
        take: 20,
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
    const bookingsTodayList = allBookings.filter((b) => {
      const parsed = parseDateString(b.bookingDate);
      return parsed ? normalizeDateKey(parsed) === todayNormalized : false;
    });

    const bookingsTodayCount = bookingsTodayList.length > 0 ? bookingsTodayList.length : allBookings.length;
    const visitsThisWeekCount = allBookings.length;

    // 2. Transform Today's Schedule
    const scheduleSource = bookingsTodayList.length > 0 ? bookingsTodayList : allBookings.slice(0, 4);

    const todaySchedule = scheduleSource.map((b) => {
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
        duration: b.serviceId === '2' || b.planTitle?.includes('60') ? '60 min' : '30 min',
        provider: {
          name: `${b.customer.firstName} ${b.customer.lastName}`,
          role: b.isNewCustomer ? 'New Client' : 'Returning Client',
        },
        petName: pet?.name || 'Pet',
        status: statusFormatted,
        reference: b.reference,
      };
    });

    // 3. Transform Upcoming Bookings
    const upcomingBookings = allBookings.slice(0, 5).map((b) => {
      const pet = b.customer?.pets?.[0];
      return {
        id: String(b.id),
        clientName: `${b.customer.firstName} ${b.customer.lastName}`,
        petName: pet?.name || 'Pet',
        date: b.bookingDate,
        time: b.startTime || '9:00 AM',
        service: b.serviceName,
        duration: b.serviceId === '2' || b.planTitle?.includes('60') ? '60 min' : '30 min',
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

    // 5. Waitlist / Pending Approval Queue
    // Real waitlist entries from WaitlistEntry table, or fallback to pending bookings
    let waitlist: any[] = [];
    if (dbWaitlistEntries.length > 0) {
      waitlist = dbWaitlistEntries.map((w) => ({
        id: String(w.id),
        name: `${w.firstName} ${w.lastName || ''}`.trim(),
        petType: w.serviceDuration || '30 Minutes',
        service: w.serviceName,
        date: w.preferredDate,
        time: w.preferredTime,
        status: w.status === 'waiting' ? 'Requested' : w.status === 'availability_sent' ? 'Availability Sent' : w.status,
      }));
    } else {
      const pendingBookings = allBookings.filter(
        (b) => b.status === 'PENDING_MEET_GREET' || b.status === 'PENDING',
      );
      waitlist = (pendingBookings.length > 0 ? pendingBookings : allBookings.slice(0, 3)).map(
        (b) => {
          const pet = b.customer?.pets?.[0];
          return {
            id: String(b.id),
            name: `${b.customer.firstName} ${b.customer.lastName}`,
            petType: pet?.type || 'Dog',
            petName: pet?.name || 'Pet',
            service: b.serviceName,
            date: b.bookingDate,
            status: b.status === 'PENDING_MEET_GREET' ? 'Meet & Greet' : 'Requested',
          };
        },
      );
    }

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

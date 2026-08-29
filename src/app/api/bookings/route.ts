import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import {
  getBookedIntervalsForDate,
  parseTimeToMinutes,
  formatMinutesToTime,
  resolveServiceDuration,
  isIntervalOverlapping,
} from '@/lib/availability';

export const dynamic = 'force-dynamic';

function generateBookingReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CPC-${year}${month}-${randomSuffix}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer: customerData,
      pet: petData,
      service: serviceData,
      schedule: scheduleData,
      pricing: pricingData,
      meetAndGreet: meetAndGreetData,
      isNewCustomer: requestedNewCustomer,
      payment: paymentData,
    } = body;

    // Validate required fields
    if (!customerData?.email || !customerData?.firstName || !customerData?.lastName) {
      return NextResponse.json(
        { success: false, message: 'Customer first name, last name, and email are required.' },
        { status: 400 },
      );
    }

    if (!serviceData?.serviceName || !pricingData?.totalPrice) {
      return NextResponse.json(
        { success: false, message: 'Valid service selection and price are required.' },
        { status: 400 },
      );
    }

    const email = customerData.email.trim().toLowerCase();
    const basePrice = parseFloat(pricingData.basePrice || '0') || 0;
    const additionalPetFee = parseFloat(pricingData.additionalPetFee || '0') || 0;
    const puppySurcharge = parseFloat(pricingData.puppySurcharge || '0') || 0;
    const holidaySurcharge = parseFloat(pricingData.holidaySurcharge || '0') || 0;
    const totalPrice = parseFloat(pricingData.totalPrice || '0') || 0;

    const additionalPetsCount = parseInt(petData?.additionalPets || '0', 10) || 0;
    const puppiesCount = parseInt(petData?.puppiesCount || '0', 10) || 0;

    // Double Booking Collision Validation Guard (for timed 30/60 min services)
    const isOvernight =
      String(serviceData.serviceId) === '3' &&
      (serviceData.planTitle?.toLowerCase().includes('overnight') ||
        Boolean(scheduleData?.bookingEndDate));

    if (!isOvernight && scheduleData?.bookingDate && scheduleData?.startTime) {
      const bookedIntervals = await getBookedIntervalsForDate(scheduleData.bookingDate);
      const startM = parseTimeToMinutes(scheduleData.startTime);
      const duration = resolveServiceDuration(
        String(serviceData.serviceId),
        serviceData.planTitle,
        scheduleData.startTime,
        scheduleData.endTime,
      );
      const endM = scheduleData.endTime
        ? parseTimeToMinutes(scheduleData.endTime)
        : startM + duration;

      const conflict = bookedIntervals.find((interval) =>
        isIntervalOverlapping(startM, endM, interval.startMinutes, interval.endMinutes),
      );

      if (conflict) {
        return NextResponse.json(
          {
            success: false,
            conflict: true,
            message: `The selected time (${scheduleData.startTime} - ${formatMinutesToTime(endM)}) on ${scheduleData.bookingDate} is no longer available as it overlaps with an existing booking (${conflict.serviceName}: ${conflict.startTime} - ${conflict.endTime}). Please select a different time slot.`,
          },
          { status: 409 },
        );
      }
    }

    // Generate reference code
    const bookingReference = generateBookingReference();

    // Use Prisma transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find or create Customer
      let customer = await tx.customer.findUnique({
        where: { email },
        include: { bookings: { take: 1 } },
      });

      const hasPastBookings = customer ? customer.bookings.length > 0 : false;
      const isNewCustomer = requestedNewCustomer ?? !hasPastBookings;

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            email,
            firstName: customerData.firstName.trim(),
            lastName: customerData.lastName.trim(),
            phone: customerData.phone?.trim() || '',
            address: customerData.address?.trim() || '',
            isColumbiaResident: Boolean(customerData.columbiaConfirmed ?? true),
            isNewCustomer,
          },
          include: { bookings: true },
        });
      } else {
        // Update contact info if changed
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            firstName: customerData.firstName.trim() || customer.firstName,
            lastName: customerData.lastName.trim() || customer.lastName,
            phone: customerData.phone?.trim() || customer.phone,
            address: customerData.address?.trim() || customer.address,
            isColumbiaResident:
              customerData.columbiaConfirmed !== undefined
                ? Boolean(customerData.columbiaConfirmed)
                : customer.isColumbiaResident,
            isNewCustomer: isNewCustomer,
          },
          include: { bookings: true },
        });
      }

      // 2. Create or find Pet record
      const petName = petData?.petName?.trim() || 'My Pet';
      let pet = await tx.pet.findFirst({
        where: {
          customerId: customer.id,
          name: petName,
        },
      });

      if (!pet) {
        pet = await tx.pet.create({
          data: {
            customerId: customer.id,
            name: petName,
            type: petData?.petType?.trim() || 'Dog',
            breed: petData?.petBreed?.trim() || null,
            age: petData?.petAge?.trim() || null,
            isPuppy: puppiesCount > 0,
            careInstructions: petData?.specialNotes?.trim() || null,
          },
        });
      }

      // 3. Determine booking status
      // If new customer: requires Meet & Greet before confirmation
      // If returning customer: already verified, directly confirmed
      const initialBookingStatus = isNewCustomer ? 'PENDING_MEET_GREET' : 'CONFIRMED';
      const initialPaymentStatus = paymentData?.paymentIntentId ? 'PAID' : 'UNPAID';

      // 4. Create Booking
      const booking = await tx.booking.create({
        data: {
          reference: bookingReference,
          customerId: customer.id,
          serviceId: String(serviceData.serviceId || '1'),
          serviceName: serviceData.serviceName,
          planTitle: serviceData.planTitle || null,
          status: initialBookingStatus,
          bookingDate: scheduleData?.bookingDate || new Date().toLocaleDateString(),
          bookingEndDate: scheduleData?.bookingEndDate || null,
          startTime: scheduleData?.startTime || null,
          endTime: scheduleData?.endTime || null,
          walkFrequency: scheduleData?.walkFrequency || null,
          preferredWeekdays: Array.isArray(scheduleData?.preferredWeekdays)
            ? scheduleData.preferredWeekdays.join(', ')
            : scheduleData?.preferredWeekdays || null,
          numberOfDays: scheduleData?.numberOfDays || 1,
          additionalPetsCount,
          puppiesCount,
          specialNotes: petData?.specialNotes?.trim() || null,
          basePrice,
          additionalPetFee,
          puppySurcharge,
          holidaySurcharge,
          totalPrice,
          paymentStatus: initialPaymentStatus,
          isNewCustomer,
        },
      });

      // 5. If new customer and Meet & Greet details provided, create record
      if (isNewCustomer && meetAndGreetData?.date && meetAndGreetData?.time) {
        await tx.meetAndGreet.create({
          data: {
            bookingId: booking.id,
            customerId: customer.id,
            date: meetAndGreetData.date,
            time: meetAndGreetData.time,
            address: customer.address || 'Customer Residence, Columbia, MO',
            status: 'SCHEDULED',
            notes: meetAndGreetData.notes || 'Compulsory initial visit for new client.',
          },
        });
      }

      // 6. Record Payment Transaction for billing & refund capability
      const paymentIntentId =
        paymentData?.paymentIntentId || `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const paymentMethod = paymentData?.paymentMethod || 'card';

      const transaction = await tx.transaction.create({
        data: {
          bookingId: booking.id,
          customerId: customer.id,
          paymentIntentId,
          paymentMethod,
          amount: totalPrice,
          currency: 'usd',
          status: 'SUCCEEDED',
          rawResponse: JSON.stringify({
            paymentIntentId,
            paymentMethod,
            amount: totalPrice,
            timestamp: new Date().toISOString(),
          }),
        },
      });

      // 7. Record System Audit Log
      await tx.systemLog.create({
        data: {
          action: 'BOOKING_CREATED',
          details: `Booking ${booking.reference} placed by ${customer.firstName} ${customer.lastName} (${customer.email}) for ${serviceData.serviceName}. Total: $${totalPrice.toFixed(2)}. New Customer: ${isNewCustomer}.`,
        },
      });

      return {
        booking,
        customer,
        pet,
        transaction,
        isNewCustomer,
      };
    });

    logger.info(
      `Successfully created booking ${result.booking.reference} for ${result.customer.email}`,
    );

    return NextResponse.json({
      success: true,
      bookingReference: result.booking.reference,
      bookingId: result.booking.id,
      customerId: result.customer.id,
      isNewCustomer: result.isNewCustomer,
      status: result.booking.status,
      paymentStatus: result.booking.paymentStatus,
      totalPrice: result.booking.totalPrice,
    });
  } catch (error: unknown) {
    logger.error('Failed to create booking', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const payment = searchParams.get('payment');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    if (payment && payment !== 'all') {
      where.paymentStatus = payment.toUpperCase();
    }

    if (search && search.trim()) {
      const query = search.trim();
      where.OR = [
        { reference: { contains: query } },
        { serviceName: { contains: query } },
        { customer: { firstName: { contains: query } } },
        { customer: { lastName: { contains: query } } },
        { customer: { email: { contains: query } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: {
          include: {
            pets: true,
          },
        },
        meetAndGreet: true,
        intakeProfiles: true,
        transactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error: unknown) {
    logger.error('Failed to fetch bookings list', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Booking ID is required.' },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status.toUpperCase();
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase();

    const booking = await prisma.booking.update({
      where: { id: parseInt(String(id), 10) },
      data: updateData,
      include: { customer: true },
    });

    // Record system log
    try {
      await prisma.systemLog.create({
        data: {
          action: 'BOOKING_UPDATED',
          details: `Booking ${booking.reference} status updated to ${booking.status} by admin.`,
        },
      });
    } catch {
      // safe to ignore
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: unknown) {
    logger.error('Failed to update booking', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

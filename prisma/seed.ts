import { prisma } from '../src/lib/prisma';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const adminEmail = 'admin@comopetcare.com';
  const hashedPassword = hashPassword('admin123');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Como Admin',
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Como Admin',
      role: 'ADMIN',
      password: hashedPassword,
    },
  });
  console.log(`✅ Default admin account ready: ${admin.email}`);

  // 2. Seed Default Business Settings
  await prisma.businessSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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
      enabledSections: 'morning,afternoon,evening',
      adminNotificationEmail: 'info@comopetcare.com',
      sendCustomerConfirmation: true,
      sendAdminNotification: true,
      minAdvanceHours: 2,
      requireMeetAndGreet: true,
    },
  });
  console.log('✅ Default business settings ready');

  // 3. Seed Default Service Configurations
  const defaultServices = [
    {
      id: 'walk_30',
      serviceId: '1',
      serviceName: 'Dog Walking',
      title: 'Solo Walk (30 Min)',
      description: 'Dedicated one-on-one neighborhood walk with personalized attention.',
      duration: '30 Minutes',
      basePrice: 25.0,
      priceText: '$25 / walk',
      badge: 'Popular',
      status: 'active',
    },
    {
      id: 'walk_60',
      serviceId: '1',
      serviceName: 'Dog Walking',
      title: 'Extended Adventure (60 Min)',
      description: 'Longer fitness walk, trail exploration, and high-energy exercise.',
      duration: '60 Minutes',
      basePrice: 40.0,
      priceText: '$40 / walk',
      savingText: 'Save $10 on longer walks',
      badge: 'Best Value',
      status: 'active',
    },
    {
      id: 'sit_30',
      serviceId: '2',
      serviceName: 'Pet Sitting',
      title: 'Drop-In Visit (30 Min)',
      description: 'Feeding, water refresh, litter/yard scoop, medication, and playtime in your home.',
      duration: '30 Minutes',
      basePrice: 28.0,
      priceText: '$28 / visit',
      status: 'active',
    },
    {
      id: 'puppy_30',
      serviceId: '3',
      serviceName: 'Puppy Care',
      title: 'Puppy Potty & Play (30 Min)',
      description: 'Gentle social playtime, routine reinforcement, potty break, and loving care.',
      duration: '30 Minutes',
      basePrice: 30.0,
      priceText: '$30 / visit',
      badge: 'Puppies < 1yr',
      status: 'active',
    },
    {
      id: 'mg_free',
      serviceId: '4',
      serviceName: 'Meet & Greet',
      title: 'Complimentary Consultation',
      description: 'A 15-minute in-home get-together to meet your pets and review care routines.',
      duration: '15 Minutes',
      basePrice: 0.0,
      priceText: 'Free',
      badge: 'New Clients',
      status: 'active',
    },
  ];

  for (const s of defaultServices) {
    await prisma.serviceConfiguration.upsert({
      where: { id: s.id },
      update: {
        title: s.title,
        description: s.description,
        basePrice: s.basePrice,
        priceText: s.priceText,
      },
      create: s,
    });
  }
  console.log('✅ Default service configurations ready');

  // 4. Seed Dummy Client 1: Sarah Jenkins (Confirmed Dog Walk + Paid)
  const client1 = await prisma.customer.upsert({
    where: { email: 'sarah.jenkins@example.com' },
    update: {},
    create: {
      email: 'sarah.jenkins@example.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      phone: '(573) 555-0142',
      address: '1402 Rollins St',
      city: 'Columbia',
      state: 'MO',
      zip: '65203',
      isColumbiaResident: true,
      isNewCustomer: false,
      notes: 'Gate latch is on the left side of fence. Great dog!',
    },
  });

  const pet1 = await prisma.pet.findFirst({
    where: { customerId: client1.id, name: 'Bella' },
  });
  if (!pet1) {
    await prisma.pet.create({
      data: {
        customerId: client1.id,
        name: 'Bella',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '3 years',
        isPuppy: false,
        feedingRoutine: '1 scoop dry kibble morning and evening.',
        temperamentNotes: 'Very sweet and friendly with people and other dogs.',
      },
    });
  }

  const booking1Ref = 'CPC-202609-0101';
  let booking1 = await prisma.booking.findUnique({
    where: { reference: booking1Ref },
  });
  if (!booking1) {
    booking1 = await prisma.booking.create({
      data: {
        reference: booking1Ref,
        customerId: client1.id,
        serviceId: '1',
        serviceName: 'Dog Walking',
        planTitle: 'Solo Walk (30 Min)',
        status: 'CONFIRMED',
        bookingDate: 'September 5, 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        numberOfDays: 1,
        basePrice: 25.0,
        totalPrice: 25.0,
        paymentStatus: 'PAID',
        isNewCustomer: false,
      },
    });

    await prisma.transaction.create({
      data: {
        bookingId: booking1.id,
        customerId: client1.id,
        paymentIntentId: 'pi_test_seed_0101',
        paymentMethod: 'card',
        amount: 25.0,
        currency: 'usd',
        status: 'SUCCEEDED',
      },
    });
  }

  // 5. Seed Dummy Client 2: Michael Brown (Cat Sitting + Pending Intake)
  const client2 = await prisma.customer.upsert({
    where: { email: 'michael.brown@example.com' },
    update: {},
    create: {
      email: 'michael.brown@example.com',
      firstName: 'Michael',
      lastName: 'Brown',
      phone: '(573) 555-0899',
      address: '804 University Ave',
      city: 'Columbia',
      state: 'MO',
      zip: '65201',
      isColumbiaResident: true,
      isNewCustomer: true,
    },
  });

  const pet2 = await prisma.pet.findFirst({
    where: { customerId: client2.id, name: 'Milo' },
  });
  if (!pet2) {
    await prisma.pet.create({
      data: {
        customerId: client2.id,
        name: 'Milo',
        type: 'Cat',
        breed: 'Domestic Shorthair',
        age: '2 years',
        isPuppy: false,
        feedingRoutine: 'Wet food can at 6 PM.',
      },
    });
  }

  const booking2Ref = 'CPC-202609-0102';
  const booking2 = await prisma.booking.findUnique({
    where: { reference: booking2Ref },
  });
  if (!booking2) {
    await prisma.booking.create({
      data: {
        reference: booking2Ref,
        customerId: client2.id,
        serviceId: '2',
        serviceName: 'Pet Sitting',
        planTitle: 'Drop-In Visit (30 Min)',
        status: 'PENDING',
        bookingDate: 'September 8, 2026',
        startTime: '2:00 PM',
        endTime: '2:30 PM',
        numberOfDays: 1,
        basePrice: 28.0,
        totalPrice: 28.0,
        paymentStatus: 'PAID',
        isNewCustomer: true,
      },
    });
  }

  // 6. Audit Log Entry
  await prisma.systemLog.create({
    data: {
      action: 'DATABASE_SEEDED',
      details: 'Initial deployment seed executed: admin account, business settings, services, and demo clients created.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('🎉 Seeding successfully finished with rich test data!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

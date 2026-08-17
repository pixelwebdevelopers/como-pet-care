import { prisma } from '../src/lib/prisma';
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  const adminEmail = 'admin@comopetcare.com';
  const hashedPassword = hashPassword('admin123');

  // Upsert to ensure seeding is safe to run multiple times
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

  console.log(`✅ Default admin account seeded: ${admin.email}`);

  // Create a system audit log entry
  await prisma.systemLog.create({
    data: {
      action: 'SEED',
      details: 'Database seeded successfully. Admin created.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('🌱 Seeding execution finished.');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

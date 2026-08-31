import mariadb from 'mariadb';
import 'dotenv/config';

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  const host = dbUrl.hostname || 'localhost';
  const port = dbUrl.port ? parseInt(dbUrl.port, 10) : 3306;
  const user = decodeURIComponent(dbUrl.username);
  const password = decodeURIComponent(dbUrl.password);
  const database = decodeURIComponent(dbUrl.pathname.substring(1));

  const conn = await mariadb.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  console.log('Connected to MySQL. Creating business_settings table...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS business_settings (
      id VARCHAR(191) PRIMARY KEY DEFAULT 'default',
      businessName VARCHAR(191) NOT NULL DEFAULT 'CoMo Pet Care',
      businessEmail VARCHAR(191) NOT NULL DEFAULT 'info@comopetcare.com',
      businessPhone VARCHAR(191) NOT NULL DEFAULT '(555) 256-2648',
      businessAddress VARCHAR(191) NOT NULL DEFAULT '123 Main St, Columbia, MO 65201',
      businessHours VARCHAR(191) NOT NULL DEFAULT '7:00 AM - 7:00 PM',
      websiteUrl VARCHAR(191) NOT NULL DEFAULT 'https://comopetcare.com',
      serviceArea VARCHAR(191) NOT NULL DEFAULT 'Columbia metro area and surrounding county areas.',
      openingTime VARCHAR(191) NOT NULL DEFAULT '7:00 AM',
      closingTime VARCHAR(191) NOT NULL DEFAULT '7:00 PM',
      slotInterval INT NOT NULL DEFAULT 30,
      enabledDays VARCHAR(191) NOT NULL DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
      customSlots TEXT,
      enabledSections VARCHAR(191) NOT NULL DEFAULT 'morning,afternoon,evening',
      adminNotificationEmail VARCHAR(191) NOT NULL DEFAULT 'info@comopetcare.com',
      sendCustomerConfirmation BOOLEAN NOT NULL DEFAULT true,
      sendAdminNotification BOOLEAN NOT NULL DEFAULT true,
      minAdvanceHours INT NOT NULL DEFAULT 2,
      requireMeetAndGreet BOOLEAN NOT NULL DEFAULT true,
      cancellationPolicy TEXT,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('Table business_settings successfully created or verified!');
  await conn.end();
}

main().catch((e) => {
  console.error('Error creating table:', e);
  process.exit(1);
});

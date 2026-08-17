import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { transporter } from '@/lib/mail';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'CONNECTED';
  let smtpStatus = 'CONNECTED';
  let isHealthy = true;

  // 1. Verify Database Connection
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    logger.error('Database health check failed', error);
    dbStatus = 'DISCONNECTED';
    isHealthy = false;
  }

  // 2. Verify SMTP Connection
  try {
    await transporter.verify();
  } catch (error) {
    logger.error('SMTP health check failed', error);
    smtpStatus = 'DISCONNECTED';
    isHealthy = false;
  }

  // Return health status report
  return NextResponse.json(
    {
      status: isHealthy ? 'OK' : 'ERROR',
      database: dbStatus,
      smtp: smtpStatus,
      timestamp: new Date().toISOString(),
    },
    {
      status: isHealthy ? 200 : 500,
    },
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify user session from cookies
    const sessionId = req.cookies.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized. Session not found.' }, { status: 401 });
    }

    // 2. Fetch admin user info to verify existence
    const user = await prisma.user.findUnique({
      where: { id: parseInt(sessionId, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. User not found.' }, { status: 401 });
    }

    // 3. Fetch system metrics in parallel
    const [totalUsers, totalLogs, activeOtps, systemLogs] = await prisma.$transaction([
      prisma.user.count(),
      prisma.systemLog.count(),
      prisma.verificationCode.count(),
      prisma.systemLog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 30, // Get latest 30 logs
      }),
    ]);

    logger.info(`Admin log access requested by user: ${user.email}`);

    return NextResponse.json({
      success: true,
      stats: {
        users: totalUsers,
        logs: totalLogs,
        activeOtps,
      },
      logs: systemLogs,
    });
  } catch (error) {
    logger.error('Unexpected error in /api/admin/logs route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    // Terminate session by deleting cookie
    response.cookies.delete('session_id');

    logger.info('User session terminated successfully.');
    return response;
  } catch (error) {
    logger.error('Unexpected error in /api/auth/logout route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

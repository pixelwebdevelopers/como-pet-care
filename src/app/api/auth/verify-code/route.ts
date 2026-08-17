import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

const verifyCodeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().length(6, 'Verification code must be exactly 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const validation = verifyCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, code } = validation.data;

    // Query database for verification code
    const record = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      logger.warn(`Verification failed: Invalid OTP code ${code} for email: ${email}`);
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

    // Check if code has expired
    if (record.expiresAt < new Date()) {
      logger.warn(`Verification failed: Expired OTP code ${code} for email: ${email}`);
      return NextResponse.json({ error: 'Verification code has expired.' }, { status: 400 });
    }

    logger.info(`OTP code verified successfully for email: ${email}`);

    // Create system audit log
    await prisma.systemLog.create({
      data: {
        action: 'VERIFY_OTP_SUCCESS',
        details: `Verified OTP successfully for email: ${email}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification successful.',
    });
  } catch (error) {
    logger.error('Unexpected error in /api/auth/verify-code route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

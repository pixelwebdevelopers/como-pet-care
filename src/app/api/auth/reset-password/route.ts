import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import * as crypto from 'crypto';

const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    code: z.string().length(6, 'Verification code must be exactly 6 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password confirmation must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email, code, password } = validation.data;

    // 1. Verify that the OTP code exists and is valid
    const record = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
      },
    });

    if (!record) {
      logger.warn(`Password reset failed: Invalid OTP code ${code} for email: ${email}`);
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      logger.warn(`Password reset failed: Expired OTP code ${code} for email: ${email}`);
      return NextResponse.json({ error: 'Verification code has expired.' }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = hashPassword(password);

    // 3. Update the user password in MySQL
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    // 4. Delete all OTP codes for this email so they cannot be reused
    await prisma.verificationCode.deleteMany({
      where: { email },
    });

    logger.info(`Password successfully updated in database for user: ${email}`);

    // Create system audit log
    await prisma.systemLog.create({
      data: {
        action: 'PASSWORD_RESET_SUCCESS',
        details: `Updated password successfully for email: ${email}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successful.',
    });
  } catch (error) {
    logger.error('Unexpected error in /api/auth/reset-password route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

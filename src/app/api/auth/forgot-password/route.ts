import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/mail';
import { logger } from '@/lib/logger';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 },
      );
    }

    const { email } = validation.data;

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account associated with this email address.' },
        { status: 404 },
      );
    }

    // 2. Generate a secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // 3. Clear previous codes and save the new OTP code
    await prisma.verificationCode.deleteMany({
      where: { email },
    });

    await prisma.verificationCode.create({
      data: {
        email,
        code: otpCode,
        expiresAt,
      },
    });

    // 4. Send Email with OTP code
    const emailHtml = emailTemplates.otp(otpCode);
    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset your Password — Como Pet Care',
      html: emailHtml,
    });

    if (!emailResult.success) {
      logger.error(`SMTP delivery failed for forgot-password OTP to ${email}`);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please check server SMTP configuration.' },
        { status: 502 },
      );
    }

    logger.info(`OTP generated and emailed to ${email}. Verification code: ${otpCode}`);

    // Create system audit log
    await prisma.systemLog.create({
      data: {
        action: 'FORGOT_PASSWORD_REQUEST',
        details: `Requested verification code for email: ${email}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email address.',
    });
  } catch (error) {
    logger.error('Unexpected error in /api/auth/forgot-password route', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
